/**
 * A/B DE PÁGINA POR ENDEREÇO FIXO — `/ir/<teste>` (pedido do André, 07/Nov/26; GO de publicar
 * em 07/Nov/26, 16h58, pelo hub review-pendencias-nov):
 *
 *   "no anúncio da academia, a gente fazer um teste nele mesmo: mandar para o site e mandar
 *    para o site da IA."
 *
 * O anúncio aponta, desde o 1º dia, para `/ir/<teste>`. O middleware sorteia o destino e
 * REDIRECIONA (307) para a página do assunto ou para a home. O teste da Meta (uma célula por
 * anúncio) não muda: a página se testa no site, por cookie (regra de 24/Set/26, a mesma do
 * `ab-clube.ts`). Ligar, desligar ou mudar a proporção = mudar `percentualAssunto` aqui, sem
 * tocar no anúncio.
 *
 * POR QUE REDIRECT, E NÃO O REWRITE DO `ab-clube.ts`: lá a URL `/clube/<peça>` era a chave da
 * porta e do `bb_lp_version`, e o rewrite a mantinha. Aqui é o contrário: cada braço é uma
 * página que já existe, com a lógica dela presa ao pathname (o `bb_lp_version`, a origem
 * padrão do formulário, o canonical). Servir a home em `/ir/clube` faria a home se passar por
 * outra página. O 307 custa um ida-e-volta à borda, sem página intermediária.
 *
 * O QUE O REDIRECT GARANTE:
 *  - a query de entrada passa INTEIRA, na mesma ordem e com os mesmos valores (utm_*, fbclid, os
 *    url_tags que gravam o `bb_ad_id` e o `bb_campaign_name`). Só sai o `?ab=` de QA e um `bb_ab`
 *    velho. Este módulo não reserializa nada; quem reserializa é o Next, ANTES do middleware (o
 *    `stripInternalSearchParams` do adapter passa a query pelo `URLSearchParams`, local e na Vercel):
 *    um `%20` pode chegar como `+`, que todo leitor de formulário (o site, o GA4) decodifica igual.
 *    Os nomes de anúncio do padrão v2 não têm espaço, então na prática a query sai idêntica;
 *  - entra `bb_ab=<rótulo>` (ex.: `ir-clube-home`), que a página de destino lê para gravar o
 *    braço no card (`bb_lp_version`, em `lead-attribution.ts`), no pixel e no dataLayer;
 *  - o cookie `bb_ab_ir_<teste>` (30 dias) fixa o braço: a mesma pessoa vê sempre a mesma
 *    página. Com o teste desligado (0 ou 100), ninguém ganha cookie e o cookie velho é
 *    ignorado — senão quem passou na fase de 100% herdaria o braço quando o sorteio ligasse;
 *  - `/ir/<qualquer outra coisa>` vai para a home com a query: um clique pago nunca cai em 404.
 *
 * Módulo puro: roda no middleware (edge), no cliente e no `node --test`.
 */

export interface TesteDePagina {
  /** Página do assunto (o outro braço é sempre a home `/`). */
  assunto: string;
  /** 0 a 100: a parte que vai para a página do assunto. 50 = sorteio 50/50; 100 = teste desligado, todos no assunto. */
  percentualAssunto: number;
}

/**
 * Os testes no ar. Mudar o percentual aqui é mudar o teste (o anúncio continua igual).
 * Ficam fora, de propósito: a tabela "Como precificar" (o anúncio promete a tabela, e a home
 * quebraria a promessa) e a taxa de ocupação (já vai para a home).
 */
export const TESTES_DE_PAGINA = {
  clube: { assunto: "/clube", percentualAssunto: 50 },
  "agente-ia": { assunto: "/agente-ia-whatsapp", percentualAssunto: 50 },
} as const satisfies Record<string, TesteDePagina>;

export type NomeTeste = keyof typeof TESTES_DE_PAGINA;
export const BRACOS_PAGINA = ["assunto", "home"] as const;
export type BracoPagina = (typeof BRACOS_PAGINA)[number];

export const PREFIXO_ROTA = "/ir/";
export const DIAS_COOKIE_AB_PAGINA = 30;
/** Parâmetro que o redirect acrescenta com o rótulo do braço. */
export const PARAM_AB_PAGINA = "bb_ab";
/** `?ab=assunto|home` força o braço (QA e revisão do André); não grava cookie e não segue para o destino. */
export const PARAM_FORCAR = "ab";

export function ehTeste(valor: unknown): valor is NomeTeste {
  return typeof valor === "string" && Object.prototype.hasOwnProperty.call(TESTES_DE_PAGINA, valor);
}

export function ehBracoPagina(valor: unknown): valor is BracoPagina {
  return typeof valor === "string" && (BRACOS_PAGINA as readonly string[]).includes(valor);
}

/** Cookie do teste: `bb_ab_ir_clube`, `bb_ab_ir_agente_ia`. */
export function cookieDoTeste(teste: NomeTeste): string {
  return "bb_ab_ir_" + teste.replace(/-/g, "_");
}

/** Rótulo do braço: vai no `bb_ab` da URL, no `bb_lp_version` do card, no pixel e no dataLayer. */
export function rotuloDoBraco(teste: NomeTeste, braco: BracoPagina): string {
  return `ir-${teste}-${braco}`;
}

export function destinoDoBraco(teste: NomeTeste, braco: BracoPagina): string {
  return braco === "home" ? "/" : TESTES_DE_PAGINA[teste].assunto;
}

/** O sorteio está ligado (0 < percentual < 100)? Fora disso o destino é fixo e não há cookie. */
export function sorteioLigado(percentual: number): boolean {
  return percentual > 0 && percentual < 100;
}

/**
 * Braço do visitante. Ordem: braço forçado (QA) → teste desligado (0 ou 100, destino fixo) →
 * cookie válido → sorteio (0 ≤ sorteio < 1; `sorteio * 100 < percentual` = assunto).
 */
export function bracoDoVisitante(
  percentual: number,
  cookie: string | null | undefined,
  sorteio: number,
  forcado?: BracoPagina,
): BracoPagina {
  if (forcado) return forcado;
  if (percentual >= 100) return "assunto";
  if (percentual <= 0) return "home";
  if (ehBracoPagina(cookie)) return cookie;
  return sorteio * 100 < percentual ? "assunto" : "home";
}

/** Nome de um pedaço `k=v` da query, decodificado (`+` = espaço). Pedaço malformado = o próprio texto. */
function nomeDoPedaco(pedaco: string): string {
  const k = pedaco.split("=")[0].replace(/\+/g, " ");
  try {
    return decodeURIComponent(k);
  } catch {
    return k;
  }
}

/**
 * Query do destino: a de entrada SEM reserializar (cada pedaço `k=v` passa como chegou, na
 * mesma ordem, repetidos e sem valor inclusive), menos `nomesFora`, mais `bb_ab=<rótulo>` no fim.
 */
export function queryDoDestino(search: string, nomesFora: readonly string[], extra?: [string, string]): string {
  const bruto = search.startsWith("?") ? search.slice(1) : search;
  const pedacos = bruto === "" ? [] : bruto.split("&").filter((p) => p !== "" && !nomesFora.includes(nomeDoPedaco(p)));
  if (extra) pedacos.push(`${encodeURIComponent(extra[0])}=${encodeURIComponent(extra[1])}`);
  return pedacos.length ? "?" + pedacos.join("&") : "";
}

export interface DecisaoIr {
  /** Caminho + query do redirect (relativo à origem). */
  destino: string;
  teste: NomeTeste | null;
  braco: BracoPagina | null;
  /** Cookie a gravar (só com o sorteio ligado e quando o valor muda). */
  cookie: { nome: string; valor: BracoPagina; maxAge: number } | null;
}

/**
 * A decisão inteira do `/ir/<teste>`, sem Next: o middleware só a aplica. `cookies` é o leitor
 * de cookie do request; `sorteio` vem de `Math.random()` (fixo nos testes).
 */
export function decidirIr(
  pathname: string,
  search: string,
  cookies: (nome: string) => string | undefined,
  sorteio: number,
): DecisaoIr {
  const nome = pathname.slice(PREFIXO_ROTA.length).replace(/\/+$/, "").toLowerCase();
  const forcarBruto = new URLSearchParams(search).get(PARAM_FORCAR);
  if (!ehTeste(nome)) {
    // Endereço desconhecido (teste encerrado, erro de digitação): home com a query, sem rótulo.
    return { destino: "/" + queryDoDestino(search, [PARAM_AB_PAGINA]), teste: null, braco: null, cookie: null };
  }
  const { percentualAssunto } = TESTES_DE_PAGINA[nome];
  const forcado = ehBracoPagina(forcarBruto) ? forcarBruto : undefined;
  const nomeCookie = cookieDoTeste(nome);
  const atual = cookies(nomeCookie);
  const braco = bracoDoVisitante(percentualAssunto, atual, sorteio, forcado);
  const fora = forcado ? [PARAM_AB_PAGINA, PARAM_FORCAR] : [PARAM_AB_PAGINA];
  const destino = destinoDoBraco(nome, braco) + queryDoDestino(search, fora, [PARAM_AB_PAGINA, rotuloDoBraco(nome, braco)]);
  const gravar = !forcado && sorteioLigado(percentualAssunto) && atual !== braco;
  return {
    destino,
    teste: nome,
    braco,
    cookie: gravar ? { nome: nomeCookie, valor: braco, maxAge: DIAS_COOKIE_AB_PAGINA * 86400 } : null,
  };
}

/**
 * O rótulo do braço que a pessoa está VENDO, lido da URL da página (`bb_ab`). Só vale quando
 * o pathname é o destino daquele braço: um link copiado com `bb_ab` e aberto em outra página
 * não marca o card. Sem `bb_ab` válido → null (o `bb_lp_version` segue a regra de sempre).
 */
export function abPaginaVista(search: string, pathname: string): string | null {
  const valor = new URLSearchParams(search).get(PARAM_AB_PAGINA);
  if (!valor) return null;
  const caminho = pathname.replace(/\/+$/, "") || "/";
  for (const teste of Object.keys(TESTES_DE_PAGINA) as NomeTeste[]) {
    for (const braco of BRACOS_PAGINA) {
      if (valor === rotuloDoBraco(teste, braco) && caminho === destinoDoBraco(teste, braco)) return valor;
    }
  }
  return null;
}

/** `abPaginaVista` com a URL do navegador; null fora do navegador. */
export function abPaginaDaJanela(): string | null {
  if (typeof window === "undefined") return null;
  return abPaginaVista(window.location.search, window.location.pathname);
}
