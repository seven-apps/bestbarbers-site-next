"use client";

/**
 * PcHeroi — o bloco de abertura das quatro entradas (bloco B4).
 *
 * CONTRATO (00-ARQUITETURA.md §2.2, §2.4, §4):
 *  - Está ACIMA DA DOBRA: nasce pintado e NUNCA usa `PcRevelar` (V6). O HTML do
 *    servidor já traz o texto final; a entrada orquestrada (WAAPI, via
 *    `animarSequencia`) apenas reencena o que já está legível. JS que falha tira o
 *    movimento, nunca o conteúdo.
 *  - Nenhuma biblioteca de animação (V5): `transform` + `opacity`, e só.
 *  - Com `prefers-reduced-motion`, `animarSequencia` pinta o estado final e não
 *    monta animação nenhuma (§4.4).
 *  - Um único loop ambiental na dobra (M6), no artefato central: `pc-flutua`.
 *
 * COPY (cap. 13 «Abertura» + as 34 peças aprovadas) — texto LITERAL, nada reescrito:
 *  - Título, apoio e botão principal vêm da PEÇA do anúncio (message-match) e caem
 *    para a abertura da situação quando a peça não traz o campo.
 *  - Os 34 `botaoPrincipal` aprovados são todos de VER/CONHECER (medido no acervo:
 *    nenhum é pedido de contato). Por isso o botão principal leva à DEMONSTRAÇÃO, e
 *    o pedido de contato fica ao lado, com o texto aprovado da situação — cap. 13:
 *    «demonstração aberta da tarefa prometida; pedido de contato separado. Não levar
 *    o clique apenas a um formulário».
 *  - Nota de preço literal («A partir de R$299.» + nota de escopo) com link para
 *    `/projeto-do-clube/condicoes`. Valor fechado nunca aparece.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import { PcSecao } from "./PcSecao";
import { PcArtefato } from "./PcArtefato";
import { PcAncoras, PC_ANCORAS_PADRAO, type PcAncoraItem } from "./PcAncoras";
import { PcBarraConfianca } from "./PcBarraConfianca";
import { PC_MOVIMENTO, animarSequencia, cancelarAnimacoes, usePcMovimentoReduzido } from "./pc-motion";
import type { PcAbertura, PcArtefatoId, PcPeca, PcSituacao } from "./pc.types";
import estilos from "./pc-topo.module.css";

/**
 * Artefato do herói por situação. Todos ainda são PLACEHOLDER no registro
 * (`pc-artefatos.ts`, §6.2): trocar pela imagem real é `status: "real"`, uma linha.
 */
const PC_ARTEFATO_DO_HEROI: Record<PcSituacao, PcArtefatoId> = {
  // TODO(asset): clube-cobranca — tela do clube com a cobrança de um assinante (marca fictícia).
  geral: "clube-cobranca",
  // TODO(asset): clube-cobranca — tela do clube com a cobrança de um assinante (marca fictícia).
  manual: "clube-cobranca",
  // TODO(asset): clube-plano-regra — cadastro do plano com serviços e dias de uso.
  migracao: "clube-plano-regra",
  // TODO(asset): clube-plano-regra — cadastro do plano com serviços e dias de uso.
  abertura: "clube-plano-regra",
};

/**
 * Os três estados do mecanismo, destacados da frase aprovada da demonstração
 * (cap. 13): «Conheça a regra de uso, a adesão autorizada ao plano e a conferência
 * da cobrança. Demonstração com dados fictícios.» Nenhuma função nova é prometida.
 */
const PC_PASSOS_MECANISMO = [
  "Regra de uso",
  "Adesão autorizada ao plano",
  "Conferência da cobrança",
] as const;

const PC_LEGENDA_MECANISMO = "Demonstração com dados fictícios.";
const PC_ROTULO_MOLDURA = "O clube na BestBarbers";
const PC_ROTULO_CONDICOES = "Ver condições";

/**
 * Normalização tipográfica do rótulo de botão: a biblioteca escreve a frase com
 * ponto final («Montar meu projeto com o time.»), que é pontuação do documento, não
 * do botão. Só o ponto final cai — nenhuma palavra muda.
 */
function rotuloDeBotao(texto: string): string {
  return texto.trim().replace(/\.$/, "");
}

interface PcHeroiProps {
  abertura: PcAbertura;
  peca: PcPeca;
  /** Literal de `PC_BLOCOS.notaPreco` (B3). Já contém «A partir de R$299.» */
  notaPreco: string;
  hrefCondicoes: string;
  aoPedirContato: () => void;
  aoVerDemonstracao: () => void;
  /** Situação da rota — escolhe o artefato do herói. Cai para a da peça. */
  situacao?: PcSituacao;
  /** A barra de confiança fecha o herói; B9 desliga sem editar este arquivo. */
  /**
   * Artefato do herói escolhido pela PÁGINA, não pela situação. As páginas por anúncio
   * de `/clube/[peca]` mostram a tela que prova a promessa daquele anúncio; sem isto,
   * vale o mapa por situação abaixo.
   */
  artefato?: PcArtefatoId;
  mostrarBarraConfianca?: boolean;
  /** Gancho de medição opcional (`condicoes_abertas`), ligado por B9. */
  aoAbrirCondicoes?: () => void;
}

export function PcHeroi({
  abertura,
  peca,
  notaPreco,
  hrefCondicoes,
  aoPedirContato,
  aoVerDemonstracao,
  situacao,
  artefato,
  mostrarBarraConfianca = true,
  aoAbrirCondicoes,
}: PcHeroiProps) {
  const raiz = useRef<HTMLDivElement>(null);
  const movimentoReduzido = usePcMovimentoReduzido();

  const situacaoEfetiva: PcSituacao = situacao ?? peca.situacao ?? "geral";
  const artefatoId =
    artefato ?? PC_ARTEFATO_DO_HEROI[situacaoEfetiva] ?? PC_ARTEFATO_DO_HEROI.geral;

  const titulo = peca.titulo?.trim() || abertura.titulo;
  const apoio = peca.apoio?.trim() || abertura.apoio;
  const rotuloDemonstracao = rotuloDeBotao(peca.botaoPrincipal || abertura.linkSecundario || "");
  const rotuloContato = rotuloDeBotao(abertura.botao || "");
  const linkSecundario = abertura.linkSecundario?.trim();

  const ancoras: readonly PcAncoraItem[] = linkSecundario
    ? [{ rotulo: rotuloDeBotao(linkSecundario), alvoId: "pc-como-funciona" }]
    : PC_ANCORAS_PADRAO;

  /**
   * Entrada orquestrada: cada `[data-pc-entrada]` sobe e ganha opacidade, em cascata
   * de 90ms. O atraso satura no 4º item (§4.1: no máximo quatro encadeados), então a
   * abertura inteira fecha em ~730ms mesmo com o artefato no fim da fila.
   * `animarSequencia` já cuida do `prefers-reduced-motion` e do `will-change`.
   */
  useEffect(() => {
    const no = raiz.current;
    if (!no) return;

    const alvos = Array.from(no.querySelectorAll<HTMLElement>("[data-pc-entrada]"));
    if (alvos.length === 0) return;

    const animacoes = alvos.flatMap((alvo, indice) =>
      animarSequencia(
        [
          {
            alvo,
            keyframes: [
              { opacity: 0, transform: `translateY(${PC_MOVIMENTO.deslocamento}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            opcoes: {
              duration: PC_MOVIMENTO.dur3,
              delay: Math.min(indice, 4) * PC_MOVIMENTO.stagger,
              easing: PC_MOVIMENTO.easeSaida,
            },
          },
        ],
        { reduzido: movimentoReduzido },
      ),
    );

    return () => cancelarAnimacoes(animacoes);
  }, [movimentoReduzido]);

  return (
    <>
      <PcSecao id="pc-inicio" fundo="carvao" className={estilos.heroi}>
        {/* A raiz da animação envolve as DUAS colunas: o artefato é o último item
            da mesma cascata, e a query de `[data-pc-entrada]` precisa alcançá-lo. */}
        <div ref={raiz} className={estilos.heroiGrade}>
          <div className={estilos.heroiTexto}>
            {abertura.identificacao ? (
              <p className={estilos.identificacao} data-pc-entrada>
                <span aria-hidden="true" className={estilos.identificacaoPonto} />
                {abertura.identificacao}
              </p>
            ) : null}

            <h1 className="pc-titulo pc-titulo--1" data-pc-entrada>
              {titulo}
            </h1>

            <p className="pc-subtitulo" data-pc-entrada>
              {apoio}
            </p>

            <div data-pc-entrada>
              <div className={estilos.acoes}>
                <button
                  type="button"
                  className="pc-botao pc-botao--acao pc-botao--g"
                  onClick={aoVerDemonstracao}
                >
                  {rotuloDemonstracao}
                </button>
                <button
                  type="button"
                  className="pc-botao pc-botao--ouro pc-botao--g"
                  onClick={aoPedirContato}
                >
                  {rotuloContato}
                </button>
              </div>

              <p className={`pc-texto pc-texto--suave ${estilos.notaPreco}`}>
                {notaPreco}{" "}
                <a
                  className="pc-botao pc-botao--link"
                  href={hrefCondicoes}
                  onClick={() => aoAbrirCondicoes?.()}
                >
                  {PC_ROTULO_CONDICOES}
                </a>
              </p>

              <PcAncoras itens={ancoras} className={estilos.ancorasNoHeroi} />
            </div>
          </div>

          {/* O artefato fica FORA do bloco de texto por layout (2ª coluna da grade),
              mas dentro da mesma raiz de animação — é o 5º e último da cascata. */}
          <div className={estilos.heroiArtefato} data-pc-entrada>
            {/* M6: único loop ambiental da dobra. O wrapper separa o loop CSS da
                animação WAAPI — dois donos do mesmo `transform` brigariam. */}
            <div className="pc-flutua">
              <figure className={estilos.moldura}>
                <figcaption className={estilos.molduraTopo}>
                  <span aria-hidden="true" className={estilos.molduraPonto} />
                  {PC_ROTULO_MOLDURA}
                </figcaption>
                <div className={estilos.molduraCorpo}>
                  <PcArtefato id={artefatoId} prioridade />
                  <ol className={`pc-lista ${estilos.mecanismo}`}>
                    {PC_PASSOS_MECANISMO.map((passo, indice) => (
                      <li
                        key={passo}
                        className={`pc-entra ${estilos.passo}`}
                        style={{ "--pc-atraso": `${700 + indice * PC_MOVIMENTO.stagger}ms` } as CSSProperties}
                      >
                        <span aria-hidden="true" className={estilos.passoIndice}>
                          {indice + 1}
                        </span>
                        {passo}
                        {indice < PC_PASSOS_MECANISMO.length - 1 ? (
                          <span aria-hidden="true" className={estilos.passoSeta}>
                            &#8595;
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              </figure>
            </div>
            <p className={estilos.legenda}>{PC_LEGENDA_MECANISMO}</p>
          </div>
        </div>
      </PcSecao>

      {mostrarBarraConfianca ? <PcBarraConfianca /> : null}
    </>
  );
}
