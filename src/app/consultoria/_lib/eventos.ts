// Os eventos próprios da consultoria (02-plano.md §3.6). O contêiner web do GTM (GTM-WTZDP6PL, lido em 07/Nov/26) só
// manda `page_view` à Stape: os pushes abaixo ficam no dataLayer para um gatilho futuro, e o GA4 mede o fim pelo
// `page_view` da página do plano (/consultoria/plano?…&de=ficha), aberta com navegação completa.
type DadosDoEvento = Record<string, string | number | boolean | null | undefined>;

export function empurrar(
  evento: "consultoria_inicio" | "consultoria_fim" | "consultoria_horario" | "consultoria_copiar",
  dados: DadosDoEvento = {},
) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: evento, ...dados });
}

function cookie(nome: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie.match(new RegExp("(?:^|; )" + nome + "=([^;]*)"))?.[1];
}

/**
 * A cópia do servidor (CAPI direta no OS), com o MESMO eventId do pixel para a Meta deduplicar.
 * Os nomes têm de existir em `EVENTOS_CAPI` (bestbarbers-ai/lib/integrations/meta-capi-eventos.ts): nome fora
 * do enum volta 400 e o evento fica só no pixel. Fire-and-forget, com aviso no console.
 */
export function enviarCapi(
  eventName: "Lead" | "QualifiedLead" | "QualifiedLead60" | "LeadComEquipe",
  eventId: string,
  pessoa: { telefone: string; nome: string },
) {
  const base = process.env.NEXT_PUBLIC_BBAI_DASHBOARD_URL;
  if (!base || typeof window === "undefined") return;
  const partes = pessoa.nome.trim().toLowerCase().split(/\s+/);
  fetch(`${base}/api/meta-capi/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      userData: {
        phone: pessoa.telefone.replace(/\D/g, ""),
        firstName: partes[0] || undefined,
        lastName: partes.slice(1).join(" ") || undefined,
        country: "br",
        fbp: cookie("_fbp"),
        fbc: cookie("_fbc"),
      },
      eventSourceUrl: window.location.href,
    }),
  })
    .then((res) => {
      if (!res.ok) console.warn(`CAPI recusou "${eventName}" (HTTP ${res.status}): o evento foi só pelo pixel.`);
    })
    .catch(() => {});
}

/** Espera a promessa até `ms`: o pixel não pode segurar o dono na tela. */
export function comTeto<T>(promessa: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([promessa, new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}
