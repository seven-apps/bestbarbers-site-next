"use client";

/**
 * PROJETO DO CLUBE — O MECANISMO.
 *
 * O que acontece quando o clube entra no sistema, em seis passos: o plano, a
 * regra de uso, a cobrança recorrente, a cobrança que falha, a comissão do
 * profissional e a nota fiscal.
 *
 * ─── VERDADE DO PRODUTO ────────────────────────────────────────────────────
 * Cada passo descreve função verificada na documentação do sistema
 * (`knowledge/system-docs/clube-de-assinatura.md`, `relatorios.md`,
 * `nota-fiscal.md`). O que NÃO está aqui de propósito, porque não foi
 * confirmado: retentativa automática de cobrança, régua de recuperação,
 * previsão, relatório contábil ou DRE. Nada de prazo de resultado.
 *
 * ─── MOVIMENTO (§4 da arquitetura) ─────────────────────────────────────────
 * V6: o conteúdo nasce visível e completo. A figura de cada passo é servida no
 * ESTADO FINAL; só depois que o JS assume ela recua para o estado inicial
 * (`data-estado="pronto"`) e o IntersectionObserver a traz de volta. Sem JS,
 * sem observer ou com `prefers-reduced-motion`, a pessoa lê o resultado —
 * que é o que prova a promessa.
 *
 * Nenhuma biblioteca de animação (V5): CSS + `observarUmaVez` de `pc-motion`.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { PC_MOVIMENTO, observarUmaVez, usePcMovimentoReduzido } from "./pc-motion";
import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import type { PcArtefatoId } from "./pc.types";
import estilos from "./Mecanismo.module.css";

/** Os seis passos têm figura própria; o id escolhe qual desenho sai. */
export type PcPassoMecanismoId =
  | "plano"
  | "regra"
  | "cobranca"
  | "falha"
  | "comissao"
  | "nota";

export interface PcPassoMecanismo {
  id: PcPassoMecanismoId;
  rotulo: string;
  titulo: string;
  texto: string;
  /** Legenda curta sob a figura: descreve o estado que a figura mostra. */
  legendaFigura: string;
}

export interface PcMecanismoProps {
  /** Id do artefato que esta seção ilustra — só viaja para a medição. */
  artefatoId?: PcArtefatoId;
  rotulo?: string;
  titulo?: string;
  apoio?: string;
  /** Legenda do bloco inteiro, abaixo da escada de passos. */
  legenda?: string;
  passos?: readonly PcPassoMecanismo[];
  /** Chamado uma vez, quando o bloco aparece na tela. Quem chama vira evento. */
  aoTocar?: () => void;
  id?: string;
  className?: string;
}

/* ───────────────────────────────────────────────────────────────────────────
   COPY DOS SEIS PASSOS

   NOTA EDITORIAL: micro-copy criada neste bloco. O acervo das 34 peças
   aprovadas não traz um texto de mecanismo passo a passo. Cada frase foi
   escrita a partir da documentação do produto e precisa de revisão do
   comercial antes de ir ao ar (mesmo tratamento dado às micro-strings de
   cabeçalho e rodapé na pendência P11 da arquitetura).
   ─────────────────────────────────────────────────────────────────────────── */

export const PC_PASSOS_MECANISMO: readonly PcPassoMecanismo[] = [
  {
    id: "plano",
    rotulo: "O plano",
    titulo: "Você cadastra o plano com valor, serviços e comissão",
    texto:
      "O plano tem nome, valor mensal, os serviços de assinatura que entram e o percentual de comissão do profissional. Ele só fica visível para os clientes quando você liga a visibilidade — até lá, dá para montar com calma.",
    legendaFigura: "Cadastro do plano: valor, serviços incluídos e comissão.",
  },
  {
    id: "regra",
    rotulo: "A regra de uso",
    titulo: "Você define quantas vezes e em quais dias o plano vale",
    texto:
      "Para cada serviço do plano dá para limitar a quantidade de usos no período e restringir os dias da semana. Você também escolhe a regra de agendamento do assinante: livre, ou só depois que o atendimento anterior estiver finalizado.",
    legendaFigura: "Limite de usos e dias habilitados do plano.",
  },
  {
    id: "cobranca",
    rotulo: "A cobrança",
    titulo: "A adesão é autorizada e a fatura do ciclo passa a ser gerada",
    texto:
      "Com a adesão autorizada pelo assinante, a cobrança do plano é gerada a cada ciclo pelo gateway de pagamento integrado. O extrato de recebimentos mostra o valor bruto, as taxas e o valor líquido de cada fatura, com filtro por data de faturamento ou de recebimento.",
    legendaFigura: "Fatura do ciclo: de pendente para paga.",
  },
  {
    id: "falha",
    rotulo: "Quando não entra",
    titulo: "A fatura que não é paga deixa a assinatura vencida, à vista",
    texto:
      "Se a cobrança não é paga, a assinatura passa a vencida e o assinante aparece no filtro de vencidos, ordenado pelos mais antigos. A regra que você configurou decide se ele ainda consegue agendar depois do vencimento, e dá para enviar uma mensagem para todos os vencidos de uma vez.",
    legendaFigura: "Assinatura vencida, separada dos ativos.",
  },
  {
    id: "comissao",
    rotulo: "A comissão",
    titulo: "O atendimento do assinante entra na comissão do profissional",
    texto:
      "O percentual definido no plano vale para os atendimentos de assinatura. No relatório de comissões, a comissão de assinatura aparece em coluna separada da comissão de serviços normais, com o total por profissional e a divisão entre o que já foi quitado e o que está pendente.",
    legendaFigura: "Comissão de assinatura, separada da de serviços.",
  },
  {
    id: "nota",
    rotulo: "A nota fiscal",
    titulo: "Com o módulo fiscal ativo, a NFS-e sai do próprio sistema",
    texto:
      "Quando o módulo de Nota Fiscal está ativo, a NFS-e do atendimento é emitida pelo sistema, pelo provedor fiscal integrado. Os dados do emissor e os dados fiscais de cada profissional ficam no cadastro, e o histórico guarda emissão, visualização e cancelamento.",
    legendaFigura: "NFS-e do atendimento, emitida e registrada.",
  },
] as const;

/* ───────────────────────────────────────────────────────────────────────────
   AS FIGURAS

   Cada figura mostra uma TRANSIÇÃO DE ESTADO — é o que separa «animação que
   explica» de «animação que enfeita». Todas são CSS puro sobre elementos que
   já nascem no estado final; o CSS só recua o desenho quando o elemento está
   marcado `data-estado="pronto"`.

   Nenhuma figura anima `width`, `height`, `top` ou `left` (proibição de §4.2).
   ─────────────────────────────────────────────────────────────────────────── */

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"] as const;
/** Dias habilitados na regra de exemplo: terça, quinta e sábado. */
const DIAS_LIGADOS = new Set([2, 4, 6]);

function FiguraPlano(): ReactNode {
  return (
    <div className={estilos.cartaoFigura}>
      <div className={estilos.figuraTopo}>
        <span className={estilos.figuraRotulo}>Plano do clube</span>
        <span className={`${estilos.figuraValor} pc-tabular`}>R$ 129,90</span>
      </div>
      <ul className={`pc-lista ${estilos.campos}`}>
        <li className={estilos.campo}>
          <span className={estilos.campoNome}>Serviços do plano</span>
          <span className={estilos.campoTraco} />
        </li>
        <li className={estilos.campo}>
          <span className={estilos.campoNome}>Peso por serviço</span>
          <span className={estilos.campoTraco} />
        </li>
        <li className={estilos.campo}>
          <span className={estilos.campoNome}>Comissão do profissional</span>
          <span className={`${estilos.campoChip} pc-tabular`}>40%</span>
        </li>
      </ul>
    </div>
  );
}

function FiguraRegra(): ReactNode {
  return (
    <div className={estilos.cartaoFigura}>
      <div className={estilos.figuraTopo}>
        <span className={estilos.figuraRotulo}>Regra de uso</span>
        <span className={`${estilos.figuraContador} pc-tabular`}>4 usos no mês</span>
      </div>
      <div className={estilos.dias} aria-hidden="true">
        {DIAS_SEMANA.map((letra, indice) => (
          <span
            key={`${letra}-${indice}`}
            className={estilos.dia}
            data-ligado={DIAS_LIGADOS.has(indice) ? "sim" : undefined}
          >
            {letra}
          </span>
        ))}
      </div>
      <p className={estilos.figuraNota}>Terça, quinta e sábado — os dias que você habilitou.</p>
    </div>
  );
}

function FiguraCobranca(): ReactNode {
  return (
    <div className={estilos.cartaoFigura}>
      <div className={estilos.figuraTopo}>
        <span className={estilos.figuraRotulo}>Fatura do ciclo</span>
        <span className={`${estilos.figuraValor} pc-tabular`}>R$ 129,90</span>
      </div>
      <div className={estilos.pilhaChip}>
        <span className={`${estilos.chip} ${estilos.chipAlerta} ${estilos.chipSai}`}>Pendente</span>
        <span className={`${estilos.chip} ${estilos.chipOk} ${estilos.chipEntra}`}>Paga</span>
      </div>
      <p className={estilos.figuraNota}>
        O extrato traz valor bruto, taxas e valor líquido de cada recebimento.
      </p>
    </div>
  );
}

function FiguraFalha(): ReactNode {
  return (
    <div className={estilos.cartaoFigura}>
      <div className={estilos.figuraTopo}>
        <span className={estilos.figuraRotulo}>Situação da assinatura</span>
      </div>
      <div className={estilos.pilhaChip}>
        <span className={`${estilos.chip} ${estilos.chipOk} ${estilos.chipSai}`}>Ativa</span>
        <span className={`${estilos.chip} ${estilos.chipAlerta} ${estilos.chipEntra}`}>Vencida</span>
      </div>
      <ul className={`pc-lista ${estilos.filaVencidos}`} aria-hidden="true">
        <li className={estilos.linhaFila} data-destaque>
          <span className={estilos.filaNome}>Assinante C</span>
          <span className={`${estilos.filaData} pc-tabular`}>venceu há 6 dias</span>
        </li>
        <li className={estilos.linhaFila}>
          <span className={estilos.filaNome}>Assinante F</span>
          <span className={`${estilos.filaData} pc-tabular`}>venceu há 2 dias</span>
        </li>
      </ul>
      <p className={estilos.figuraNota}>Filtro de vencidos, do mais antigo para o mais novo.</p>
    </div>
  );
}

function FiguraComissao(): ReactNode {
  return (
    <div className={estilos.cartaoFigura}>
      <div className={estilos.figuraTopo}>
        <span className={estilos.figuraRotulo}>Comissão do profissional</span>
      </div>
      <ul className={`pc-lista ${estilos.barras}`}>
        <li className={estilos.barraLinha}>
          <span className={estilos.barraNome}>Serviços</span>
          <span className={estilos.barraTrilho} aria-hidden="true">
            <span className={estilos.barraPreenche} data-largura="servicos" />
          </span>
          <span className={`${estilos.barraValor} pc-tabular`}>R$ 412,00</span>
        </li>
        <li className={estilos.barraLinha} data-destaque>
          <span className={estilos.barraNome}>Assinatura</span>
          <span className={estilos.barraTrilho} aria-hidden="true">
            <span className={estilos.barraPreenche} data-largura="assinatura" />
          </span>
          <span className={`${estilos.barraValor} pc-tabular`}>R$ 207,84</span>
        </li>
      </ul>
      <p className={estilos.figuraNota}>Colunas separadas no relatório, com pago e pendente.</p>
    </div>
  );
}

function FiguraNota(): ReactNode {
  return (
    <div className={estilos.cartaoFigura}>
      <div className={estilos.figuraTopo}>
        <span className={estilos.figuraRotulo}>Documento fiscal</span>
      </div>
      <div className={estilos.docEnvolve}>
        <svg
          className={estilos.doc}
          viewBox="0 0 120 88"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* O contorno é desenhado por stroke-dashoffset — nunca por width/height. */}
          <path
            className={estilos.docContorno}
            d="M18 6h58l26 24v52a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className={estilos.docDobra}
            d="M76 6v24h26"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className={estilos.docLinha}
            d="M30 48h44M30 60h44M30 72h26"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <span className={estilos.selo}>NFS-e</span>
      </div>
      <p className={estilos.figuraNota}>Emitida sobre os serviços do atendimento finalizado.</p>
    </div>
  );
}

function Figura({ passo }: { passo: PcPassoMecanismoId }): ReactNode {
  switch (passo) {
    case "plano":
      return <FiguraPlano />;
    case "regra":
      return <FiguraRegra />;
    case "cobranca":
      return <FiguraCobranca />;
    case "falha":
      return <FiguraFalha />;
    case "comissao":
      return <FiguraComissao />;
    case "nota":
      return <FiguraNota />;
    default:
      return null;
  }
}

/* ───────────────────────────────────────────────────────────────────────────
   O BLOCO
   ─────────────────────────────────────────────────────────────────────────── */

export function PcMecanismo({
  artefatoId,
  rotulo = "O mecanismo",
  titulo = "O que acontece quando o clube entra no sistema",
  apoio = "Seis passos, do cadastro do plano à nota fiscal. Cada um mostra o estado que a tela passa a ter.",
  // Os desenhos são ilustrativos: rotular isso não é rodapé, é a diferença
  // entre demonstrar o mecanismo e simular um resultado.
  legenda = "As telas ao lado são ilustrações do mecanismo: nomes e valores são fictícios.",
  passos = PC_PASSOS_MECANISMO,
  aoTocar,
  id = "pc-mecanismo",
  className,
}: PcMecanismoProps): ReactNode {
  const refRaiz = useRef<HTMLDivElement | null>(null);
  const jaAvisou = useRef(false);
  const [replay, setReplay] = useState(0);
  const reduzido = usePcMovimentoReduzido();

  /**
   * As figuras nascem no estado final. Aqui o JS assume: recua todas para
   * `pronto` e devolve cada uma para `visivel` quando ela entra na tela.
   * `observarUmaVez` é fail-open — sem IntersectionObserver, chama na hora e
   * a figura volta ao estado final sem transição. Nunca fica escondida.
   */
  useEffect(() => {
    const raiz = refRaiz.current;
    if (!raiz) return;

    const figuras = Array.from(raiz.querySelectorAll<HTMLElement>("[data-pc-figura]"));
    if (figuras.length === 0) return;

    if (reduzido) {
      for (const figura of figuras) figura.setAttribute("data-estado", "visivel");
      return;
    }

    for (const figura of figuras) figura.setAttribute("data-estado", "pronto");

    const limpezas = figuras.map((figura) =>
      observarUmaVez(figura, () => figura.setAttribute("data-estado", "visivel")),
    );

    return () => {
      for (const limpar of limpezas) limpar();
    };
  }, [reduzido, replay, passos]);

  /** Um aviso só por carga, quando o bloco aparece. Quem chama vira evento. */
  useEffect(() => {
    if (!aoTocar || jaAvisou.current) return;
    const raiz = refRaiz.current;
    if (!raiz) return;

    return observarUmaVez(raiz, () => {
      if (jaAvisou.current) return;
      jaAvisou.current = true;
      aoTocar();
    });
  }, [aoTocar]);

  const verDeNovo = useCallback(() => setReplay((n) => n + 1), []);

  return (
    <PcSecao id={id} fundo="carvao" className={className}>
      <div ref={refRaiz} data-pc-artefato={artefatoId}>
        <PcRevelar className={estilos.cabecalho}>
          <p className="pc-rotulo">{rotulo}</p>
          <h2 className="pc-titulo pc-titulo--2">{titulo}</h2>
          {apoio ? <p className="pc-texto pc-texto--grande">{apoio}</p> : null}
          {/* A ressalva vem ANTES da primeira figura: o primeiro "R$" da escada
              aparece logo abaixo, e um aviso só no rodapé chega tarde demais. */}
          {legenda ? <p className="pc-texto pc-texto--suave">{legenda}</p> : null}
        </PcRevelar>

        <ol className={`pc-lista ${estilos.escada}`}>
          {passos.map((passo, indice) => (
            <PcRevelar
              key={passo.id}
              como="li"
              className={estilos.passo}
              atraso={(indice % 4) * PC_MOVIMENTO.stagger}
            >
              <div className={estilos.passoTexto}>
                <p className={estilos.passoRotulo}>
                  <span className={`pc-tabular ${estilos.passoNumero}`} aria-hidden="true">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <span className="pc-rotulo">{passo.rotulo}</span>
                </p>
                <h3 className="pc-titulo pc-titulo--3">{passo.titulo}</h3>
                <p className="pc-texto">{passo.texto}</p>
              </div>

              <figure className={estilos.passoFigura} data-pc-figura data-passo={passo.id}>
                <Figura passo={passo.id} />
                <figcaption className={estilos.figuraLegenda}>{passo.legendaFigura}</figcaption>
              </figure>
            </PcRevelar>
          ))}
        </ol>

        <div className={estilos.rodape}>
          {reduzido ? null : (
            <button type="button" className="pc-botao pc-botao--fantasma" onClick={verDeNovo}>
              Ver de novo
            </button>
          )}
        </div>
      </div>
    </PcSecao>
  );
}

export default PcMecanismo;
