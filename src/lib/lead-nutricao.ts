/**
 * NUTRIÇÃO — lead NOVO com nota < 60 vai para o WhatsApp do Lucas, não para a fila do SDR.
 *
 * Decisão do André (06/Out/26, ADR-035 no bestbarbers-ai). Só o contato novo abaixo do corte
 * muda de caminho: em vez de nascer pela chave do Ploomes do site (que dispara a automação do
 * card na Qualificação e o rodízio de SDR), o cadastro vai para a rota do OS
 * `POST /api/ploomes/lead-nutricao`, que cria o contato pelo usuário "Lucas (IA)" e o card no
 * pipe "Nutrição (< 60)". Com o 201, a página leva o lead ao WhatsApp do Lucas com a mensagem
 * pronta e o código do card.
 *
 * Nota ≥ 60, sem nota, telefone que já existe (recadastro), número do Lucas vazio ou qualquer
 * falha da rota (rede, timeout, 409, 5xx, resposta inesperada): o caminho de hoje, intacto.
 * Nunca perder lead vale mais que a nutrição.
 *
 * Contrato com a rota: `leadNutricaoBodySchema` em bestbarbers-ai/os/routes/ploomes-crm.ts.
 * Contrato com o Lucas: a mensagem termina em "(cód. <dealId>)" — ver `linkDoWhatsAppLucas`.
 */

import type { LeadAttribution, LeadAttributionFields } from "./lead-attribution";
// Extensão explícita: é o que permite ao `node --test` (npm test) carregar o módulo sem build.
import { baseDoOS } from "./recadastro.ts";

/** Corte da fila do SDR. Mesmo número de `CORTE_NOTA_SDR` no OS (lib/integrations/ploomes-fields.ts). */
export const CORTE_NOTA_LUCAS = 60;

/** Acima disso o lead esperando é pior que o caminho de hoje (a rota faz 3 chamadas ao Ploomes). */
export const TIMEOUT_NUTRICAO_MS = 5_000;

/**
 * A nota está abaixo do corte? Mesma regra do servidor (`abaixoDoCorte` em
 * bestbarbers-ai/lib/integrations/ploomes-nutricao.ts): 59,9 está; nota ausente ou NaN não está.
 */
export function abaixoDoCorte(nota: number | null | undefined): boolean {
  return typeof nota === "number" && Number.isFinite(nota) && Math.trunc(nota) < CORTE_NOTA_LUCAS;
}

/** Só dígitos, e só no formato 55 + DDD + número. Fora disso é "sem número" (string vazia). */
export function numeroValidoDoLucas(numero: string): string {
  const digitos = numero.replace(/\D/g, "");
  return /^55\d{10,11}$/.test(digitos) ? digitos : "";
}

export type CaminhoDoLead = "recadastro" | "lucas" | "sdr";

/**
 * Qual caminho o cadastro segue. `lucas` é só uma TENTATIVA: se a rota não devolver o card,
 * `cadastrarContatoNovo` cai no `sdr`. Sem número do Lucas a rota nem é chamada — o card da
 * nutrição sem WhatsApp para mandar o lead seria um lead que ninguém atende.
 */
export function caminhoDoLead(input: {
  telefoneExiste: boolean;
  nota: number | null | undefined;
  numeroLucas: string;
}): CaminhoDoLead {
  if (input.telefoneExiste) return "recadastro";
  if (abaixoDoCorte(input.nota) && numeroValidoDoLucas(input.numeroLucas)) return "lucas";
  return "sdr";
}

/** O contato exatamente como `usePloomesAPI.buildContactPayload` monta para o POST /Contacts. */
export interface ContatoDoSite {
  Name: string;
  Email?: string;
  OriginId?: number | null;
  Phones: Array<{ PhoneNumber: string; TypeId?: number; CountryId?: number }>;
  OtherProperties: Array<{ FieldKey: string; StringValue: string } | { FieldKey: string; IntegerValue: number }>;
}

export interface CorpoNutricao {
  contato: Omit<ContatoDoSite, "OriginId"> & { OriginId?: number };
  card: {
    origemDesc?: string;
    faturamento?: string;
    colaboradores?: string;
    clube?: string;
    sistema?: string;
    leadScore: number;
    atribuicao: LeadAttributionFields;
  };
}

/**
 * Corpo do POST da nutrição. O contato vai como o site já monta; o card leva os mesmos campos
 * do recadastro (`src/lib/recadastro.ts`). `OriginId` nulo SAI do corpo: o schema da rota não
 * aceita `null`, e um 400 aqui mandaria todo lead sem origem de volta ao SDR.
 */
export function corpoDaNutricao(input: {
  contato: ContatoDoSite;
  atribuicao: LeadAttribution;
  nota: number;
  faturamento?: string;
  colaboradores?: string;
  clube?: string;
  sistema?: string;
}): CorpoNutricao {
  const { OriginId, ...contato } = input.contato;
  return {
    contato: { ...contato, ...(OriginId ? { OriginId } : {}) },
    card: {
      ...(input.atribuicao.originDesc ? { origemDesc: input.atribuicao.originDesc } : {}),
      ...(input.faturamento ? { faturamento: input.faturamento } : {}),
      ...(input.colaboradores ? { colaboradores: input.colaboradores } : {}),
      ...(input.clube ? { clube: input.clube } : {}),
      ...(input.sistema ? { sistema: input.sistema } : {}),
      leadScore: Math.trunc(input.nota),
      atribuicao: input.atribuicao.fields,
    },
  };
}

/**
 * `contactId` (opcional) é o contato criado pela rota, que já o devolve no 201. O curso de
 * assinatura usa para a inscrição (contrato `02-contrato-tecnico.md` §2.2, no bestbarbers-ai).
 */
export type ResultadoNutricao =
  | { ok: true; dealId: number; contactId?: number | null }
  | { ok: false; motivo: string };

/**
 * POST na rota do OS. NUNCA lança: devolve o card ou o motivo. Só 201 com `status: "criado"` e
 * `dealId` inteiro conta como sucesso; o resto (409 fora do corte, 502, 503 sem chave, 400,
 * timeout, rede, corpo estranho) é falha e o lead segue o caminho de hoje.
 *
 * Risco aceito: se a rota responder depois do timeout, o card da nutrição existe E o site cria
 * o contato pelo caminho de hoje — o lead fica nos dois pipes. Duplicado se limpa; lead perdido não.
 */
export async function criarLeadNutricao(
  corpo: CorpoNutricao,
  opcoes: { fetch?: typeof fetch; timeoutMs?: number } = {},
): Promise<ResultadoNutricao> {
  const fazerFetch = opcoes.fetch ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opcoes.timeoutMs ?? TIMEOUT_NUTRICAO_MS);

  try {
    const res = await fazerFetch(`${baseDoOS()}/api/ploomes/lead-nutricao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(corpo),
    });
    if (res.status !== 201) return { ok: false, motivo: `http_${res.status}` };
    const data = (await res.json()) as { status?: unknown; dealId?: unknown; contactId?: unknown };
    if (data?.status !== "criado" || !Number.isInteger(data.dealId) || (data.dealId as number) <= 0) {
      return { ok: false, motivo: "resposta_inesperada" };
    }
    const contactId = Number.isInteger(data.contactId) && (data.contactId as number) > 0 ? (data.contactId as number) : null;
    return { ok: true, dealId: data.dealId as number, contactId };
  } catch (err) {
    return { ok: false, motivo: err instanceof Error ? err.name : "erro" };
  } finally {
    clearTimeout(timeout);
  }
}

/** O que o cadastro do contato novo de fato fez (o `caminho` é o que RODOU, não o que se tentou). */
export interface ContatoCadastrado {
  caminho: Exclude<CaminhoDoLead, "recadastro">;
  /** Card da nutrição; `null` quando o lead foi para o SDR (o card nasce pela automação). */
  dealId: number | null;
  /** Contato criado, quando a resposta trouxe o id. */
  contactId: number | null;
}

/**
 * Cadastro do contato NOVO (o recadastro tem caminho próprio). `lucas` tenta a nutrição e,
 * se ela falhar, faz o caminho de hoje; `sdr` faz só o caminho de hoje. Devolve o caminho que
 * rodou (`lucas` que falhou vira `sdr`), o `dealId` do card da nutrição (ou `null`) e o
 * `contactId`, que o curso de assinatura usa na inscrição.
 */
export async function cadastrarContatoNovo(
  caminho: Exclude<CaminhoDoLead, "recadastro">,
  nutricao: () => Promise<ResultadoNutricao>,
  caminhoDeHoje: () => Promise<{ contactId: number | null } | void>,
): Promise<ContatoCadastrado> {
  if (caminho === "lucas") {
    const resultado = await nutricao();
    if (resultado.ok) return { caminho: "lucas", dealId: resultado.dealId, contactId: resultado.contactId ?? null };
    // Falha nunca silenciosa: o lead não se perde, mas quem abrir o console vê o porquê.
    console.warn(`[Lucas] a rota da nutrição falhou (${resultado.motivo}); o lead segue para o SDR.`);
  }
  const hoje = await caminhoDeHoje();
  return { caminho: "sdr", dealId: null, contactId: hoje?.contactId ?? null };
}

/**
 * Mensagem da página do formulário: o `caminho` mais longo que casar (a própria página ou
 * qualquer uma abaixo dela) vence; nenhuma casou, a padrão.
 */
export function mensagemDaPagina(
  pathname: string,
  mensagens: ReadonlyArray<{ caminho: string; mensagem: string }>,
  padrao: string,
): string {
  const pagina = pathname.replace(/\/+$/, "") || "/";
  const casou = mensagens
    .filter(({ caminho }) => pagina === caminho || pagina.startsWith(`${caminho}/`))
    .sort((a, b) => b.caminho.length - a.caminho.length)[0];
  return casou?.mensagem ?? padrao;
}

/**
 * Link do WhatsApp do Lucas com a mensagem pronta. O código no fim é o `dealId` inteiro do
 * card da nutrição: o lead não digita nada (vem preenchido), e o Lucas lê o card direto pelo id
 * mesmo quando a pessoa escreve de outro número. Formato fixo, que o Lucas reconhece:
 * "(cód. <dealId>)".
 */
export function linkDoWhatsAppLucas(numero: string, mensagem: string, dealId: number): string {
  const texto = `${mensagem} (cód. ${dealId})`;
  return `https://wa.me/${numeroValidoDoLucas(numero)}?text=${encodeURIComponent(texto)}`;
}

/** Evento que o formulário dispara e a tela do WhatsApp (`ConversaComLucas`, no layout raiz) ouve. */
export const EVENTO_CONVERSA_LUCAS = "bb:conversa-lucas";

export interface ConversaComLucas {
  link: string;
  /** true = a página entrega algo depois do formulário (tabela, guia): só o botão, nunca abre sozinha. */
  soBotao: boolean;
}

export function abrirConversaComLucas(conversa: ConversaComLucas): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ConversaComLucas>(EVENTO_CONVERSA_LUCAS, { detail: conversa }));
}
