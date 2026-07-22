/**
 * Registro de RECADASTRO — dispara para o backend (bestbarbers-ai) uma anotação no
 * card do Ploomes quando um lead se cadastra de novo apesar de já ter card ativo
 * (mode='active') ou é um lead perdido que voltou (mode='reactivation').
 *
 * Fire-and-forget: NUNCA bloqueia nem quebra o submit — o lead segue vendo a mesma UX.
 * A lógica pesada (achar o card, throttle, poll do deal novo na reativação) vive no
 * backend em lib/integrations/ploomes-reregister.ts.
 */

export interface ReregisterNoteInput {
  phone: string;
  mode: "active" | "reactivation";
  /** Descrição de origem já resolvida (ex. "LP - Ottoni - Programa de indicações"). */
  origemDesc?: string;
  /** Rótulo do formulário; default = pathname atual. */
  form?: string;
  interesse?: string;
  faturamento?: string;
  score?: number;
}

/** Lê os parâmetros de campanha (Meta url_tags / UTM) da URL atual, se houver. */
function collectMetaParams(): {
  lpVersion?: string;
  campaign?: string;
  publico?: string;
  creative?: string;
  angulo?: string;
} {
  if (typeof window === "undefined") return {};
  const s = new URLSearchParams(window.location.search);
  const g = (k: string) => s.get(k)?.trim() || undefined;
  return {
    lpVersion: window.location.pathname.match(/\/(v\d+)/)?.[1]?.toUpperCase(),
    campaign: g("campanha") || g("utm_campaign"),
    publico: g("publico") || g("adset"),
    creative: g("creative") || g("utm_content"),
    angulo: g("angulo"),
  };
}

/**
 * Envia a anotação de recadastro para o backend. Fire-and-forget (keepalive para
 * sobreviver a uma navegação); qualquer erro é engolido — nunca afeta o lead.
 */
export function sendReregisterNote(input: ReregisterNoteInput): void {
  try {
    const base =
      process.env.NEXT_PUBLIC_BBAI_DASHBOARD_URL ||
      process.env.NEXT_PUBLIC_BBAI_API_URL ||
      "https://bbai.bestbarbers.app";

    const form =
      input.form ||
      (typeof window !== "undefined" ? window.location.pathname : undefined);

    const body = {
      phone: input.phone,
      mode: input.mode,
      origemDesc: input.origemDesc,
      form,
      interesse: input.interesse,
      faturamento: input.faturamento,
      score: input.score,
      ...collectMetaParams(),
    };

    fetch(`${base}/api/ploomes/reregister-note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* nunca propaga — registro é best-effort */
  }
}
