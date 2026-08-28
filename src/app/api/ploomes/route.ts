import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy server-side para a API do Ploomes CRM.
 *
 * Existe por SEGURANÇA: a chave da API vivia hardcoded no client (bundle público)
 * e era enviada direto do browser para api2.ploomes.com. Agora ela mora só aqui,
 * em process.env.PLOOMES_API_KEY (sem prefixo NEXT_PUBLIC — nunca vaza pro bundle).
 *
 * Uma rota única com discriminador `action` porque todos os call sites do site
 * fazem POST com payload JSON e o shape de resposta esperado é o do próprio
 * Ploomes (forward transparente de status + corpo):
 *   - createContact → POST /Contacts    (payload = corpo Ploomes montado no client)
 *   - createDeal    → POST /Deals       (payload = corpo Ploomes montado no client)
 *   - patchContact  → PATCH /Contacts(id) (tag pós-criação do quiz V9)
 *   - checkPhone    → GET /Contacts?$filter=... (dedup por telefone; responde { exists })
 */

const PLOOMES_BASE_URL = 'https://api2.ploomes.com';

/** Timeout do dedup no upstream — o client aborta em 3s, então aqui fica abaixo disso. */
const CHECK_PHONE_TIMEOUT_MS = 2_500;

interface PloomesProxyBody {
  action?: string;
  payload?: unknown;
  contactId?: unknown;
  phone?: unknown;
}

/**
 * Predicado OData para casar um telefone no Ploomes apesar da formatação
 * (ex: "(31) 97226-8877"). contains() faz match literal, então "972268877" NÃO
 * acha por causa do traço. Solução: 2 chunks sempre contíguos em qualquer formato —
 * últimos 4 dígitos (após o traço) + 5 dígitos anteriores (antes do traço, celular BR).
 * (Movido de src/hooks/usePloomesAPI.ts — só dígitos entram no filtro, sem injeção.)
 */
function buildPhonePredicate(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const firstChunk = digits.slice(-9, -4);
  return firstChunk.length >= 4
    ? `contains(p/PhoneNumber, '${last4}') and contains(p/PhoneNumber, '${firstChunk}')`
    : `contains(p/PhoneNumber, '${last4}')`;
}

/** Forward transparente: repassa status e corpo do Ploomes para o client. */
async function forward(
  apiKey: string,
  path: string,
  method: 'POST' | 'PATCH',
  payload: unknown,
): Promise<NextResponse> {
  const upstream = await fetch(`${PLOOMES_BASE_URL}${path}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'user-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.PLOOMES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Configuração ausente no servidor: PLOOMES_API_KEY não definida.' },
      { status: 500 },
    );
  }

  let body: PloomesProxyBody;
  try {
    body = (await request.json()) as PloomesProxyBody;
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição não é JSON válido.' }, { status: 400 });
  }

  switch (body.action) {
    case 'createContact': {
      const payload = body.payload as { Name?: unknown; Phones?: unknown } | undefined;
      if (
        !payload ||
        typeof payload !== 'object' ||
        !isNonEmptyString(payload.Name) ||
        !Array.isArray(payload.Phones) ||
        payload.Phones.length === 0
      ) {
        return NextResponse.json(
          { error: 'Payload inválido para createContact: Name e Phones são obrigatórios.' },
          { status: 400 },
        );
      }
      return forward(apiKey, '/Contacts', 'POST', payload);
    }

    case 'createDeal': {
      const payload = body.payload as
        | { Title?: unknown; ContactId?: unknown; PipelineId?: unknown }
        | undefined;
      if (
        !payload ||
        typeof payload !== 'object' ||
        !isNonEmptyString(payload.Title) ||
        typeof payload.ContactId !== 'number' ||
        typeof payload.PipelineId !== 'number'
      ) {
        return NextResponse.json(
          { error: 'Payload inválido para createDeal: Title, ContactId e PipelineId são obrigatórios.' },
          { status: 400 },
        );
      }
      return forward(apiKey, '/Deals', 'POST', payload);
    }

    case 'patchContact': {
      const contactId = body.contactId;
      const payload = body.payload;
      if (typeof contactId !== 'number' || !Number.isInteger(contactId) || contactId <= 0) {
        return NextResponse.json(
          { error: 'Payload inválido para patchContact: contactId numérico é obrigatório.' },
          { status: 400 },
        );
      }
      if (!payload || typeof payload !== 'object') {
        return NextResponse.json(
          { error: 'Payload inválido para patchContact: payload é obrigatório.' },
          { status: 400 },
        );
      }
      return forward(apiKey, `/Contacts(${contactId})`, 'PATCH', payload);
    }

    case 'checkPhone': {
      const phone = body.phone;
      const digits = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
      if (digits.length < 4) {
        return NextResponse.json(
          { error: 'Payload inválido para checkPhone: phone com ao menos 4 dígitos é obrigatório.' },
          { status: 400 },
        );
      }

      // Fail-open (mesma semântica do client antigo): erro/timeout/upstream não-ok
      // respondem { exists: false } — nunca trava um lead legítimo por causa do dedup.
      try {
        const filter = encodeURIComponent(`Phones/any(p: ${buildPhonePredicate(digits)})`);
        const url = `${PLOOMES_BASE_URL}/Contacts?$filter=${filter}&$top=1&$select=Id,Name`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CHECK_PHONE_TIMEOUT_MS);

        const upstream = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'user-key': apiKey,
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!upstream.ok) {
          return NextResponse.json({ exists: false });
        }
        const data = (await upstream.json()) as { value?: unknown[] };
        return NextResponse.json({ exists: (data.value?.length || 0) > 0 });
      } catch {
        return NextResponse.json({ exists: false });
      }
    }

    default:
      return NextResponse.json({ error: `Ação desconhecida: ${String(body.action)}` }, { status: 400 });
  }
}
