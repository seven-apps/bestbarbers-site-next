/**
 * PORTA — o momento do dono em relação ao clube de assinaturas, lido por DUAS fontes:
 * a página que ele está vendo (mapa abaixo) e o `utm_content` do link que o trouxe
 * (`p<porta>-<tema>`, ex.: `p2-regua`). Plano: bestbarbers-ai/docs/operacional/
 * assembleia-funil/mapa-rastreio-publicos-set26.md (§2 e §7, item 3).
 *
 *   1 = não roda clube e quer entender   → tabela, aula, precificação, calculadoras
 *   2 = roda na mão (Pix / planilha)      → régua de cobrança, comissão
 *   3 = roda em outro app e quer migrar   → migração, kit "já uso outro"
 *   4 = tentou e parou                    → "tentei e deu errado"
 *
 * Este módulo é PURO (sem React, sem fbq). Quem dispara continua sendo o
 * `useMetaPixel` — `trackNonCatalogEvent` para evento custom (fbq('trackCustom') +
 * image pixel com o MESMO eventID, dedup) e `trackCustomEvent` para `ViewContent`
 * (catálogo padrão). Aqui moram o ÚNICO mapa página→porta, os nomes dos eventos e os
 * builders tipados dos parâmetros — para o Events Manager ver sempre as mesmas chaves
 * (`porta`, `tema`, `pagina`) em qualquer evento.
 *
 * REGRA: `content_name` dos ViewContent que já rodam NÃO muda (série histórica);
 * a porta entra como parâmetro ao lado, nunca no lugar do nome.
 */

export type Porta = 1 | 2 | 3 | 4;

export interface PaginaPorta {
  porta: Porta;
  /** Tema curto, o mesmo sufixo usado em `utm_content=p<porta>-<tema>`. */
  tema: string;
}

/**
 * Página → porta. Chave = `pathname` sem barra final. Só entra aqui página cujo
 * assunto DECLARA a porta; página genérica (/clube, home) fica de fora e não recebe
 * `porta`. /cadeira-cheia entrou como porta 1 por decisão do André (12/Set/26): o guia
 * de reativação atrai quem ainda não roda assinatura. Para acrescentar: uma linha aqui; o `tsc` cobra o shape e
 * `porta.test.ts` confere que a chave existe de verdade (rota em `src/app` ou slug
 * em `src/content/blog`) — chave errada = ViewContent que nunca dispara, em silêncio.
 */
export const PORTA_POR_PAGINA = {
  // ── Porta 1: não roda, quer entender (tabela · precificação · calculadoras · guia do zero)
  "/tabela-precificacao-clube": { porta: 1, tema: "tabela" },
  "/tabela-precificacao-clube-gated": { porta: 1, tema: "tabela" },
  "/calculadora-lucro-do-corte": { porta: 1, tema: "calculadora-lucro" },
  "/calculadora-prejuizo": { porta: 1, tema: "calculadora-prejuizo" },
  "/do-zero-a-assinatura": { porta: 1, tema: "guia-assinatura-do-zero" },
  "/cadeira-cheia": { porta: 1, tema: "cadeira-cheia" },
  "/blog/precificar-clube-assinatura-barbearia": { porta: 1, tema: "precificacao" },
  "/blog/clube-assinatura-barbearia": { porta: 1, tema: "montar-clube" },
  "/blog/barbearia-por-assinatura": { porta: 1, tema: "montar-clube" },
  // ── Porta 2: roda na mão (régua de cobrança · comissão)
  "/gestao-comissoes-barbeiro": { porta: 2, tema: "comissao" },
  "/blog/como-calcular-comissao-barbeiro": { porta: 2, tema: "comissao" },
  "/blog/quanto-pagar-comissao-barbeiro": { porta: 2, tema: "comissao" },
  "/blog/inadimplencia-barbearia-como-cobrar": { porta: 2, tema: "regua-de-cobranca" },
  // ── Porta 3: roda em outro app (migração · kit "já uso outro")
  //    Hoje não existe página própria: o sinal da porta 3 é o clique `clube_bt_migrar`
  //    no /clube (ver CLUBE_FORK). Quando /clube/migrar ou o kit existirem, entram aqui.
  // ── Porta 4: tentou e parou — sem página no site em 12/Set/2026.
} as const satisfies Record<string, PaginaPorta>;

export type PaginaComPorta = keyof typeof PORTA_POR_PAGINA;

/** Nomes dos eventos custom por porta (fbq('trackCustom')). Chave = nome no Events Manager. */
export const EVENTOS_PORTA = {
  clubeBtCriar: "clube_bt_criar",
  clubeBtMigrar: "clube_bt_migrar",
  tabelaUsada: "tabela_usada",
  calculadoraUsada: "calculadora_usada",
  guiaBaixado: "guia_baixado",
} as const;

export type EventoPorta = (typeof EVENTOS_PORTA)[keyof typeof EVENTOS_PORTA];

/**
 * Fork do /clube: hoje a página não tem URL por caminho (`/clube/criar` × `/clube/migrar`);
 * o que separa os dois é o BOTÃO. Todo CTA da página que não é o da faixa de migração
 * é "criar" (Header, Hero, Comparativo, Assinatura, Nota fiscal, Funcionalidades, Totem,
 * Notificações, Passos); a faixa `[Site-Clube]BT-Migracao` é "migrar".
 *
 * Porta: criar = 1 (quer montar) · migrar = 3 (plano §5, "P3 · M4 ← clube_bt_migrar").
 * Confirmado pelo André em 12/Set/26: migrar = porta 3, mesmo com a copy da faixa falando
 * com quem roda "no Pix ou na planilha". Quem roda na mão × em outro app só se separa com
 * `clube_status` declarado no form (pendência).
 */
export const CLUBE_FORK = {
  criar: { evento: EVENTOS_PORTA.clubeBtCriar, porta: 1 },
  migrar: { evento: EVENTOS_PORTA.clubeBtMigrar, porta: 3 },
} as const satisfies Record<string, { evento: EventoPorta; porta: Porta }>;

export type LadoDoFork = keyof typeof CLUBE_FORK;

/** originDesc que identifica o lado "migrar" do /clube (o resto é "criar"). */
const ORIGIN_DESC_MIGRACAO = "[Site-Clube]BT-Migracao";

/** Traduz o originDesc do botão clicado no /clube em lado do fork. */
export function forkDoClube(originDesc: string): LadoDoFork {
  return originDesc === ORIGIN_DESC_MIGRACAO ? "migrar" : "criar";
}

/** Parâmetros que TODO evento por porta carrega (chaves fixas para o Events Manager). */
export interface ParamsPorta {
  porta?: Porta;
  tema?: string;
  /** Pathname normalizado da página onde o evento nasceu. */
  pagina?: string;
  /** Porta declarada pelo LINK (`utm_content=p2-...`), quando diferente da página. */
  porta_link?: Porta;
  [chave: string]: string | number | boolean | undefined;
}

/** Normaliza o pathname: sem barra final, sem query, minúsculo. */
function normalizarPath(pathname: string): string {
  const semQuery = pathname.split("?")[0].split("#")[0].trim().toLowerCase();
  const semBarra = semQuery.replace(/\/+$/, "");
  return semBarra === "" ? "/" : semBarra;
}

/** Porta da página, se ela estiver no mapa. */
export function portaDaPagina(pathname: string): PaginaPorta | null {
  const chave = normalizarPath(pathname) as PaginaComPorta;
  return Object.prototype.hasOwnProperty.call(PORTA_POR_PAGINA, chave)
    ? PORTA_POR_PAGINA[chave]
    : null;
}

/**
 * Porta declarada no `utm_content` (`p2-regua` → 2). Tolera maiúsculas e o formato
 * sem tema (`p3`). Qualquer outro formato (o legado `du-01`, `grupo-a`) → null.
 */
export function portaDoUtmContent(utmContent: string | null | undefined): Porta | null {
  const m = (utmContent ?? "").trim().toLowerCase().match(/^p([1-4])(?:-|$)/);
  return m ? (Number(m[1]) as Porta) : null;
}

/**
 * Monta o `utm_content` padrão de um link por porta: `p<porta>-<tema>`. O tema vira
 * slug ASCII: sem acento (NFD + remoção dos diacríticos), minúsculo, hífens —
 * "Régua de Cobrança" → `p2-regua-de-cobranca`. Sem isso o "ç" e o "é" viravam
 * hífen e o mesmo tema saía com dois nomes no Events Manager.
 */
export function utmContentPorta(porta: Porta, tema: string): string {
  const temaLimpo = tema
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return temaLimpo ? `p${porta}-${temaLimpo}` : `p${porta}`;
}

/**
 * Parâmetros de porta para um evento disparado numa página. `porta` = a da PÁGINA
 * (o fato: o que ele está vendo); a do link entra em `porta_link` quando existir e
 * for diferente — assim o público "viu página da porta 2" e o público "clicou em
 * anúncio da porta 2" saem de chaves distintas e não se contaminam.
 */
export function paramsDaPagina(pathname: string, utmContent?: string | null): ParamsPorta {
  const pagina = portaDaPagina(pathname);
  const portaLink = portaDoUtmContent(utmContent);
  const params: ParamsPorta = { pagina: normalizarPath(pathname) };
  if (pagina) {
    params.porta = pagina.porta;
    params.tema = pagina.tema;
  }
  if (portaLink && portaLink !== pagina?.porta) params.porta_link = portaLink;
  return params;
}

/**
 * Mesmo que `paramsDaPagina`, lendo a URL viva do navegador. No servidor devolve {}
 * (nenhum evento nasce lá). Use dentro de handlers/effects, nunca no render.
 */
export function paramsDaPaginaAtual(): ParamsPorta {
  if (typeof window === "undefined") return {};
  const utmContent = new URLSearchParams(window.location.search).get("utm_content");
  return paramsDaPagina(window.location.pathname, utmContent);
}

/**
 * Porta do LEAD (evento `Lead`/`QualifiedLead*`): o link vence a página — o anúncio
 * que falou com a porta 2 e trouxe o dono até a tabela (porta 1) descreve melhor o
 * momento dele do que a página onde o form estava. Sem link, vale a página.
 */
export function portaDoLead(pathname: string, utmContent?: string | null): Porta | undefined {
  return portaDoUtmContent(utmContent) ?? portaDaPagina(pathname)?.porta;
}

/**
 * Parâmetros do `guia_baixado`. O id da isca é a chave de dado (src/lib/iscas.ts);
 * a porta vem da LP da isca (`/<iscaId>`), quando ela está no mapa. Guia sem porta
 * (Cadeira Cheia) sai só com `guia` — nada é inventado.
 */
export function paramsGuiaBaixado(iscaId: string): ParamsPorta & { guia: string } {
  const pagina = portaDaPagina(`/${iscaId}`);
  return {
    guia: iscaId,
    ...(pagina ? { porta: pagina.porta, tema: pagina.tema } : {}),
    pagina: "/obrigado",
  };
}
