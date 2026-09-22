"use client";

/**
 * PROJETO DO CLUBE — A DEMONSTRAÇÃO.
 *
 * Simulação da tela do sistema: a cobrança do ciclo e a comissão do
 * profissional, em quatro passos encadeados. É mock em CSS — não é captura de
 * tela — justamente para a página não travar esperando produção de imagem
 * (V14 da arquitetura: placeholder agora, substituição depois).
 *
 * ─── HONESTIDADE DO QUE ESTÁ NA TELA ───────────────────────────────────────
 * Tudo aqui é fictício e está rotulado como tal: barbearia de exemplo,
 * assinantes por letra, profissionais por número, valores ilustrativos.
 * Nenhum nome de cliente, parceiro ou concorrente. Nenhuma taxa inventada —
 * o texto diz que o extrato mostra bruto, taxas e líquido, e a tela não
 * fabrica o número da taxa.
 *
 * ─── MOVIMENTO (M3 de §4.1) ────────────────────────────────────────────────
 * Web Animations API por `animarSequencia`, disparada por IntersectionObserver
 * com guarda de módulo (WeakSet) para não repetir a cada volta de rolagem.
 * O mock é servido no ESTADO FINAL: cada passo anima do estado «antes» para o
 * estado que o HTML já tem. Sem JS, com JS quebrado, com a animação cancelada
 * ou com `prefers-reduced-motion`, a pessoa vê a tela concluída.
 *
 * TODO(asset): clube-cobranca — tela do clube com a cobrança de um assinante,
 * marca fictícia (4/3, 150 KB). Quando existir, entra por `<PcArtefato/>`
 * ACIMA deste mock, que passa a ser o detalhe animado.
 * TODO(asset): clube-extrato-comissao — extrato de comissão por profissional,
 * do atendimento ao valor (4/3, 150 KB).
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  PC_MOVIMENTO,
  animarSequencia,
  cancelarAnimacoes,
  observarUmaVez,
  usePcMovimentoReduzido,
  type PcPassoAnim,
} from "./pc-motion";
import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import type { PcArtefatoId } from "./pc.types";
import estilos from "./Demonstracao.module.css";

/** Guarda anti-repetição entre remontagens e voltas de rolagem (§4.1 M3). */
const jaTocaram = new WeakSet<Element>();

/** Texto aprovado do cap. 13 — resumo da demonstração aberta. */
export const PC_DEMONSTRACAO_RESUMO =
  "Conheça a regra de uso, a adesão autorizada ao plano e a conferência da cobrança. Demonstração com dados fictícios.";

/** Rótulo aprovado do botão da demonstração (cap. 13). */
export const PC_DEMONSTRACAO_BOTAO = "Ver o clube funcionando";

/** As quatro passagens que a simulação conta, na ordem. */
const LEGENDAS: readonly string[] = [
  "A regra do plano vale nos serviços e nos dias que você definiu.",
  "O assinante adere e entra na lista de cobrança do ciclo.",
  "A fatura é paga e o recebimento aparece no extrato.",
  "O atendimento vira comissão de assinatura do profissional.",
] as const;

export interface PcDemonstracaoProps {
  rotulo?: string;
  titulo?: string;
  /** Resumo textual. Padrão: o literal aprovado do cap. 13. */
  resumo?: string;
  /** Rótulo do botão. Padrão: «Ver o clube funcionando». */
  botao?: string;
  /** Id do artefato que esta demonstração representa — viaja para a medição. */
  artefatoId?: PcArtefatoId;
  /** Medição: `clube_demo_aberta`. Quem chama decide o nome do evento. */
  aoAbrir?: (artefatoId?: PcArtefatoId) => void;
  id?: string;
  className?: string;
}

/* ───────────────────────────────────────────────────────────────────────────
   A SEQUÊNCIA

   Cada entrada é um grupo (= um passo narrativo). O último keyframe de cada
   animação é IGUAL ao estado natural do elemento no HTML — por isso o
   `fill: "both"` de `animarSequencia` não deixa nada preso numa pose falsa.
   ─────────────────────────────────────────────────────────────────────────── */

interface DefinicaoPasso {
  /** Valor de `data-pc-anim` no elemento. */
  nome: string;
  keyframes: Keyframe[];
  duracao?: number;
  /** Respiro antes deste movimento, somado ao acumulado da sequência. */
  respiro?: number;
}

const SEQUENCIA: readonly (readonly DefinicaoPasso[])[] = [
  // 1 — a regra do plano acende
  [
    {
      nome: "regra",
      keyframes: [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      duracao: PC_MOVIMENTO.dur4,
    },
  ],
  // 2 — a adesão: a linha do assinante entra na lista
  [
    {
      nome: "adesao",
      keyframes: [
        { opacity: 0, transform: "translateY(-10px)" },
        { opacity: 1, transform: "none" },
      ],
      duracao: PC_MOVIMENTO.dur4,
      respiro: 120,
    },
  ],
  // 3 — a cobrança: «pendente» sai de cima de «paga», e o total do ciclo troca
  [
    {
      nome: "statusPendente",
      keyframes: [{ opacity: 1 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }],
      duracao: PC_MOVIMENTO.dur4,
      respiro: 120,
    },
    {
      nome: "totalAntes",
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      duracao: PC_MOVIMENTO.dur2,
    },
  ],
  // 4 — a comissão do profissional cresce e o valor troca
  [
    {
      nome: "barraComissao",
      keyframes: [{ transform: "scaleX(.44)" }, { transform: "scaleX(1)" }],
      duracao: PC_MOVIMENTO.dur4,
      respiro: 160,
    },
    {
      nome: "comissaoAntes",
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      duracao: PC_MOVIMENTO.dur2,
    },
  ],
] as const;

function montarPassos(raiz: HTMLElement): { passos: PcPassoAnim[]; fimDoGrupo: number[] } {
  const passos: PcPassoAnim[] = [];
  const fimDoGrupo: number[] = [];

  for (const grupo of SEQUENCIA) {
    const antes = passos.length;
    for (const definicao of grupo) {
      const alvo = raiz.querySelector<HTMLElement>(`[data-pc-anim="${definicao.nome}"]`);
      if (!alvo) continue;
      passos.push({
        alvo,
        keyframes: definicao.keyframes,
        opcoes: {
          duration: definicao.duracao ?? PC_MOVIMENTO.dur4,
          delay: definicao.respiro ?? 0,
          easing: PC_MOVIMENTO.easeSaida,
        },
      });
    }
    // Índice da última animação deste grupo — é ela que fecha o passo narrativo.
    // Grupo sem nenhum alvo no DOM entra como -1: a legenda o pula em vez de
    // herdar o índice do grupo anterior e contar a ordem errada.
    fimDoGrupo.push(passos.length > antes ? passos.length - 1 : -1);
  }

  return { passos, fimDoGrupo };
}

/* ───────────────────────────────────────────────────────────────────────────
   O MOCK — simulação da tela. Marcado como placeholder, sem exceção.
   ─────────────────────────────────────────────────────────────────────────── */

function Mock(): ReactNode {
  return (
    <div className={estilos.mock}>
      <div className={estilos.mockTopo}>
        <span className={estilos.mockMarca}>Barbearia Exemplo</span>
        <span className={estilos.mockCaminho}>Clube de assinatura</span>
        <span className={`pc-selo pc-selo--neutro ${estilos.mockSelo}`}>Dados fictícios</span>
      </div>

      <div className={estilos.mockCorpo}>
        {/* ── Painel da cobrança ────────────────────────────────────────── */}
        <section className={estilos.painel} aria-label="Cobrança do clube, simulação">
          <header className={estilos.painelTopo}>
            <h3 className={estilos.painelTitulo}>Cobrança do ciclo</h3>
          </header>

          <div className={estilos.planoLinha}>
            <span className={estilos.planoNome}>Plano Completo</span>
            <span className={`${estilos.planoValor} pc-tabular`}>R$ 129,90</span>
          </div>

          <div className={estilos.regraChips} data-pc-anim="regra">
            <span className={estilos.regraChip}>4 usos no mês</span>
            <span className={estilos.regraChip}>Ter · Qui · Sáb</span>
            <span className={estilos.regraChip}>Comissão 40%</span>
          </div>

          <ul className={`pc-lista ${estilos.faturas}`}>
            <li className={estilos.fatura}>
              <span className={estilos.faturaNome}>Assinante A</span>
              <span className={`${estilos.faturaValor} pc-tabular`}>R$ 129,90</span>
              <span className={`${estilos.status} ${estilos.statusOk}`}>Paga</span>
            </li>
            <li className={estilos.fatura}>
              <span className={estilos.faturaNome}>Assinante B</span>
              <span className={`${estilos.faturaValor} pc-tabular`}>R$ 129,90</span>
              <span className={`${estilos.status} ${estilos.statusAlerta}`}>Vencida</span>
            </li>
            <li className={estilos.fatura} data-pc-anim="adesao" data-novo>
              <span className={estilos.faturaNome}>Assinante C</span>
              <span className={`${estilos.faturaValor} pc-tabular`}>R$ 129,90</span>
              <span className={estilos.statusPilha}>
                <span className={`${estilos.status} ${estilos.statusOk}`}>Paga</span>
                <span
                  className={`${estilos.status} ${estilos.statusEspera} ${estilos.statusSobreposto}`}
                  data-pc-anim="statusPendente"
                  aria-hidden="true"
                >
                  Pendente
                </span>
              </span>
            </li>
          </ul>

          <footer className={estilos.painelRodape}>
            {/*
              Contava as TRÊS faturas (3 × R$ 129,90 = R$ 389,70) — inclusive a do Assinante B,
              que está com o selo "Vencida" três linhas acima. O estado "antes" tinha o mesmo
              defeito. Corrigido em 20/Set/26: recebido é só o que entrou (A + C = R$ 259,80;
              antes da adesão do C, só A = R$ 129,90).

              Não era detalhe de demonstração: é o card que mostra a cobrança para quem está
              avaliando comprar, e a rota /controle afirma na mesma página que "o sistema não
              esconde a cobrança que não entrou". O número escondia.
            */}
              <span className={estilos.rodapeRotulo}>Recebido no ciclo</span>
            <span className={estilos.pilhaValor}>
              <span className={`${estilos.rodapeValor} pc-tabular`}>R$ 259,80</span>
              <span
                className={`${estilos.rodapeValor} ${estilos.valorSobreposto} pc-tabular`}
                data-pc-anim="totalAntes"
                aria-hidden="true"
              >
                R$ 129,90
              </span>
            </span>
          </footer>
        </section>

        {/* ── Painel da comissão ────────────────────────────────────────── */}
        <section className={estilos.painel} aria-label="Comissão por profissional, simulação">
          <header className={estilos.painelTopo}>
            <h3 className={estilos.painelTitulo}>Comissão de assinatura</h3>
          </header>

          <ul className={`pc-lista ${estilos.profissionais}`}>
            <li className={estilos.profissional}>
              <span className={estilos.profNome}>Profissional 1</span>
              <span className={estilos.profTrilho} aria-hidden="true">
                <span className={estilos.profBarra} data-peso="alto" />
              </span>
              <span className={`${estilos.profValor} pc-tabular`}>R$ 207,84</span>
            </li>
            <li className={estilos.profissional} data-destaque>
              <span className={estilos.profNome}>Profissional 2</span>
              <span className={estilos.profTrilho} aria-hidden="true">
                <span className={estilos.profBarra} data-peso="medio" data-pc-anim="barraComissao" />
              </span>
              <span className={estilos.pilhaValor}>
                <span className={`${estilos.profValor} pc-tabular`}>R$ 155,88</span>
                <span
                  className={`${estilos.profValor} ${estilos.valorSobreposto} pc-tabular`}
                  data-pc-anim="comissaoAntes"
                  aria-hidden="true"
                >
                  R$ 103,92
                </span>
              </span>
            </li>
            <li className={estilos.profissional}>
              <span className={estilos.profNome}>Profissional 3</span>
              <span className={estilos.profTrilho} aria-hidden="true">
                <span className={estilos.profBarra} data-peso="baixo" />
              </span>
              <span className={`${estilos.profValor} pc-tabular`}>R$ 103,92</span>
            </li>
          </ul>

          <footer className={estilos.painelRodape}>
            <span className={estilos.rodapeRotulo}>Quitação</span>
            <span className={estilos.quitacao}>
              <span className={`${estilos.status} ${estilos.statusOk}`}>Pago</span>
              <span className={`${estilos.status} ${estilos.statusEspera}`}>Pendente</span>
            </span>
          </footer>
        </section>
      </div>

      {/*
        Até 20/Set/26 este aviso dizia ao VISITANTE: "Placeholder — Simulação da interface, feita
        em CSS. A tela real do sistema entra aqui quando a captura estiver pronta." Era uma nota
        interna vazada para o público: a página contava ao lead que a própria demonstração era
        falsa, numa rota de tráfego pago.

        O texto novo é escrito para quem lê a página, e foi redigido de propósito para continuar
        VERDADEIRO depois que a captura real entrar — uma tela de produto com dados de exemplo
        segue sendo tela de exemplo. Assim ele não precisa de interruptor e não vira mentira por
        esquecimento, que era o segundo defeito do texto antigo (ele não tinha amarração com
        `PC_ARTEFATOS[id].status` e não sumiria sozinho).

        É o mesmo aviso que os criativos estáticos desta campanha usam.
      */}
      <p className={estilos.mockAviso}>
        <span className={estilos.mockAvisoSelo}>Exemplo</span>
        Tela de exemplo do sistema, com nomes e valores fictícios.
      </p>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   O BLOCO
   ─────────────────────────────────────────────────────────────────────────── */

export function PcDemonstracao({
  rotulo = "Demonstração",
  titulo = "A cobrança e a comissão, na tela",
  resumo = PC_DEMONSTRACAO_RESUMO,
  botao = PC_DEMONSTRACAO_BOTAO,
  artefatoId = "clube-cobranca",
  aoAbrir,
  id = "pc-demonstracao",
  className,
}: PcDemonstracaoProps): ReactNode {
  const refMock = useRef<HTMLDivElement | null>(null);
  const refAnimacoes = useRef<Animation[]>([]);
  const [tocando, setTocando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [passoAtivo, setPassoAtivo] = useState<number | null>(null);
  const reduzido = usePcMovimentoReduzido();

  const pararTudo = useCallback(() => {
    cancelarAnimacoes(refAnimacoes.current);
    refAnimacoes.current = [];
  }, []);

  const tocar = useCallback(() => {
    const raiz = refMock.current;
    if (!raiz || reduzido) return;

    pararTudo();

    const { passos, fimDoGrupo } = montarPassos(raiz);
    if (passos.length === 0) return;

    const animacoes = animarSequencia(passos, { reduzido: false });
    refAnimacoes.current = animacoes;

    if (animacoes.length === 0) return;

    setTocando(true);
    setPausado(false);
    setPassoAtivo(0);

    // A legenda anda junto: cada grupo que termina entrega a vez ao próximo.
    // Só liga quando os índices batem — se o navegador pulou algum alvo,
    // a sequência continua e a legenda fica neutra, sem mentir a ordem.
    if (animacoes.length === passos.length) {
      fimDoGrupo.forEach((indice, grupo) => {
        if (indice < 0) return;
        const animacao = animacoes[indice];
        if (!animacao) return;
        animacao.addEventListener(
          "finish",
          () => {
            if (grupo < fimDoGrupo.length - 1) setPassoAtivo(grupo + 1);
          },
          { once: true },
        );
      });
    }

    const ultima = animacoes[animacoes.length - 1];
    ultima?.addEventListener("finish", () => setTocando(false), { once: true });
  }, [pararTudo, reduzido]);

  /** Primeira execução: quando o mock aparece, uma vez por elemento. */
  useEffect(() => {
    const raiz = refMock.current;
    if (!raiz || reduzido) return;

    return observarUmaVez(raiz, () => {
      if (jaTocaram.has(raiz)) return;
      jaTocaram.add(raiz);
      tocar();
    });
  }, [tocar, reduzido]);

  /** Nada de animação sobrevivendo à saída do componente. */
  useEffect(() => () => pararTudo(), [pararTudo]);

  const alternarPausa = useCallback(() => {
    const animacoes = refAnimacoes.current;
    if (animacoes.length === 0) return;
    const vaiPausar = !pausado;
    for (const animacao of animacoes) {
      if (vaiPausar) animacao.pause();
      else animacao.play();
    }
    setPausado(vaiPausar);
  }, [pausado]);

  const verDeNovo = useCallback(() => {
    setPassoAtivo(null);
    tocar();
  }, [tocar]);

  /**
   * O botão da demonstração: enquanto o vídeo de capa for placeholder, ele
   * leva para esta mesma seção e repete a simulação (guarda V9). O evento
   * dispara do mesmo jeito, para a série histórica não nascer com buraco.
   */
  const abrir = useCallback(() => {
    aoAbrir?.(artefatoId);
    refMock.current?.scrollIntoView({
      behavior: reduzido ? "auto" : "smooth",
      block: "center",
    });
    verDeNovo();
  }, [aoAbrir, artefatoId, reduzido, verDeNovo]);

  return (
    <PcSecao id={id} fundo="papel" className={className}>
      <PcRevelar className={estilos.cabecalho}>
        <p className="pc-rotulo">{rotulo}</p>
        <h2 className="pc-titulo pc-titulo--2">{titulo}</h2>
        <p className="pc-texto pc-texto--grande">{resumo}</p>
        <button type="button" className="pc-botao pc-botao--ouro" onClick={abrir}>
          {botao}
        </button>
      </PcRevelar>

      <div className={estilos.palco}>
        <div
          className={`pc-cartao pc-cartao--papel ${estilos.moldura}`}
          ref={refMock}
          data-pc-artefato={artefatoId}
        >
          <Mock />
        </div>

        <div className={estilos.lateral}>
          <ol className={`pc-lista ${estilos.legendas}`}>
            {LEGENDAS.map((legenda, indice) => (
              <li
                key={legenda}
                className={estilos.legenda}
                data-ativa={passoAtivo === indice ? "sim" : undefined}
              >
                <span className={`pc-tabular ${estilos.legendaNumero}`} aria-hidden="true">
                  {indice + 1}
                </span>
                <span className={estilos.legendaTexto}>{legenda}</span>
              </li>
            ))}
          </ol>

          {reduzido ? null : (
            <div className={estilos.controles}>
              <button type="button" className="pc-botao pc-botao--fantasma" onClick={verDeNovo}>
                Ver de novo
              </button>
              <button
                type="button"
                className="pc-botao pc-botao--fantasma"
                onClick={alternarPausa}
                disabled={!tocando && !pausado}
              >
                {pausado ? "Continuar" : "Pausar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </PcSecao>
  );
}

export default PcDemonstracao;
