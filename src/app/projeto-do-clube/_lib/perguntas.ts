/**
 * PROJETO DO CLUBE — banco de perguntas e respostas (B8).
 *
 * O QUE ESTE ARQUIVO É: a régua de VERDADE do FAQ da família, não uma segunda
 * cópia da copy. Ele faz três coisas e só três:
 *
 *   1. DERIVA as perguntas por situação do acervo aprovado (`PC_PECAS`, de B3) —
 *      cada peça do acervo já carrega o par `faqPergunta`/`faqResposta` revisado.
 *      Derivar em vez de copiar é o que impede duas versões do mesmo texto.
 *   2. BLOQUEIA, em código, o que não pode ir ao ar (V10 da arquitetura: fidelidade,
 *      garantia contratual, multa, carência, cancelamento de contrato). O bloqueio
 *      não depende de ninguém lembrar: mesmo que a pergunta chegue por props, ela
 *      não renderiza.
 *   3. CONDICIONA a resposta que pressupõe serviço ainda não aprovado (§8/P8 —
 *      implantação assistida é oferta PROPOSTA, não serviço existente). Enquanto a
 *      condição for `false`, vai ao ar a resposta conservadora; quando o comercial
 *      aprovar, é uma linha em `PC_CONDICOES`.
 *
 * O QUE ELE NÃO É: dono da copy. `PC_FAQ_GERAL` (as 6 do cap. 13) continua em
 * `pc-copy.ts`, com B3. Aqui elas só PASSAM pelo filtro.
 *
 * Fontes: `13-ESTRUTURA-DE-LANDING-PAGES.md` §«Perguntas frequentes — copy proposta»
 * e `biblioteca-copy/LANDING-PAGES.md` (as 34 aprovadas).
 */

import { PC_PECAS } from "../_components/pc-pecas";
import type { PcFaqItem, PcSituacao } from "../_components/pc.types";

/* ───────────────────────────────────────────────────────────────────────────
   CONDIÇÕES — o que ainda não foi aprovado pelo comercial.
   Trocar para `true` é a ÚNICA edição necessária quando a aprovação sair.
   ─────────────────────────────────────────────────────────────────────────── */

export type PcCondicaoId = "implantacao_assistida" | "fidelidade_garantia";

export const PC_CONDICOES: Record<PcCondicaoId, boolean> = {
  /**
   * §8/P8 — «implantação assistida» é oferta proposta e sem capacidade confirmada.
   * Enquanto `false`, nenhuma resposta pública afirma que o serviço existe.
   */
  implantacao_assistida: false,
  /**
   * §8/P1 e V10 — fidelidade, garantia e cancelamento não têm resposta factual
   * aprovada. Enquanto `false`, a pergunta não vai ao ar em nenhuma forma.
   * O histórico (contrato falado de 12 meses × site divergente) proíbe improviso.
   */
  fidelidade_garantia: false,
};

/* ───────────────────────────────────────────────────────────────────────────
   BLOQUEIO — semântica de condição comercial, não palavra solta.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * Padrões que tiram a pergunta do ar enquanto `fidelidade_garantia` for `false`.
 *
 * ATENÇÃO ao que NÃO está aqui: «garante», «garantia» e «garantido» soltos. Seis
 * perguntas aprovadas do acervo existem justamente para NEGAR uma garantia («O
 * sistema garante que nunca haverá divergência?» → «Não.»). Um filtro por palavra
 * apagaria o conteúdo mais honesto da página. O que bloqueia é a CONDIÇÃO DE
 * CONTRATO: fidelidade, multa, rescisão, carência, cancelamento do contrato e
 * garantia no sentido de reembolso.
 */
const PADROES_BLOQUEADOS: readonly RegExp[] = [
  /fidelidade/i,
  /\bmulta\b/i,
  /rescis/i,
  /car[êe]ncia/i,
  /cancel\w*\s+(?:d[oa]\s+)?(?:contrato|plano|assinatura|servi[çc]o)/i,
  /garantia\s+(?:de\s+)?(?:reembolso|devolu[çc][ãa]o|contratual|estendida)/i,
];

/**
 * Respostas conservadoras para perguntas cuja copy aprovada pressupõe algo que
 * ainda não foi aprovado. A CHAVE é a pergunta normalizada — assim a substituição
 * funciona mesmo que B3 ajuste a pontuação do texto.
 */
const RESPOSTAS_CONDICIONADAS: ReadonlyArray<{
  condicao: PcCondicaoId;
  perguntaNormalizada: string;
  motivo: string;
  respostaConservadora: string;
}> = [
  {
    condicao: "implantacao_assistida",
    // «Vocês montam tudo por mim?» — cap. 13.
    perguntaNormalizada: "voces montam tudo por mim",
    motivo:
      "A resposta do cap. 13 abre com «A implantação assistida segue o escopo combinado», " +
      "o que afirma um serviço que §8/P8 registra como proposto e sem capacidade confirmada.",
    respostaConservadora:
      "O que a BestBarbers faz e o que a sua equipe precisa fazer é definido na conversa e " +
      "apresentado por escrito na proposta, com as entregas que dependem de validação. " +
      "Nada é considerado incluído sem estar escrito lá.",
  },
  {
    condicao: "implantacao_assistida",
    // «Vocês administram meu clube por mim?» — literal L027, usado no bloco Fronteira.
    // Acrescentado em 19/Set/2026 pelo integrador: a página SUPRIMIA a afirmação de
    // «implantação assistida» no FAQ e a PUBLICAVA na Fronteira, porque só o FAQ
    // passava por este filtro. Guarda que não alcança todo consumidor não é guarda.
    perguntaNormalizada: "voces administram meu clube por mim",
    motivo:
      "A resposta literal afirma que «a oferta proposta é produto e implantação assistida " +
      "com serviço» — o mesmo serviço que §8/P8 registra como proposto e sem capacidade " +
      "confirmada. A segunda frase (a rotina permanece com a barbearia) é verdadeira em " +
      "qualquer cenário e por isso é mantida.",
    respostaConservadora:
      "Não. A rotina diária e as decisões da barbearia permanecem com os seus responsáveis. " +
      "O que a BestBarbers entrega, e com que escopo, é apresentado por escrito na proposta.",
  },
];

/* ───────────────────────────────────────────────────────────────────────────
   Normalização — a chave de comparação e de deduplicação.
   ─────────────────────────────────────────────────────────────────────────── */

/** Minúsculo, sem acento, sem pontuação: «Vocês montam tudo?» → «voces montam tudo». */
export function normalizarPergunta(pergunta: string): string {
  return pergunta
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Em desenvolvimento, nada some calado: quem sumiu e por quê aparece no console. */
function avisar(mensagem: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[projeto-do-clube/perguntas] ${mensagem}`);
  }
}

/* ───────────────────────────────────────────────────────────────────────────
   O filtro — toda lista de FAQ da família passa por aqui antes de renderizar.
   ─────────────────────────────────────────────────────────────────────────── */

/** `true` quando a pergunta trata de condição comercial ainda não aprovada. */
export function perguntaBloqueada(item: PcFaqItem): boolean {
  if (PC_CONDICOES.fidelidade_garantia) return false;
  const texto = `${item.pergunta} ${item.resposta}`;
  return PADROES_BLOQUEADOS.some((padrao) => padrao.test(texto));
}

/**
 * Aplica as duas guardas a uma lista: remove o bloqueado e troca a resposta do
 * que está condicionado. É idempotente e preserva a ordem recebida.
 */
export function filtrarPerguntas<T extends PcFaqItem>(itens: readonly T[]): T[] {
  const saida: T[] = [];

  for (const item of itens) {
    if (perguntaBloqueada(item)) {
      avisar(`pergunta fora do ar (condição comercial pendente): «${item.pergunta}»`);
      continue;
    }

    const chave = normalizarPergunta(item.pergunta);
    const condicionada = RESPOSTAS_CONDICIONADAS.find((c) => c.perguntaNormalizada === chave);

    if (condicionada && !PC_CONDICOES[condicionada.condicao]) {
      avisar(
        `resposta conservadora em «${item.pergunta}» — condição «${condicionada.condicao}» pendente. ` +
          condicionada.motivo,
      );
      // Genérico (19/Set): o item conserva os campos EXTRAS que o consumidor precisa
      // — a `fonte` (L###) do bloco Fronteira é a chave de render e o `data-pc-fonte`
      // que torna a copy rastreável. Um filtro que devolvesse só pergunta/resposta
      // obrigaria cada consumidor a remontar o item, e remontar é onde a guarda
      // vazaria de novo. Só a RESPOSTA é trocada; o resto do item passa intacto.
      saida.push({ ...item, resposta: condicionada.respostaConservadora });
      continue;
    }

    saida.push(item);
  }

  return saida;
}

/* ───────────────────────────────────────────────────────────────────────────
   O banco por situação — DERIVADO do acervo, nunca copiado dele.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * As perguntas do acervo que pertencem a esta situação, em ordem de id (L001 antes
 * de L051) e já filtradas. Cada par vem literal da peça aprovada: quem quiser mudar
 * o texto muda a peça, e a mudança aparece na página e no anúncio ao mesmo tempo.
 *
 * `limite` existe porque um FAQ de vinte perguntas não é um FAQ: é um muro. Três é
 * o que cabe entre a pergunta em destaque (a da peça do anúncio) e as seis gerais.
 */
export function perguntasDaSituacao(situacao: PcSituacao, limite = 3): PcFaqItem[] {
  const doAcervo = Object.values(PC_PECAS)
    .filter((peca) => peca.situacao === situacao)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((peca) => ({ pergunta: peca.faqPergunta, resposta: peca.faqResposta }));

  return filtrarPerguntas(doAcervo).slice(0, Math.max(0, limite));
}

/* ───────────────────────────────────────────────────────────────────────────
   O recorte por situação — separado do filtro de compliance, de propósito.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * Tira da lista as perguntas que não pertencem à situação da página. Item sem
 * `situacoes` vale para todas — o recorte é exceção declarada, nunca o padrão,
 * senão cada pergunta nova precisaria ser autorizada nas quatro.
 *
 * Por que NÃO está dentro de `filtrarPerguntas`: aquele filtro é de compliance
 * (o que não pode ir ao ar em lugar nenhum) e roda mesmo sem situação. Este é
 * editorial (o que não faz sentido para ESTE leitor). Misturar os dois faria uma
 * pergunta bloqueada por condição comercial voltar ao ar só por trocar de rota.
 *
 * Sem situação definida, devolve tudo: é a página `geral` e quem consome a lista
 * fora de uma rota de situação.
 */
export function pertencemASituacao<T extends PcFaqItem>(
  itens: readonly T[],
  situacao: PcSituacao | null,
): T[] {
  if (!situacao) return [...itens];

  return itens.filter((item) => {
    if (!item.situacoes || item.situacoes.length === 0) return true;
    if (item.situacoes.includes(situacao)) return true;
    avisar(`pergunta fora desta situação («${situacao}»): «${item.pergunta}»`);
    return false;
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   A montagem final do FAQ da página.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcMontagemFaq {
  /** A pergunta da peça do anúncio. `null` quando ela caiu no filtro. */
  destaque: PcFaqItem | null;
  /** As da situação + as gerais, sem repetir o destaque nem repetir entre si. */
  demais: PcFaqItem[];
}

export interface PcMontarFaqEntrada {
  /** Par da peça resolvida pelo `utm_content` (B3). */
  destaque?: PcFaqItem | null;
  /** As 6 do cap. 13 — vêm de `PC_FAQ_GERAL`, em `pc-copy.ts`. */
  gerais?: readonly PcFaqItem[];
  /** Situação da página, para escolher as perguntas do acervo. */
  situacao?: PcSituacao | null;
  /** Quantas do acervo entram além do destaque. */
  limiteSituacao?: number;
  /**
   * Perguntas já respondidas em OUTRO bloco da mesma página (o de objeções, por
   * exemplo, que também consome literais do acervo). Casam pelo texto
   * normalizado. O destaque nunca é excluído: ele é a dúvida que o anúncio
   * abriu e a página responde, mesmo que apareça em outro lugar.
   */
  excluir?: readonly string[];
}

/**
 * Ordem da página: destaque (a dúvida que o anúncio abriu) → as da situação → as
 * gerais. Deduplicação pela pergunta normalizada, porque o destaque é, por
 * construção, uma das perguntas do acervo daquela situação.
 */
export function montarFaq({
  destaque = null,
  gerais = [],
  situacao = null,
  limiteSituacao = 3,
  excluir = [],
}: PcMontarFaqEntrada): PcMontagemFaq {
  const destaqueLimpo = destaque ? (filtrarPerguntas([destaque])[0] ?? null) : null;

  const vistas = new Set<string>(excluir.map(normalizarPergunta));
  if (destaqueLimpo) vistas.add(normalizarPergunta(destaqueLimpo.pergunta));

  const demais: PcFaqItem[] = [];

  /** Acrescenta o que ainda não apareceu, até `teto` itens desta lista. */
  const acrescentar = (lista: readonly PcFaqItem[], teto: number) => {
    let postas = 0;
    for (const item of lista) {
      if (postas >= teto) return;
      const chave = normalizarPergunta(item.pergunta);
      if (vistas.has(chave)) continue;
      vistas.add(chave);
      demais.push(item);
      postas += 1;
    }
  };

  // Pede mais do acervo do que o limite: o destaque sai desta mesma lista e some
  // na deduplicação, e cada exclusão pedida some junto. Sem essa folga, a página
  // perderia perguntas da situação por conta de itens que nem iam aparecer.
  if (situacao) {
    const folga = limiteSituacao + 1 + excluir.length;
    acrescentar(perguntasDaSituacao(situacao, folga), limiteSituacao);
  }
  acrescentar(pertencemASituacao(filtrarPerguntas(gerais), situacao), Number.POSITIVE_INFINITY);

  return { destaque: destaqueLimpo, demais };
}
