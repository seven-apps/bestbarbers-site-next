/**
 * PROJETO DO CLUBE — personalização por anúncio (B8).
 *
 * A REGRA QUE MANDA AQUI (cap. 20, linha 114 do plano):
 *
 *   «A dor do criativo é uma hipótese sobre o visitante; não é um dado declarado.»
 *   «O visitante pode corrigir a seleção.» (linha 116)
 *
 * Consequência prática, e é ela que este módulo existe para garantir: a página PODE
 * adaptar abertura e exemplo ao anúncio de origem, e NÃO PODE afirmar que sabe a
 * situação de quem chegou. Por isso o resultado carrega `hipotese`. Enquanto
 * `hipotese` for `true`, nenhum texto pode dizer «você controla na mão» — o que
 * pode é ENDEREÇAR («Para quem já vende planos e controla o clube manualmente.»,
 * literal do cap. 13) e deixar o seletor de situação à vista (V2: ele troca a copy,
 * nunca navega).
 *
 * DE ONDE VEM O SINAL. O url_tags padrão da casa manda o nome do anúncio em
 * `utm_content={{ad.name}}` e `creative={{ad.name}}` (`criar-celula.ts:85`), e a
 * convenção de nome da família é:
 *
 *     <FORMATO>-<PORTA>-<SITUACAO>-<PECA>-<VARIACAO>     ESTATICO-P2-MANUAL-L001-V1
 *
 * Dois tokens desse nome resolvem a situação — a peça (L###, que o acervo já sabe
 * a que situação pertence) e o token de situação (MANUAL | MIGRA | ABERT | GERAL).
 * A peça ganha: ela é lida contra `PC_PECAS`, que é a fonte, enquanto o token é
 * digitado à mão por quem sobe a campanha.
 *
 * O QUE ESTE MÓDULO NÃO FAZ: não resolve a PEÇA da página (isso é `pecaDaRota()`,
 * no servidor, contra allow-list — V3), não escreve texto público, não toca
 * `window` (é puro: roda no server component com o `await searchParams` e no
 * cliente com o `location.search`).
 */

import { PC_PECAS } from "../_components/pc-pecas";
import type { PcPecaId, PcSituacao } from "../_components/pc.types";
import { portaDoUtmContent, type Porta } from "@/lib/tracking/porta";

/* ───────────────────────────────────────────────────────────────────────────
   O que chega na URL — os campos que `useUtmParams` e o url_tags da Meta emitem.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcFonteAnuncio {
  utm_content: string | null;
  creative: string | null;
  adname: string | null;
  ad: string | null;
  utm_campaign: string | null;
  campanha: string | null;
  angulo: string | null;
  publico: string | null;
  adset: string | null;
}

/**
 * Ordem de leitura, do sinal mais confiável para o mais frouxo.
 *
 * `utm_content` e `creative` são o NOME DO ANÚNCIO — é ali que a convenção vive.
 * `campanha`/`utm_campaign` e `angulo` só entram porque campanha antiga pode
 * carregar o token sem o anúncio carregar. `publico`/`adset` são os últimos: o
 * nome do conjunto descreve a AUDIÊNCIA, não a promessa, e acerta menos.
 */
const CAMPOS_EM_ORDEM: readonly (keyof PcFonteAnuncio)[] = [
  "utm_content",
  "creative",
  "adname",
  "ad",
  "utm_campaign",
  "campanha",
  "angulo",
  "publico",
  "adset",
];

export const PC_FONTE_VAZIA: PcFonteAnuncio = {
  utm_content: null,
  creative: null,
  adname: null,
  ad: null,
  utm_campaign: null,
  campanha: null,
  angulo: null,
  publico: null,
  adset: null,
};

/**
 * Macro não substituída da Meta (`{{ad.name}}`) é AUSÊNCIA de dado, nunca valor —
 * mesma regra de `lead-attribution.ts:72`. Acontece em ~0,8% dos cliques (anúncio
 * compartilhado por DM, aberto pelo perfil) e personalizar por ela seria adivinhar
 * a partir de lixo.
 */
function semMacro(valor: string | null | undefined): string | null {
  const limpo = valor?.trim();
  if (!limpo || limpo.includes("{{")) return null;
  return limpo;
}

/** Lê a fonte de uma query string — serve tanto para `searchParams` quanto para `location.search`. */
export function lerFonteAnuncio(
  entrada: string | URLSearchParams | Record<string, string | string[] | undefined> | null | undefined,
): PcFonteAnuncio {
  if (!entrada) return { ...PC_FONTE_VAZIA };

  const pegar =
    typeof entrada === "string" || entrada instanceof URLSearchParams
      ? (() => {
          const busca = typeof entrada === "string" ? new URLSearchParams(entrada) : entrada;
          return (chave: string) => semMacro(busca.get(chave));
        })()
      : (chave: string) => {
          const valor = entrada[chave];
          return semMacro(Array.isArray(valor) ? valor[0] : valor);
        };

  return {
    utm_content: pegar("utm_content"),
    creative: pegar("creative"),
    adname: pegar("adname"),
    ad: pegar("ad"),
    utm_campaign: pegar("utm_campaign"),
    campanha: pegar("campanha"),
    angulo: pegar("angulo"),
    publico: pegar("publico"),
    adset: pegar("adset"),
  };
}

/* ───────────────────────────────────────────────────────────────────────────
   Os tokens da convenção de nome.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * `<SITUACAO>` do nome do anúncio. Os separadores aceitos são os que aparecem em
 * nome de anúncio e de conjunto: hífen, sublinhado, barra vertical e espaço.
 */
const TOKENS_SITUACAO: ReadonlyArray<readonly [RegExp, PcSituacao]> = [
  [/(?:^|[-_|\s])MANUAL(?:[-_|\s]|$)/i, "manual"],
  [/(?:^|[-_|\s])MIGRA(?:CAO|ÇÃO)?(?:[-_|\s]|$)/i, "migracao"],
  [/(?:^|[-_|\s])ABERT(?:URA)?(?:[-_|\s]|$)/i, "abertura"],
  [/(?:^|[-_|\s])GERAL(?:[-_|\s]|$)/i, "geral"],
];

/** `<PECA>` do nome do anúncio — a mesma forma que `pecaDaRota()` lê no servidor. */
const TOKEN_PECA = /(?:^|[-_|\s])(L0\d{2})(?:[-_|\s]|$)/i;

/**
 * Porta do link → situação, e SÓ para as duas portas que não são ambíguas:
 * porta 2 («roda na mão») é manual e porta 3 («roda em outro app e quer migrar»)
 * é migração, por definição do mapa de portas da casa.
 *
 * A porta 1 fica de fora de propósito: ela é «não roda clube e quer entender», que
 * cobre tabela, calculadora e aula — muito mais gente do que «vai abrir barbearia
 * com equipe». Usá-la para escolher a abertura seria personalizar por um palpite
 * largo demais. Porta 4 («tentou e parou») não tem entrada nesta família.
 */
export const SITUACAO_POR_PORTA: Partial<Record<Porta, PcSituacao>> = {
  2: "manual",
  3: "migracao",
};

/* ───────────────────────────────────────────────────────────────────────────
   A leitura do sinal.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcSinalSituacao {
  situacao: PcSituacao;
  /** Nome do parâmetro que deu o sinal: `utm_content`, `creative`, `publico`… */
  campo: keyof PcFonteAnuncio;
  /** Como foi lido: pela peça do acervo, pelo token da convenção ou pela porta do link. */
  via: "peca" | "token" | "porta";
  /** Id da peça, quando o sinal veio dela. */
  peca: PcPecaId | null;
}

/** A peça citada no texto, validada contra o acervo. Texto que não casa devolve `null`. */
export function pecaDoTexto(texto: string | null): PcPecaId | null {
  const achado = semMacro(texto)?.match(TOKEN_PECA)?.[1]?.toUpperCase();
  if (!achado) return null;
  const id = achado as PcPecaId;
  return id in PC_PECAS ? id : null;
}

/** O token `<SITUACAO>` do texto, se houver. */
export function situacaoDoTexto(texto: string | null): PcSituacao | null {
  const limpo = semMacro(texto);
  if (!limpo) return null;
  for (const [padrao, situacao] of TOKENS_SITUACAO) {
    if (padrao.test(limpo)) return situacao;
  }
  return null;
}

/**
 * O que o anúncio sugere sobre a situação de quem clicou. `null` = o anúncio não
 * disse nada, e aí a página não inventa: fica com o padrão da rota.
 */
export function situacaoDoAnuncio(fonte: PcFonteAnuncio): PcSinalSituacao | null {
  // 1ª passada: a peça. É o sinal forte — quem responde qual é a situação é o
  // acervo (`PC_PECAS[id].situacao`), não quem digitou o nome do anúncio.
  for (const campo of CAMPOS_EM_ORDEM) {
    const peca = pecaDoTexto(fonte[campo]);
    if (peca) return { situacao: PC_PECAS[peca].situacao, campo, via: "peca", peca };
  }

  // 2ª passada: o token da convenção.
  for (const campo of CAMPOS_EM_ORDEM) {
    const situacao = situacaoDoTexto(fonte[campo]);
    if (situacao) return { situacao, campo, via: "token", peca: null };
  }

  // 3ª passada: a porta declarada no `utm_content` (`p2-…`, `p3-…`).
  const porta = portaDoUtmContent(fonte.utm_content);
  const pelaPorta = porta ? SITUACAO_POR_PORTA[porta] : undefined;
  if (pelaPorta) return { situacao: pelaPorta, campo: "utm_content", via: "porta", peca: null };

  return null;
}

/* ───────────────────────────────────────────────────────────────────────────
   A decisão: qual situação a página usa, e com que confiança.
   ─────────────────────────────────────────────────────────────────────────── */

export type PcConfianca =
  /** O visitante escolheu no seletor. É o único caso em que a situação é DADO. */
  | "declarada"
  /** A rota é a promessa do anúncio (`/migracao`). Hipótese, e a mais firme delas. */
  | "rota"
  /** O nome do anúncio sugeriu, na entrada geral. Hipótese. */
  | "anuncio"
  /** Ninguém disse nada — a página abre neutra. */
  | "padrao";

export interface PcPersonalizacao {
  situacao: PcSituacao;
  confianca: PcConfianca;
  /**
   * `true` quando a situação é SUPOSIÇÃO sobre o visitante. Enquanto for `true`,
   * nenhum texto da página pode afirmar a situação dele — só endereçar. Cap. 20.
   */
  hipotese: boolean;
  /** O sinal lido do anúncio, mesmo quando a rota venceu. Serve para medir. */
  sinal: PcSinalSituacao | null;
  /** `true` quando o anúncio sugeriu uma situação diferente da rota. Vale medir. */
  conflito: boolean;
  /** Contrato, não opção: o seletor de situação está sempre na página (cap. 20). */
  podeTrocar: true;
}

export interface PcEntradaPersonalizacao {
  /** Situação da rota física (`/migracao` → `migracao`; a entrada geral → `geral`). */
  situacaoDaRota: PcSituacao;
  /** O que o visitante escolheu no seletor, se já escolheu. Vence tudo. */
  declarada?: PcSituacao | null;
  /** O que veio na URL. */
  fonte?: PcFonteAnuncio | null;
}

/**
 * A precedência, e o porquê de cada degrau:
 *
 *   1. DECLARADA — o visitante corrigiu. Dado ganha de suposição, sempre.
 *   2. ROTA — quando a rota não é a geral, ela É a promessa em que a pessoa clicou
 *      e é o que a URL mostra. Um token de anúncio que discorde perde: a página
 *      não pode dizer uma coisa e a barra de endereço outra. O desacordo não é
 *      apagado, vira `conflito` para alguém olhar.
 *   3. ANÚNCIO — na entrada geral, o nome do anúncio é a melhor pista disponível.
 *   4. PADRÃO — a página abre neutra e o seletor faz o trabalho.
 */
export function resolverPersonalizacao({
  situacaoDaRota,
  declarada = null,
  fonte = null,
}: PcEntradaPersonalizacao): PcPersonalizacao {
  const sinal = fonte ? situacaoDoAnuncio(fonte) : null;

  if (declarada) {
    return {
      situacao: declarada,
      confianca: "declarada",
      hipotese: false,
      sinal,
      conflito: sinal !== null && sinal.situacao !== declarada,
      podeTrocar: true,
    };
  }

  if (situacaoDaRota !== "geral") {
    return {
      situacao: situacaoDaRota,
      confianca: "rota",
      hipotese: true,
      sinal,
      conflito: sinal !== null && sinal.situacao !== situacaoDaRota,
      podeTrocar: true,
    };
  }

  if (sinal && sinal.situacao !== "geral") {
    return {
      situacao: sinal.situacao,
      confianca: "anuncio",
      hipotese: true,
      sinal,
      conflito: false,
      podeTrocar: true,
    };
  }

  return {
    situacao: situacaoDaRota,
    confianca: "padrao",
    hipotese: false,
    sinal,
    conflito: false,
    podeTrocar: true,
  };
}

/**
 * Parâmetros da personalização para o evento (`projeto_situacao_escolhida` e
 * companhia, em `pc-eventos.ts`). Nomes curtos e chaves estáveis — é o que o
 * Events Manager vai agrupar por meses.
 *
 * Não carrega texto livre: só a chave da situação, a confiança e de onde veio.
 */
export function paramsDaPersonalizacao(p: PcPersonalizacao): Record<string, string | boolean> {
  return {
    situacao: p.situacao,
    confianca: p.confianca,
    hipotese: p.hipotese,
    ...(p.sinal ? { sinal_campo: p.sinal.campo, sinal_via: p.sinal.via } : {}),
    ...(p.sinal?.peca ? { sinal_peca: p.sinal.peca } : {}),
    ...(p.conflito ? { conflito: true } : {}),
  };
}
