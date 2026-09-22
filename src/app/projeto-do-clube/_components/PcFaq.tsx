"use client";

/**
 * PROJETO DO CLUBE — perguntas frequentes (B8).
 *
 * TRÊS DECISÕES QUE EXPLICAM O CÓDIGO ABAIXO:
 *
 * 1. `<details>`/`<summary>` nativo, não um acordeão de `useState`. Com o JS
 *    desligado, quebrado ou ainda baixando, a pessoa continua abrindo e lendo
 *    qualquer resposta — é o requisito V6 da arquitetura aplicado ao único bloco
 *    da página que esconde conteúdo por desenho. De quebra, vem de graça a
 *    semântica de acessibilidade que um `<div role="button">` teria de imitar.
 *
 * 2. A animação de abertura é `Web Animations API` sobre a ALTURA do painel, e
 *    ela existe porque um acordeão que salta é um acordeão inacabado. §4.2 proíbe
 *    animar altura em bloco grande — a exceção aqui é consciente e registrada em
 *    §8: o painel é pequeno, tem `overflow: hidden`, a animação dura
 *    `--pc-dur-2` (260 ms) e não há jeito de abrir um acordeão só com `transform`.
 *    O TEXTO dentro dele entra por `opacity` + `translateY`, que é composição pura.
 *
 * 3. Com `prefers-reduced-motion: reduce`, o handler devolve o clique ao navegador
 *    e o `<details>` abre instantâneo. Nada pisca, nada some, nada fica preso.
 *
 * A pergunta em DESTAQUE é a da peça do anúncio (`peca.faqPergunta`) — a página
 * responde primeiro a dúvida que o criativo abriu. Ela nasce aberta.
 *
 * O texto das perguntas não mora aqui: vem por props (B3) e passa por
 * `../_lib/perguntas`, que bloqueia o que não pode ir ao ar (V10) e troca a
 * resposta que pressupõe serviço não aprovado (§8/P8).
 */

import { useCallback, useEffect, useMemo, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import { PC_MOVIMENTO, pcTokenMs, prefereMovimentoReduzido } from "./pc-motion";
import { montarFaq } from "../_lib/perguntas";
import type { PcFaqItem, PcSituacao } from "./pc.types";
import estilos from "./pc-fundo.module.css";

export interface PcFaqProps {
  /** Par da peça resolvida pelo anúncio. É o primeiro item e nasce aberto. */
  destaque: PcFaqItem;
  /**
   * As gerais do cap. 13 (`PC_FAQ_GERAL`). `readonly` porque a fonte é uma constante
   * de módulo: quem recebe a lista só lê, e `montarFaq` já trabalha em cópia.
   * A de fidelidade não entra — quem a derruba é `filtrarPerguntas`, não a ausência
   * dela na constante (V10).
   */
  gerais: readonly PcFaqItem[];
  /** Situação da página: traz perguntas do acervo daquela entrada. */
  situacao?: PcSituacao;
  /** Quantas perguntas do acervo entram além do destaque. */
  limiteSituacao?: number;
  /**
   * Perguntas já respondidas em outro bloco da página (`Objecoes` também usa
   * literais do acervo — L011 e L042 aparecem nos dois). Evita a mesma resposta
   * duas vezes sem que nenhum dos dois blocos precise conhecer o outro.
   */
  excluir?: readonly string[];
  /** Rótulo da seção. O padrão é o do cap. 13. */
  titulo?: string;
  /** Link para `/projeto-do-clube/condicoes`, já com a search colada (`pc-link`). */
  hrefCondicoes?: string;
  /** Deixa `pc-eventos` registrar a abertura das condições a partir daqui. */
  aoAbrirCondicoes?: () => void;
}

const ID_SECAO = "pc-perguntas";

export function PcFaq({
  destaque,
  gerais,
  situacao,
  limiteSituacao = 3,
  excluir,
  titulo = "Perguntas frequentes",
  hrefCondicoes,
  aoAbrirCondicoes,
}: PcFaqProps) {
  // `montarFaq` filtra, deduplica e avisa no console de desenvolvimento o que
  // saiu do ar. Refazer isso a cada render repetiria o aviso e o trabalho.
  const itens = useMemo<{ item: PcFaqItem; ehDestaque: boolean }[]>(() => {
    const montagem = montarFaq({ destaque, gerais, situacao, limiteSituacao, excluir });
    return [
      ...(montagem.destaque ? [{ item: montagem.destaque, ehDestaque: true }] : []),
      ...montagem.demais.map((item) => ({ item, ehDestaque: false })),
    ];
  }, [destaque, gerais, situacao, limiteSituacao, excluir]);

  if (itens.length === 0) return null;

  return (
    <PcSecao id={ID_SECAO} fundo="carvao">
      <div className={estilos.faq}>
        <PcRevelar className={estilos.faqCabecalho}>
          <span className={estilos.faqRotulo}>Dúvidas</span>
          <h2 className={estilos.faqTitulo}>{titulo}</h2>
        </PcRevelar>

        <ul className={estilos.faqLista}>
          {itens.map(({ item, ehDestaque }, indice) => (
            <PcRevelar
              key={item.pergunta}
              como="li"
              // Escalonamento de no máximo 4 itens (§4.1, M1): do 5º em diante
              // todos entram juntos, senão o último chega depois da rolagem.
              atraso={Math.min(indice, 3) * PC_MOVIMENTO.stagger}
            >
              <ItemFaq item={item} ehDestaque={ehDestaque} nasceAberto={ehDestaque} />
            </PcRevelar>
          ))}
        </ul>

        {hrefCondicoes ? (
          <PcRevelar como="div">
            <p className={estilos.faqNota}>
              <Link href={hrefCondicoes} className={estilos.faqNotaLink} onClick={aoAbrirCondicoes}>
                Investimento e condições
              </Link>
            </p>
          </PcRevelar>
        ) : null}
      </div>
    </PcSecao>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Um item — o `<details>` com a abertura animada.
   ─────────────────────────────────────────────────────────────────────────── */

interface ItemFaqProps {
  item: PcFaqItem;
  ehDestaque: boolean;
  nasceAberto: boolean;
}

function ItemFaq({ item, ehDestaque, nasceAberto }: ItemFaqProps) {
  const detalhes = useRef<HTMLDetailsElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const animacao = useRef<Animation | null>(null);

  const aoClicar = useCallback((evento: MouseEvent<HTMLElement>) => {
    const caixa = detalhes.current;
    const alvo = painel.current;

    // Sem elemento, sem WAAPI ou com movimento reduzido: o clique segue para o
    // navegador e o `<details>` faz o trabalho dele. É o caminho de sempre.
    if (!caixa || !alvo || typeof alvo.animate !== "function" || prefereMovimentoReduzido()) {
      return;
    }

    evento.preventDefault();
    animacao.current?.cancel();

    const duracao = pcTokenMs(caixa, "--pc-dur-2", PC_MOVIMENTO.dur2);
    const abrindo = !caixa.open;

    // Abre ANTES de medir: `scrollHeight` de painel fechado é zero, e a animação
    // sairia de zero para zero — abrir sem nada acontecer na tela.
    if (abrindo) caixa.open = true;
    const altura = alvo.scrollHeight;

    const quadros: Keyframe[] = abrindo
      ? [
          { height: "0px", opacity: 0 },
          { height: `${altura}px`, opacity: 1 },
        ]
      : [
          { height: `${altura}px`, opacity: 1 },
          { height: "0px", opacity: 0 },
        ];

    // `fill` diferente nos dois sentidos, e a razão é um frame de piscada:
    // ao FECHAR, sem `forwards` o efeito é removido no fim e a altura volta ao
    // tamanho cheio por um quadro, antes de `onfinish` fechar o `<details>`.
    // Ao ABRIR, `forwards` seria pior: travaria a altura no pixel medido e o
    // texto ficaria cortado se a fonte carregar depois ou a janela mudar.
    const atual = alvo.animate(quadros, {
      duration: duracao,
      easing: PC_MOVIMENTO.easeSaida,
      fill: abrindo ? "none" : "forwards",
    });
    animacao.current = atual;

    atual.onfinish = () => {
      // Fechar de verdade só no fim: enquanto anima, o conteúdo precisa existir
      // para ser visto encolhendo.
      if (!abrindo && detalhes.current) detalhes.current.open = false;
      animacao.current = null;
    };
    atual.oncancel = () => {
      animacao.current = null;
    };
  }, []);

  // Desmontou no meio da abertura: a animação some junto com o elemento.
  useEffect(() => () => animacao.current?.cancel(), []);

  return (
    <details
      ref={detalhes}
      open={nasceAberto || undefined}
      className={`${estilos.item} ${ehDestaque ? estilos.itemDestaque : ""}`}
    >
      <summary className={estilos.pergunta} onClick={aoClicar}>
        <span>{item.pergunta}</span>
        <svg
          className={estilos.seta}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <div ref={painel} className={estilos.painel}>
        <p className={estilos.resposta}>{item.resposta}</p>
      </div>
    </details>
  );
}
