/**
 * A/B DE PÁGINA de `/clube/[peca]` — ciclo 1 do teste de tráfego (GO do André, 24/Set/26, 23:05;
 * desenho em bestbarbers-ai/docs/operacional/trafego/analise-advantage-pagina-set26.md §7–§10).
 *
 *   curta = a página curta por anúncio (`/clube/[peca]`, herói `base`, formulário de 2 passos);
 *   longa = a página longa `/clube` (formulário antigo, o controle que converteu ~10% na TOPO-BH).
 *
 * O braço `cena` (a foto do anúncio no herói, veredito de 23/Set) SAIU DO SORTEIO até o veredito
 * do ciclo 1. O código dele fica: a rota `/clube-cena/[peca]` continua servida por `?ab=cena`
 * (QA) e volta ao sorteio no dia em que `BRACOS_NO_SORTEIO` o incluir de novo.
 *
 * COMO O SPLIT É FEITO — e por que assim:
 *  - REWRITE no middleware, nunca redirect: a URL que o navegador vê continua `/clube/<slug>`
 *    com a query inteira (UTMs, `?origin=`, url_tags), que é o predicado da conversão
 *    personalizada da Meta, a chave da porta (`portas-clube.ts`) e o `bb_lp_version`.
 *    O braço `longa` é servido por `/clube-longa/<slug>`; o `cena`, por `/clube-cena/<slug>`.
 *  - Cookie por visitante (30 dias): quem voltar vê o mesmo braço. Cookie bloqueado = sorteio
 *    por request; o card ainda registra o braço VISTO, porque ele vem da página, não do cookie.
 *  - O braço vai no card: `bb_lp_version = clube-<slug>-longa` ou `clube-<slug>-curta` (o slug
 *    da peça de origem nos dois braços), lido da `<meta name="bb-variante">` que a página
 *    renderiza (`lead-attribution.ts`), e em todo evento do pixel (`useMetaPixel`) e do GTM.
 *
 * Métrica primária: card COM EQUIPE por braço no Ploomes ao vivo (D+9). Leitura de instrumento
 * em D+3: curta com ≥100 LPV e 0 cadastro → sorteio a 100% longa aqui, sem tocar na Meta.
 *
 * Módulo puro: roda no middleware (edge), no cliente e no `node --test`.
 */

export const COOKIE_AB_CLUBE = "bb_ab_clube";
export const DIAS_COOKIE_AB = 30;

/** Nome da `<meta>` que a página renderiza com o braço visto. */
export const META_VARIANTE = "bb-variante";

/** Todos os braços que existem em código. */
export const BRACOS_CLUBE = ["curta", "longa", "cena"] as const;
export type BracoClube = (typeof BRACOS_CLUBE)[number];

/** Os braços que o sorteio 50/50 distribui HOJE. Mudar aqui é mudar o teste. */
export const BRACOS_NO_SORTEIO = ["curta", "longa"] as const;
export type BracoSorteado = (typeof BRACOS_NO_SORTEIO)[number];

export function ehBracoClube(valor: unknown): valor is BracoClube {
  return typeof valor === "string" && (BRACOS_CLUBE as readonly string[]).includes(valor);
}

export function ehBracoSorteado(valor: unknown): valor is BracoSorteado {
  return typeof valor === "string" && (BRACOS_NO_SORTEIO as readonly string[]).includes(valor);
}

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

/**
 * Braço do visitante: o do cookie, se for um braço EM SORTEIO; senão o sorteio
 * (0 ≤ sorteio < 1), 50/50 entre `BRACOS_NO_SORTEIO`. Cookie antigo (`base`/`cena`) ou
 * lixo = ressorteia — é assim que a troca de teste não herda a distribuição do anterior.
 */
export function bracoDoVisitante(cookie: string | undefined | null, sorteio: number): BracoSorteado {
  if (ehBracoSorteado(cookie)) return cookie;
  const i = Math.min(BRACOS_NO_SORTEIO.length - 1, Math.max(0, Math.floor(sorteio * BRACOS_NO_SORTEIO.length)));
  return BRACOS_NO_SORTEIO[i];
}

/** `?ab=<braço>` força o braço (QA e revisão do André). Qualquer braço em código vale, até fora do sorteio. */
export function bracoForcado(valor: string | null | undefined): BracoClube | undefined {
  return ehBracoClube(valor) ? valor : undefined;
}

/** Caminho interno que serve o braço, ou null quando a página `/clube/<slug>` é servida como está. */
export function rotaDoBraco(slug: string, braco: BracoClube): string | null {
  if (braco === "longa") return `/clube-longa/${slug}`;
  if (braco === "cena") return temCena(slug) ? `/clube-cena/${slug}` : null;
  return null;
}

/**
 * O braço que a pessoa VIU, lido da `<meta name="bb-variante">` da página. Lido do DOM, e não
 * do cookie, porque é o que estava na tela — o cookie pode ter mudado depois, ou nem existir.
 * Fora das páginas em teste não há meta e o retorno é null (nenhum evento ganha o campo).
 */
export function varianteVista(doc: Pick<Document, "querySelector"> | undefined = typeof document === "undefined" ? undefined : document): BracoClube | null {
  const v = doc?.querySelector(`meta[name="${META_VARIANTE}"]`)?.getAttribute("content");
  return ehBracoClube(v) ? v : null;
}
