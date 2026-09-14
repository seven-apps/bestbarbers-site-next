/**
 * ATRIBUIÇÃO DO LEAD — fonte ÚNICA da montagem de origem/campanha do cadastro.
 *
 * Dois consumidores usam exatamente este payload:
 *   1. lead novo   → usePloomesAPI.createContact grava nos campos do CONTATO
 *                    (a automação do Ploomes espelha Contact→Deal);
 *   2. recadastro  → src/lib/recadastro.ts manda para o backend, que cria o card
 *                    direto no pipe de Qualificação (não há contato novo para espelhar).
 *
 * Os campos trafegam por NOME LÓGICO (bb_campaign_id, …) e cada lado traduz para as
 * suas FieldKeys — é isso que impede as duas montagens de divergirem com o tempo.
 */

import type { UtmParams } from "@/hooks/useUtmParams";
// Extensão explícita: é o que permite ao `node --test` (npm test) carregar este
// módulo sem build. Ver `allowImportingTsExtensions` no tsconfig.
import { interesseLegado } from "./lead-score.ts";

/** Campos bb_* em nome lógico — idênticos no Contact e no Deal do Ploomes. */
export interface LeadAttributionFields {
  bb_campaign_id?: string;
  bb_campaign_name?: string;
  bb_adset_id?: string;
  bb_ad_id?: string;
  bb_lp_version?: string;
  bb_wave?: string;
  bb_audience_type?: string;
  bb_utm_source?: string;
  bb_utm_medium?: string;
  bb_utm_campaign?: string;
  bb_utm_content?: string;
  bb_utm_term?: string;
  bb_fbclid?: string;
  bb_gclid?: string;
  bb_lead_event_id?: string;
}

export interface LeadAttribution {
  originId: number | null;
  /** Descrição da campanha COMPLETA, já com [SCORE:] e [Interesse:] na frente. */
  originDesc: string | null;
  fields: LeadAttributionFields;
  /**
   * Score do lead como NÚMERO — vai para `bb_lead_score` (inteiro) no Contact
   * (usePloomesAPI.createContact) e no Deal de recadastro (backend). undefined = a LP
   * não calcula score (v8/v9/v10, forms IG) → campo fica vazio, nunca 0.
   */
  leadScore?: number;
}

export interface BuildLeadAttributionInput {
  utmParams: UtmParams;
  /** originId/originDesc do mapeamento de UTM (ou customizados pela página). */
  originId: number | null;
  originDesc: string | null;
  /**
   * Resposta da pergunta 7 (situação do clube). O `[Interesse: ...]` da descrição é
   * DERIVADO dela por `interesseLegado` — a pergunta "qual ferramenta te interessa"
   * deixou de existir em 14/Set/26, mas os leitores de tráfego e o pool da reativação
   * casam pelas duas strings antigas, então é a tradução que mantém a série viva.
   */
  clubStatus?: string;
  leadScore?: number;
  leadEventId?: string;
}

/**
 * Monta a atribuição a partir da URL atual (Meta url_tags Wave 4 — 8 segmentos — com
 * fallback legacy) + UTMs. Extraída de usePloomesAPI.createContact sem mudança de
 * comportamento: o formato da Descrição da Campanha é o que os leitores de tráfego
 * parseiam hoje (bestbarbers-ai/scripts/trafego-pago/*: split('|') índices 4 e 5).
 */
export function buildLeadAttribution(input: BuildLeadAttributionInput): LeadAttribution {
  const { utmParams, originId, clubStatus, leadScore, leadEventId } = input;

  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  // Macro da Meta não substituída ({{ad.name}}, {{campaign.id}}…) = ausência de dado, nunca
  // valor: acontece em ~0,8% dos cliques com fbclid (anúncio compartilhado por DM, aberto
  // pelo perfil). Gravar o placeholder poluía bb_campaign_name/bb_utm_content e a descrição.
  const semMacro = (v: string | null | undefined) => (v && !v.includes("{{") ? v : "");
  const param = (k: string) => semMacro(search?.get(k)?.trim());

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  // bb_lp_version = DE QUAL PÁGINA o lead veio (grava no Ploomes).
  // - LPs de ads /vNN → "V12"/"V8" (uppercase): retrocompat + os leitores de tráfego
  //   parseiam o 1º segmento do originDesc (bestbarbers-ai/scripts/trafego-pago/*).
  // - Demais rotas → o próprio slug da página: "cadeira-cheia", "tabela-precificacao-clube",
  //   "parceiros" (o que o André pediu — saber a isca/LP de origem, não o genérico "LP").
  // - Raiz do site → "home".
  // Antes: tudo que não fosse /vNN caía em "LP" e o Ploomes não distinguia as iscas.
  const seg = pathname.replace(/^\/+|\/+$/g, "");
  const lpVersion = seg.match(/^v\d+/i)?.[0]?.toUpperCase() || seg.split("/")[0] || "home";

  const fase = param("fase");
  const campanha = param("campanha");
  const publico = param("publico") || param("adset");
  const adName = param("ad") || param("adname");
  // Id NUMÉRICO do anúncio (url_tags `ad_id={{ad.id}}`) — chave 1:1 com a Meta. O nome já
  // vive em bb_utm_content; a Descrição da Campanha (250 chars) trunca nomes longos.
  const adIdParam = param("ad_id");
  const adId = adIdParam && /^\d+$/.test(adIdParam) ? adIdParam : null;
  const creative = param("creative") || semMacro(utmParams.utm_content);
  const angulo = param("angulo");
  const audiencia = param("audiencia") || publico;

  // Sinal do Meta url_tags Wave 4+ → formato 8-segments. Usa param('creative') direto
  // (não o fallback utm_content) para não acionar 8-segs em LPs legacy.
  const has8Segs = fase || campanha || publico || adName || param("creative") || angulo;

  let originDesc: string | null;
  if (has8Segs) {
    originDesc = [
      lpVersion,
      fase || "W?",
      campanha || "n/d",
      publico || "n/d",
      adName || "n/d",
      creative || "n/d",
      angulo || "n/d",
      audiencia || "n/d",
    ].join(" | ");
  } else {
    // Fallback legacy: "LP V8 - Lead Machine | consolidado-abr26 | du-01"
    let builder = input.originDesc || "";
    if (campanha) builder += ` | ${campanha}`;
    if (utmParams.utm_content) builder += ` | ${utmParams.utm_content}`;
    originDesc = builder || null;
  }

  // Score e Interesse no início da descrição — visibilidade do SDR e leitura de CPQL.
  //
  // O prefixo vale MESMO SEM originDesc. Antes ele vivia dentro de `if (originDesc)`, e
  // quem chegava sem descrição de campanha (/parceiros, as calculadoras e a /v12 orgânica
  // caem no ramo legacy, onde `builder` nasce vazio) perdia o `[SCORE: n]` inteiro — o
  // SDR via o card sem nota e o lead sumia da leitura de CPQL sem nenhum aviso.
  const interesse = clubStatus ? interesseLegado(clubStatus) : undefined;
  let prefixo = "";
  if (interesse) prefixo = `[Interesse: ${interesse}] `;
  if (leadScore !== undefined) prefixo = `[SCORE: ${leadScore}] ${prefixo}`;
  if (prefixo) originDesc = `${prefixo}${originDesc ?? ""}`.trim();

  const fields: LeadAttributionFields = {};
  const put = (k: keyof LeadAttributionFields, v: string | null | undefined) => {
    if (semMacro(v)) fields[k] = v as string;
  };

  // Wave 1 — Meta ad params (url_tags Wave 4)
  put("bb_campaign_id", param("campaign_id") || param("campanha_id"));
  put("bb_campaign_name", campanha);
  put("bb_adset_id", param("adset_id") || publico);
  put("bb_ad_id", adId || adName);
  put("bb_lp_version", lpVersion);
  put("bb_wave", fase);
  put("bb_audience_type", audiencia);

  // Wave 2 — UTMs clássicos + click IDs
  put("bb_utm_source", utmParams.utm_source);
  put("bb_utm_medium", utmParams.utm_medium);
  put("bb_utm_campaign", utmParams.utm_campaign);
  put("bb_utm_content", utmParams.utm_content);
  put("bb_utm_term", utmParams.utm_term);
  put("bb_fbclid", utmParams.fbclid);
  put("bb_gclid", utmParams.gclid);
  put("bb_lead_event_id", leadEventId);

  return { originId, originDesc, fields, ...(leadScore !== undefined ? { leadScore } : {}) };
}
