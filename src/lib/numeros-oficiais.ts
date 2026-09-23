/**
 * NÚMEROS OFICIAIS DE DIVULGAÇÃO — fonte única no site.
 *
 * Os quatro agregados públicos da marca, como estão escritos na régua do OS
 * (`bestbarbers-ai/knowledge/marketing/instagram-voz-do-time.md` §9 e
 * `knowledge/dominio/competitors-intel.md`). Qualquer outro número de escala é
 * interno ou morto — ver `numeros-mortos.test.ts`.
 *
 * O PREDICADO É PARTE DO NÚMERO. «51.000+ assinantes» significa assinantes ATIVOS
 * na plataforma, e só isso. Nunca «51 mil pagam sem ninguém pedir», nunca «51.000
 * assinantes EM 1.200 barbearias» como se fosse média — os dois já foram pegos em
 * peça (cap. 36 §10.4). O `rotulo` abaixo é o predicado autorizado.
 *
 * Consumidores: `projeto-do-clube/_components/Numeros.tsx` (bloco de números) e
 * `content/clube-pecas.ts` (as 11 páginas `/clube/[peca]`, que citam o número por
 * TOKEN — `{barbearias}`, `{assinantes}` — e nunca pelo literal).
 *
 * Módulo puro, sem React: roda no servidor, no cliente e no `node --test`.
 */

export interface NumeroOficial {
  /** Valor numérico (para contador animado). */
  valor: number;
  /** Como o número é ESCRITO em texto corrido. */
  texto: string;
  /** O que o número conta — o predicado autorizado, e só ele. */
  rotulo: string;
  /** Onde está confirmado, no repositório do OS. */
  fonte: string;
}

export const NUMEROS_OFICIAIS = {
  barbearias: {
    valor: 1200,
    texto: "1.200+",
    rotulo: "barbearias usam a BestBarbers",
    fonte: "knowledge/dominio/competitors-intel.md",
  },
  assinantes: {
    valor: 51000,
    texto: "51.000+",
    rotulo: "assinantes de clube na base da plataforma",
    fonte: "knowledge/dominio/competitors-intel.md",
  },
  processado: {
    valor: 5,
    texto: "R$5 mi+",
    rotulo: "processados por mês na plataforma",
    fonte: "knowledge/marketing/stories-instagram-playbook.md",
  },
  agendamentos: {
    valor: 6,
    texto: "6 mi+",
    rotulo: "agendamentos por mês",
    fonte: "knowledge/marketing/instagram-voz-do-time.md",
  },
} as const satisfies Record<string, NumeroOficial>;

export type NumeroOficialId = keyof typeof NUMEROS_OFICIAIS;

/**
 * Troca `{barbearias}`, `{assinantes}`… pelo texto oficial. Token desconhecido
 * LANÇA erro: um `{assinates}` digitado errado não pode chegar à página como texto
 * literal — e, como as páginas são geradas no build, o erro derruba o build, não o
 * visitante.
 */
export function comNumerosOficiais(texto: string): string {
  return texto.replace(/\{([a-z]+)\}/g, (_, id: string) => {
    if (!Object.prototype.hasOwnProperty.call(NUMEROS_OFICIAIS, id)) {
      throw new Error(`Número oficial desconhecido: {${id}}`);
    }
    return NUMEROS_OFICIAIS[id as NumeroOficialId].texto;
  });
}
