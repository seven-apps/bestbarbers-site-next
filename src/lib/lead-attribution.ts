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
}

export interface BuildLeadAttributionInput {
  utmParams: UtmParams;
  /** originId/originDesc do mapeamento de UTM (ou customizados pela página). */
  originId: number | null;
  originDesc: string | null;
  interestedTool?: string;
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
  const { utmParams, originId, interestedTool, leadScore, leadEventId } = input;

  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const param = (k: string) => search?.get(k)?.trim() || "";

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const lpVersion = pathname.match(/\/(v\d+)/)?.[1]?.toUpperCase() || "LP";

  const fase = param("fase");
  const campanha = param("campanha");
  const publico = param("publico") || param("adset");
  const adName = param("ad") || param("ad_id") || param("adname");
  const creative = param("creative") || utmParams.utm_content || "";
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
  if (originDesc) {
    if (interestedTool) originDesc = `[Interesse: ${interestedTool}] ${originDesc}`;
    if (leadScore !== undefined) originDesc = `[SCORE: ${leadScore}] ${originDesc}`;
  }

  const fields: LeadAttributionFields = {};
  const put = (k: keyof LeadAttributionFields, v: string | null | undefined) => {
    if (v) fields[k] = v;
  };

  // Wave 1 — Meta ad params (url_tags Wave 4)
  put("bb_campaign_id", param("campaign_id") || param("campanha_id"));
  put("bb_campaign_name", campanha);
  put("bb_adset_id", param("adset_id") || publico);
  put("bb_ad_id", adName);
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

  return { originId, originDesc, fields };
}
