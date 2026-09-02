/**
 * Iscas (guias em PDF) servidas pela página /obrigado.
 *
 * A /obrigado é UMA página para VÁRIAS iscas: ela lê `?isca=<id>` e monta o título,
 * o subtítulo, o PDF, a mensagem do consultor e os `content_name` do pixel a partir
 * deste mapa. Sem o parâmetro (ou com um id desconhecido) ela cai em `ISCA_PADRAO`,
 * que é o comportamento histórico — links antigos de /obrigado continuam mostrando
 * o Cadeira Cheia.
 *
 * O parâmetro é sempre lido por `resolverIscaId`, que aceita também os APELIDOS_ISCA
 * (o nome comercial do guia escrito como id). Id canônico é chave de dado e não muda
 * quando o produto é renomeado; o apelido é a ponte para quem escreve o link à mão.
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
      "Quer ver como o app te mostra quem sumiu e chama todo mundo de volta com 1 clique — grátis e sem limite? Um consultor da BestBarbers te mostra numa conversa rápida de 15 min.",
    whatsapp:
      "Olá!%20Baixei%20o%20guia%20Cadeira%20Cheia%20e%20quero%20ver%20como%20o%20app%20me%20mostra%20quem%20sumiu.",
    pixelId: "Guia Cadeira Cheia",
  },
  /*
   * O ID e o caminho do PDF continuam `do-zero-a-assinatura` de propósito: a rota da LP,
   * a série de pixel e os links já distribuídos apontam pra eles. O que mudou em
   * 01/Set/2026 foi o PRODUTO — o arquivo em /public agora é o guia "Assinatura do Zero"
   * (12 páginas, 8 capítulos, ENSINO), no lugar do guia de diagnóstico reprovado pelo
   * André (30 páginas, a "ficha de seis linhas"). Nada da promessa antiga volta aqui.
   */
  "do-zero-a-assinatura": {
    titulo: "Assinatura do Zero",
    palavraDestaque: "do Zero",
    pdf: "/guia-do-zero-a-assinatura.pdf",
    subtitulo:
      "Leia na ordem — a ordem é o método. Se for abrir por um só, abra o “Capítulo 7”: são os 12 erros que derrubam o clube.",
    consultor:
      "Quer ver o clube da sua barbearia montado com os números do seu Capítulo 4 — o preço, os dias de utilização de cada plano e a cobrança? Um consultor da BestBarbers faz a conta com você numa conversa rápida de 15 min.",
    whatsapp:
      "Olá!%20Baixei%20o%20guia%20Assinatura%20do%20Zero%20e%20quero%20ver%20como%20o%20app%20cobra%20a%20mensalidade%20e%20fecha%20a%20comissão%20do%20clube.",
    pixelId: "Guia Assinatura do Zero",
  },
};

/** Isca servida quando a /obrigado é aberta sem `?isca=` (ou com um id desconhecido). */
export const ISCA_PADRAO: IscaId = "cadeira-cheia";

/** Type guard: diz se uma string qualquer (query param) é um id CANÔNICO de isca. */
export function ehIscaId(v: string): v is IscaId {
  return Object.prototype.hasOwnProperty.call(ISCAS, v);
}

/**
 * Apelidos aceitos em `?isca=` que resolvem para um id canônico.
 *
 * Existe porque o id canônico é CHAVE DE DADO (pixel, atribuição, `?isca=` já
 * distribuído) e não acompanha a troca de NOME do produto. Em 01/Set/2026 o guia
 * passou a se chamar "Assinatura do Zero" em tudo que a pessoa lê, mas o id seguiu
 * `do-zero-a-assinatura` de propósito. Sem este mapa, quem escrevesse o link com o
 * nome novo — e a partir de hoje é assim que a equipe, o parceiro e qualquer script
 * novo chamam o guia — caía SILENCIOSAMENTE no `ISCA_PADRAO` e recebia o Cadeira
 * Cheia: guia errado, PDF errado, `content_name` errado, sem erro nenhum na tela.
 *
 * O apelido resolve ANTES de tudo: a página, o PDF e o pixel seguem enxergando o id
 * canônico, então nada muda na série de eventos nem na atribuição.
 */
const APELIDOS_ISCA: Record<string, IscaId> = {
  // Nome definitivo do guia (decisão do André, 01/Set/2026) usado como se fosse id.
  "assinatura-do-zero": "do-zero-a-assinatura",
};

/**
 * Traduz o `?isca=` cru (canônico, apelido, vazio ou lixo) no id canônico que a
 * página deve servir. É o ÚNICO caminho de leitura do parâmetro — quem lê o query
 * param direto volta a ter o bug do apelido engolido.
 */
export function resolverIscaId(v: string | null | undefined): IscaId {
  if (!v) return ISCA_PADRAO;
  const chave = v.trim().toLowerCase();
  if (ehIscaId(chave)) return chave;
  return APELIDOS_ISCA[chave] ?? ISCA_PADRAO;
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
