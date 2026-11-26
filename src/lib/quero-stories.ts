/**
 * /quero — a página só de formulário do adesivo de link dos stories do Instagram (26/Nov/26).
 *
 * É o MESMO formulário do modal do app próprio (`LeadFormModal`, aberto na página com `inline`), e só o título e o
 * botão mudam pelo tema do story (`?t=`). A lista é FECHADA: sem `t`, ou com um valor fora dela, vale `app`.
 *
 * O `?t=` vira página estática por um rewrite em `next.config.ts` (`/quero?t=ia` serve `/quero/ia`, e o navegador
 * continua em `/quero?…`, com a query inteira para a atribuição). A regex do rewrite repete as chaves daqui, e o
 * `quero-stories.test.ts` confere que as duas listas são iguais.
 *
 * Atribuição: o link dos stories leva `origin=120004089` ("Instagram - Link da bio" no Ploomes), que vence qualquer
 * `utm_source` (inclusive o `ig` que o Instagram acrescenta) e o `fbclid` (`resolverOrigem` em
 * `src/hooks/useUtmParams.ts`). Sem `origin` na URL, a origem padrão da página é a mesma 120004089.
 */

export interface TemaQuero {
  /** Título no formato do modal: texto antes, trecho em amarelo (#ffaf02), texto depois. */
  titulo: { antes: string; destaque: string; depois: string };
  /** Texto do botão de envio. */
  botao: string;
}

export const TEMAS_QUERO = {
  app: {
    titulo: { antes: "Tenha um ", destaque: "Aplicativo Próprio", depois: " com a marca da sua barbearia" },
    botao: "Quero o app da minha barbearia",
  },
  ia: {
    titulo: { antes: "Tenha a ", destaque: "IA no WhatsApp", depois: " atendendo a sua barbearia 24 horas" },
    botao: "Quero a IA na minha barbearia",
  },
  assinatura: {
    titulo: { antes: "Tenha ", destaque: "assinatura no cartão", depois: " caindo todo mês na sua barbearia" },
    botao: "Quero assinatura na minha barbearia",
  },
  nota: {
    titulo: { antes: "Tenha a ", destaque: "nota fiscal", depois: " saindo direto do atendimento" },
    botao: "Quero a nota automática",
  },
  tudo: {
    titulo: { antes: "Tenha o ", destaque: "BestBarbers", depois: " na sua barbearia" },
    botao: "Quero conhecer",
  },
} as const satisfies Record<string, TemaQuero>;

export type ChaveTemaQuero = keyof typeof TEMAS_QUERO;

export const CHAVES_TEMA_QUERO = Object.keys(TEMAS_QUERO) as ChaveTemaQuero[];

export const TEMA_PADRAO_QUERO: ChaveTemaQuero = "app";

/** "Instagram - Link da bio" no Ploomes: a origem padrão da página quando o link não traz `?origin=`. */
export const ORIGEM_QUERO = 120004089;

/** Tema do `?t=` (ou do segmento `/quero/<tema>`). Fora da lista fechada, ou ausente, vale `app`. */
export function temaDoParametro(t: string | null | undefined): ChaveTemaQuero {
  return t && Object.prototype.hasOwnProperty.call(TEMAS_QUERO, t) ? (t as ChaveTemaQuero) : TEMA_PADRAO_QUERO;
}

/** Descrição da origem no card (`[Stories]ia`); o `utm_content` do link entra depois, pela atribuição. */
export function descricaoDoQuero(tema: ChaveTemaQuero): string {
  return `[Stories]${tema}`;
}
