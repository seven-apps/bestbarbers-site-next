/**
 * Iscas (guias em PDF) servidas pela página /obrigado.
 *
 * A /obrigado é UMA página para VÁRIAS iscas: ela lê `?isca=<id>` e monta o título,
 * o subtítulo, o PDF, a mensagem do consultor e os `content_name` do pixel a partir
 * deste mapa. Sem o parâmetro (ou com um id desconhecido) ela cai em `ISCA_PADRAO`,
 * que é o comportamento histórico — links antigos de /obrigado continuam mostrando
 * o Cadeira Cheia.
 *
 * Para adicionar uma isca: (1) coloque o PDF em /public, (2) acrescente o id ao
 * union `IscaId`, (3) preencha a entrada em ISCAS. O `tsc` cobra a entrada nova
 * (o Record é exaustivo) e cobra também quem chamar `hrefObrigado` com id errado.
 *
 * SSOT do conteúdo dos guias: bestbarbers-ai/data/iscas/ebooks.json.
 */

/** Ids válidos de isca. É o que a /obrigado aceita em `?isca=`. */
export type IscaId = "cadeira-cheia" | "do-zero-a-assinatura";

export interface Isca {
  /** Nome do guia, como aparece no h1 ("Seu guia {titulo} está aqui"). */
  titulo: string;
  /**
   * Pedaço do título que fica em âmbar no h1. Precisa ser um trecho do `titulo`
   * (normalmente o final dele); se não for encontrado, o título inteiro é destacado.
   */
  palavraDestaque: string;
  /** Caminho do PDF em /public — o arquivo TEM que existir lá. */
  pdf: string;
  /**
   * Frase que orienta por onde começar a ler. O trecho entre aspas curvas (“ ”)
   * é renderizado em negrito pela página.
   */
  subtitulo: string;
  /**
   * Convite para a conversa com o consultor, exibido acima do botão de WhatsApp.
   * Fala da mesma dor do guia — é o que dá sentido à mensagem pré-preenchida.
   */
  consultor: string;
  /**
   * Mensagem pré-preenchida do WhatsApp do consultor, JÁ URL-encoded
   * (espaços como %20, acentos literais — mesma convenção do useWhatsAppRedirect).
   */
  whatsapp: string;
  /**
   * Sufixo usado nos `content_name` dos eventos de pixel. Mantido igual ao nome
   * histórico no Cadeira Cheia para não quebrar a série de ViewContent/GuiaDownload
   * que já roda desde 07/Jul/2026 (data do commit que criou a /obrigado e a
   * /cadeira-cheia — `git log --diff-filter=A src/app/obrigado/page.tsx`).
   */
  pixelId: string;
}

export const ISCAS: Record<IscaId, Isca> = {
  "cadeira-cheia": {
    titulo: "Cadeira Cheia",
    palavraDestaque: "Cadeira Cheia",
    pdf: "/guia-cadeira-cheia.pdf",
    subtitulo:
      "Comece por “enxergar quem sumiu”: é o passo de resultado mais rápido.",
    consultor:
      "Quer ver como o app te mostra quem sumiu e chama todo mundo de volta com 1 clique — grátis e sem limite? Um consultor da BestBarbers te mostra numa conversa rápida de 15 min, sem compromisso.",
    whatsapp:
      "Olá!%20Baixei%20o%20guia%20Cadeira%20Cheia%20e%20quero%20ver%20como%20o%20app%20me%20mostra%20quem%20sumiu.",
    pixelId: "Guia Cadeira Cheia",
  },
  "do-zero-a-assinatura": {
    titulo: "Do Zero à Assinatura",
    palavraDestaque: "Assinatura",
    pdf: "/guia-do-zero-a-assinatura.pdf",
    subtitulo:
      "Comece pela “Ficha da Cadeira Vaga”, no Capítulo 1: são seis linhas e você já sai com o seu número.",
    consultor:
      "Quer ver a régua de uso do seu clube — os dias de utilização de cada plano — montada com os números da sua Ficha? Um consultor da BestBarbers faz a conta com você numa conversa rápida de 15 min, sem compromisso.",
    whatsapp:
      "Olá!%20Baixei%20o%20guia%20Do%20Zero%20à%20Assinatura%20e%20quero%20ver%20como%20o%20app%20aplica%20a%20régua%20de%20uso%20do%20clube%20e%20cobra%20a%20mensalidade.",
    pixelId: "Guia Do Zero à Assinatura",
  },
};

/** Isca servida quando a /obrigado é aberta sem `?isca=` (ou com um id desconhecido). */
export const ISCA_PADRAO: IscaId = "cadeira-cheia";

/** Type guard: diz se uma string qualquer (query param) é um id de isca conhecido. */
export function ehIscaId(v: string): v is IscaId {
  return Object.prototype.hasOwnProperty.call(ISCAS, v);
}

/**
 * Monta o link da página de obrigado da isca. As LPs chamam SEMPRE este builder —
 * nunca escrevem "/obrigado?isca=..." à mão — para o `tsc` pegar id digitado errado.
 */
export function hrefObrigado(isca: IscaId): string {
  return `/obrigado?isca=${isca}`;
}

/**
 * Quebra o título em (antes, destaque, depois) para o h1 pintar só o destaque em
 * âmbar. Se `palavraDestaque` não estiver no título, o título inteiro vira destaque.
 */
export function partesDoTitulo(isca: Isca): {
  antes: string;
  destaque: string;
  depois: string;
} {
  const i = isca.titulo.lastIndexOf(isca.palavraDestaque);
  if (i < 0) return { antes: "", destaque: isca.titulo, depois: "" };
  return {
    antes: isca.titulo.slice(0, i),
    destaque: isca.palavraDestaque,
    depois: isca.titulo.slice(i + isca.palavraDestaque.length),
  };
}
