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
}

export interface RecadastroResultado {
  ok: boolean;
  dealId?: number;
  motivo?: string;
}

/** Timeout do backend — acima disso o lead esperando já é pior que a mensagem antiga. */
const TIMEOUT_MS = 12_000;

export async function criarCardRecadastro(input: RecadastroInput): Promise<RecadastroResultado> {
  const base =
    process.env.NEXT_PUBLIC_BBAI_DASHBOARD_URL ||
    process.env.NEXT_PUBLIC_BBAI_API_URL ||
    "https://bbai.bestbarbers.app";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/api/ploomes/recadastro-deal`, {
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
        atribuicao: input.atribuicao.fields,
      }),
    });

    if (!res.ok) {
      return { ok: false, motivo: `http_${res.status}` };
    }
    const data = (await res.json()) as { dealId?: number };
    return { ok: true, dealId: data?.dealId };
  } catch (err) {
    return { ok: false, motivo: err instanceof Error ? err.name : "erro" };
  } finally {
    clearTimeout(timeout);
  }
}
