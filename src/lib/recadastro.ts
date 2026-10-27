/**
 * RECADASTRO — telefone que JÁ existe no Ploomes se cadastrando de novo.
 *
 * Antes o form barrava com "já estamos em contato" e o sinal morria. Agora chama o
 * backend (bestbarbers-ai), que cria um card NOVO no pipe de Qualificação para o
 * contato existente — mesmas informações do fluxo padrão + o SDR replicado do card
 * anterior. Os SDRs fazem a gestão dos duplicados no CRM, e passamos a ter o
 * histórico de cadastros por cliente e por campanha.
 *
 * Por que no backend e não aqui: achar o contato certo (o CRM tem contatos duplicados
 * com o mesmo telefone), escolher o card de referência e preencher ~20 campos do deal
 * é lógica demais para viver replicada nos 6 formulários do site.
 *
 * Síncrono de propósito — a resposta decide entre a tela de sucesso e a mensagem
 * antiga. Falhou (backend fora, timeout)? O form cai no comportamento de hoje;
 * nada quebra para o lead.
 */

import type { LeadAttribution } from "./lead-attribution";

export interface RecadastroInput {
  phone: string;
  barbershopName: string;
  atribuicao: LeadAttribution;
  faturamento?: string;
  colaboradores?: string;
  /** Pergunta 7 do formulário v2 — situação do clube (string canônica de lead-score.ts). */
  clube?: string;
  /** Pergunta 6 do formulário v2 — sistema usado hoje. */
  sistema?: string;
  /** Formulário v3 (27/Out/26) — "Quando quer começar?". O OS decide o pipe por ele. */
  quando?: string;
  /**
   * E-mail digitado no formulário (opcional). No recadastro não nasce contato novo,
   * então o endereço só chega ao CRM se vier por aqui — o backend o grava no contato
   * existente APENAS quando o campo está vazio lá, nunca sobrescrevendo.
   */
  email?: string;
  /**
   * Pede a Nutrição (emenda de 10/Out/26 ao ADR-035): nota < 60 com o desvio do Lucas ligado
   * (`pedeNutricaoNoRecadastro`). O OS cria o card no pipe do Lucas e devolve `pipe: "nutricao"`,
   * ou fica na Qualificação (venda aberta no Fechamento, falha) e devolve `pipe: "qualificacao"`.
   */
  nutricao?: boolean;
}

export interface RecadastroResultado {
  ok: boolean;
  dealId?: number;
  /** Contato existente que ganhou o card (a rota já devolve). O curso de assinatura usa na inscrição. */
  contactId?: number;
  /** Onde o OS pôs o card. Sem o campo (OS anterior a 10/Out/26) = Qualificação. */
  pipe?: "qualificacao" | "nutricao";
  motivo?: string;
}

/** Timeout do backend — acima disso o lead esperando já é pior que a mensagem antiga. */
const TIMEOUT_MS = 12_000;

/** Base do OS (bestbarbers-ai) que o formulário chama. A nutrição do < 60 usa a mesma. */
export function baseDoOS(): string {
  return (
    process.env.NEXT_PUBLIC_BBAI_DASHBOARD_URL ||
    process.env.NEXT_PUBLIC_BBAI_API_URL ||
    "https://bbai.bestbarbers.app"
  );
}

export async function criarCardRecadastro(
  input: RecadastroInput,
  opts: { fetch?: typeof fetch } = {},
): Promise<RecadastroResultado> {
  const base = baseDoOS();
  const fazerFetch = opts.fetch ?? fetch;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fazerFetch(`${base}/api/ploomes/recadastro-deal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        phone: input.phone,
        barbershopName: input.barbershopName,
        ...(input.atribuicao.originId ? { originId: input.atribuicao.originId } : {}),
        ...(input.atribuicao.originDesc ? { origemDesc: input.atribuicao.originDesc } : {}),
        ...(input.faturamento ? { faturamento: input.faturamento } : {}),
        ...(input.colaboradores ? { colaboradores: input.colaboradores } : {}),
        // Campos do formulário v2. O zod do backend DESCARTA chave desconhecida em
        // silêncio: enquanto `os/routes/ploomes-crm.ts` não aceitar `clube` e `sistema`,
        // o recadastro entra sem eles — e nada quebra por causa disso.
        ...(input.clube ? { clube: input.clube } : {}),
        ...(input.sistema ? { sistema: input.sistema } : {}),
        ...(input.quando ? { quando: input.quando } : {}),
        ...(input.email?.trim() ? { email: input.email.trim().toLowerCase() } : {}),
        // Score numérico → bb_lead_score do card (o backend traduz para a FieldKey do deal).
        ...(typeof input.atribuicao.leadScore === 'number' ? { leadScore: Math.trunc(input.atribuicao.leadScore) } : {}),
        atribuicao: input.atribuicao.fields,
        ...(input.nutricao ? { nutricao: true } : {}),
      }),
    });

    if (!res.ok) {
      return { ok: false, motivo: `http_${res.status}` };
    }
    const data = (await res.json()) as { dealId?: number; contactId?: number; pipe?: unknown };
    const pipe = data?.pipe === "nutricao" || data?.pipe === "qualificacao" ? data.pipe : undefined;
    return { ok: true, dealId: data?.dealId, contactId: data?.contactId, ...(pipe ? { pipe } : {}) };
  } catch (err) {
    return { ok: false, motivo: err instanceof Error ? err.name : "erro" };
  } finally {
    clearTimeout(timeout);
  }
}
