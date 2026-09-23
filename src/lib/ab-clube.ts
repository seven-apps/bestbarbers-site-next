/**
 * A/B DO HERÓI de `/clube/[peca]` — o único A/B do veredito de 23/Set/26
 * (bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/paginas-clube/00-VEREDITO-NOTA-10-2026-09-23.md).
 *
 *   base = página curta, sem foto no herói (a linha de base da Onda 1);
 *   cena = a mesma página com a FOTO DO ANÚNCIO no herói (Onda 2).
 *
 * Só as 7 páginas com arte estática têm cena (as de vídeo não têm foto: sempre `base`).
 *
 * COMO O SPLIT É FEITO — e por que assim:
 *  - REWRITE no middleware, nunca redirect: a URL que o navegador vê continua `/clube/<slug>`,
 *    que é o predicado da conversão personalizada da Meta, a chave da porta (`portas-clube.ts`)
 *    e o `bb_lp_version`. O braço `cena` é servido por `/clube-cena/<slug>`.
 *  - Cookie por visitante (30 dias): quem voltar vê o mesmo braço.
 *  - O braço vai no card: `bb_lp_version = clube-<slug>-cena` (lido da `<meta name="bb-variante">`
 *    que a página renderiza — ver `lead-attribution.ts`) e em todo evento (`variante`).
 *
 * Métrica primária: envios por visita, somando as 7. Guardas: % qualificado (portão de
 * composição, ~9 dias) e LCP p75 no Android. Leitura só na data do tamanho de amostra.
 *
 * Módulo puro: roda no middleware (edge), no cliente e no `node --test`.
 */

export const COOKIE_AB_CLUBE = "bb_ab_clube";
export const DIAS_COOKIE_AB = 30;

export type BracoClube = "base" | "cena";

/** As 7 páginas com a cena do anúncio exportada em `public/images/clube/cena/`. */
export const SLUGS_COM_CENA = [
  "plano-com-regra",
  "cobranca-automatica",
  "mes-que-comeca-pago",
  "retentativa",
  "sem-caderno",
  "um-sistema-so",
  "bloqueio-na-agenda",
] as const;

/**
 * Pasta das cenas (`bestbarbers-ai/scripts/creative/cena/exportar-web.ts` grava aqui):
 * `<slug>-faixa.{avif,webp}` (16:10, celular) e `<slug>-retrato.{avif,webp}` (4:5, desktop).
 * A existência de cada arquivo, por página, é cobrada em `content/clube-pecas.test.ts`.
 */
export const PASTA_CENAS = "/images/clube/cena/";

export function caminhoCena(slug: string, recorte: "faixa" | "retrato", ext: "avif" | "webp"): string {
  return PASTA_CENAS + slug + "-" + recorte + "." + ext;
}

export function temCena(slug: string): boolean {
  return (SLUGS_COM_CENA as readonly string[]).includes(slug);
}

/** Braço do visitante: o do cookie, se válido; senão o sorteio (0 ≤ sorteio < 1), 50/50. */
export function bracoDoVisitante(cookie: string | undefined | null, sorteio: number): BracoClube {
  if (cookie === "base" || cookie === "cena") return cookie;
  return sorteio < 0.5 ? "base" : "cena";
}

/** Caminho interno que serve o braço, ou null quando a página é servida como está. */
export function rotaDoBraco(slug: string, braco: BracoClube): string | null {
  return braco === "cena" && temCena(slug) ? `/clube-cena/${slug}` : null;
}
