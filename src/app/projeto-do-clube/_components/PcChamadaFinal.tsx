"use client";

/**
 * PROJETO DO CLUBE — chamada final (B8).
 *
 * É o último empurrão antes do rodapé: entra DEPOIS do FAQ, quando a pessoa já
 * leu o mecanismo, as condições e as objeções, e o único movimento que resta é
 * subir de volta ao formulário.
 *
 * ESTE COMPONENTE NÃO TEM COPY PRÓPRIA — e isso é de propósito. Todo texto chega
 * por props, para que continue sendo literal do acervo aprovado. A fiação
 * recomendada, para quem montar a página (B9):
 *
 *     titulo      = peca.titulo                 // a promessa do anúncio, de volta
 *     apoio       = PC_BLOCOS.pontes[ponteEfetiva(peca)].texto
 *     rotuloBotao = peca.botaoContato           // «Quero conversar sobre meu clube»
 *     notaPreco   = PC_BLOCOS.notaPreco         // «a partir de R$299», com o link
 *
 * O botão é uma ÂNCORA, não um `<button>`: com o JS fora do ar ele continua
 * levando ao formulário (V6). O `onClick` só existe para o evento.
 *
 * Sem contador, sem vaga inventada, sem urgência fabricada — proibições escritas
 * do cap. 21 e repetidas em §4.2.
 */

import Link from "next/link";
import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import { PC_MOVIMENTO } from "./pc-motion";
import estilos from "./pc-fundo.module.css";

export interface PcChamadaFinalProps {
  /** A promessa da peça, repetida. Texto literal do acervo. */
  titulo: string;
  /** O texto da ponte efetiva — como a conversa segue. Literal do acervo. */
  apoio: string;
  /** Rótulo do botão: `peca.botaoContato`. */
  rotuloBotao: string;
  /** Nota de preço literal («a partir de R$299…»). Opcional. */
  notaPreco?: string;
  /** Link para as condições, já com a search colada (`pc-link`). */
  hrefCondicoes?: string;
  /** Rótulo do link das condições. O padrão é o título literal do bloco. */
  rotuloCondicoes?: string;
  /** Id da seção do formulário — o destino da âncora. */
  alvoFormularioId?: string;
  aoPedirContato?: () => void;
  aoAbrirCondicoes?: () => void;
}

export function PcChamadaFinal({
  titulo,
  apoio,
  rotuloBotao,
  notaPreco,
  hrefCondicoes,
  rotuloCondicoes = "Investimento e condições",
  alvoFormularioId = "pc-formulario",
  aoPedirContato,
  aoAbrirCondicoes,
}: PcChamadaFinalProps) {
  return (
    <PcSecao id="pc-chamada-final" fundo="carvao-fundo">
      <div className={estilos.chamada}>
        <PcRevelar>
          <h2 className={estilos.chamadaTitulo}>{titulo}</h2>
        </PcRevelar>

        <PcRevelar atraso={PC_MOVIMENTO.stagger}>
          <p className={estilos.chamadaApoio}>{apoio}</p>
        </PcRevelar>

        <PcRevelar atraso={PC_MOVIMENTO.stagger * 2}>
          <a href={`#${alvoFormularioId}`} className={estilos.chamadaBotao} onClick={aoPedirContato}>
            {rotuloBotao}
          </a>
        </PcRevelar>

        {notaPreco || hrefCondicoes ? (
          <PcRevelar atraso={PC_MOVIMENTO.stagger * 3}>
            <p className={estilos.chamadaNota}>
              {notaPreco ? <span>{notaPreco} </span> : null}
              {hrefCondicoes ? (
                <Link href={hrefCondicoes} className={estilos.chamadaLink} onClick={aoAbrirCondicoes}>
                  {rotuloCondicoes}
                </Link>
              ) : null}
            </p>
          </PcRevelar>
        ) : null}
      </div>
    </PcSecao>
  );
}
