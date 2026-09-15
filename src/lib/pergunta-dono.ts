/**
 * PERGUNTA DO DONO — "Você é dono de barbearia?" para o tráfego do TOPO.
 *
 * Por quê: o topo otimiza por visita à página (LPV) e a régua julga criativo por
 * custo/visita — moeda que não distingue dono de curioso. Um clique de "sou dono"
 * é uma moeda melhor: fica entre "clicou" e "preencheu o form", com volume perto do
 * primeiro e significado perto do segundo. Decisão do André (15/Set/26): fase 1 =
 * o evento roda como MEDIÇÃO e PÚBLICO (régua do topo + remarketing de donos
 * confirmados); só vira objetivo de otimização depois de medir a taxa de resposta.
 *
 * Este módulo é PURO (sem React, sem fbq): quem mostra é `components/tracking/
 * PerguntaDono.tsx`, quem dispara é `useMetaPixel().trackNonCatalogEvent`
 * (fbq('trackCustom') + image pixel com o MESMO eventID). Aqui moram: a regra de
 * QUANDO perguntar, os nomes dos eventos e os parâmetros que vão com a resposta.
 *
 * Condicional por CAMPANHA (prefixo do `utm_campaign`, que o url_tags preenche com
 * {{campaign.name}}), com o `fase=` como segunda via — o mesmo espírito do
 * CELULAS_COM_CORTE do useLeadForm: a régua mora no código, a URL só carrega a
 * etiqueta. Orgânico, SEO, meio e fundo NUNCA veem o modal.
 */

export type RespostaDono = "sim" | "nao";

/** Dois eventos distintos (não um evento com parâmetro): público e conversão
 *  personalizada casam por NOME de evento sem depender de regra por parâmetro. */
export const EVENTO_POR_RESPOSTA: Readonly<Record<RespostaDono, string>> = {
  sim: "DonoBarbearia",
  nao: "NaoDonoBarbearia",
};

/** Prefixos de campanha que recebem a pergunta (comparação sem caixa). */
export const CAMPANHAS_COM_PERGUNTA: ReadonlyArray<string> = ["BB-TOPO-"];
/** Segunda via: `fase=TOPO-SET26` (url_tags padrão da fase). */
export const FASES_COM_PERGUNTA: ReadonlyArray<string> = ["TOPO"];

/** Espera a página pintar (e o LPV da Meta registrar) antes de perguntar. */
export const ATRASO_MS = 1500;
/** localStorage: resposta dada — nunca pergunta de novo neste navegador. */
export const CHAVE_RESPOSTA = "bb_dono";
/** sessionStorage: fechou sem responder — não insiste nesta sessão. */
export const CHAVE_DISPENSA = "bb_dono_dispensou";

/** Macro não resolvida pela Meta (`{{campaign.name}}` literal em ~0,8 % dos cliques). */
const semMacro = (v: string | null | undefined): string | null =>
  v && !v.includes("{{") ? v : null;

const comecaCom = (valor: string | null, prefixos: ReadonlyArray<string>): boolean =>
  !!valor && prefixos.some((p) => valor.toUpperCase().startsWith(p.toUpperCase()));

/**
 * Decide se a pergunta aparece nesta visita. `search` = `window.location.search`;
 * `campanhaSessao` = `utm_campaign` do snapshot da sessão (useUtmParams grava em
 * sessionStorage), para a navegação interna depois do primeiro clique.
 */
export function deveMostrarPergunta(search: string, campanhaSessao?: string | null): boolean {
  const q = new URLSearchParams(search);
  const campanha = semMacro(q.get("utm_campaign")) ?? semMacro(campanhaSessao);
  const fase = semMacro(q.get("fase"));
  return comecaCom(campanha, CAMPANHAS_COM_PERGUNTA) || comecaCom(fase, FASES_COM_PERGUNTA);
}

export interface ParametrosResposta {
  resposta: RespostaDono;
  pagina: string;
  campanha?: string;
  publico?: string;
  ad_id?: string;
  porta?: number;
  [k: string]: string | number | undefined;
}

/**
 * Parâmetros que acompanham o evento — sem dado pessoal. `publico` (= adset.name) e
 * `ad_id` permitem ler a resposta por célula e por criativo no Events Manager; a
 * `porta` vem de `portaDoLead(pathname, utm_content)` (link vence a página, como no
 * Lead) e chega por parâmetro para este módulo seguir sem imports — o runner de
 * testes do Node não resolve import relativo sem extensão.
 */
export function parametrosDaResposta(resposta: RespostaDono, search: string, pathname: string, porta?: number | null): ParametrosResposta {
  const q = new URLSearchParams(search);
  const adId = semMacro(q.get("ad_id"));
  const out: ParametrosResposta = { resposta, pagina: pathname.replace(/\/+$/, "") || "/" };
  const campanha = semMacro(q.get("utm_campaign"));
  const publico = semMacro(q.get("publico"));
  if (campanha) out.campanha = campanha;
  if (publico) out.publico = publico;
  if (adId && /^\d+$/.test(adId)) out.ad_id = adId;
  if (porta) out.porta = porta;
  return out;
}

export interface RespostaGravada { resposta: RespostaDono; ts: number }

export function lerResposta(storage: Pick<Storage, "getItem"> | undefined): RespostaGravada | null {
  try {
    const raw = storage?.getItem(CHAVE_RESPOSTA);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<RespostaGravada>;
    return v.resposta === "sim" || v.resposta === "nao" ? { resposta: v.resposta, ts: Number(v.ts) || 0 } : null;
  } catch {
    return null;
  }
}

export function gravarResposta(storage: Pick<Storage, "setItem"> | undefined, resposta: RespostaDono, ts: number): void {
  try {
    storage?.setItem(CHAVE_RESPOSTA, JSON.stringify({ resposta, ts } satisfies RespostaGravada));
  } catch {
    /* privacy mode etc. — a resposta ainda vai ao pixel */
  }
}

export function foiDispensada(storage: Pick<Storage, "getItem"> | undefined): boolean {
  try {
    return storage?.getItem(CHAVE_DISPENSA) === "1";
  } catch {
    return false;
  }
}

export function marcarDispensa(storage: Pick<Storage, "setItem"> | undefined): void {
  try {
    storage?.setItem(CHAVE_DISPENSA, "1");
  } catch {
    /* idem */
  }
}
