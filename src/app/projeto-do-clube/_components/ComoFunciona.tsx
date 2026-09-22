"use client";

/**
 * PROJETO DO CLUBE — «Como funciona», a versão curta.
 *
 * Papel na página: quem não rola até o fim precisa sair sabendo o mecanismo.
 * Três passos, nenhum número inventado, nenhuma promessa de prazo.
 *
 * Contrato de movimento: M1 (entrada de seção, stagger de no máximo 4 itens).
 * O conteúdo NASCE VISÍVEL — `PcRevelar` só esconde depois que o JS assume (V6).
 *
 * Compatibilidade de props: aceita `passos: string[]` (assinatura de §2.4 da
 * arquitetura) e também a forma rica `PcPassoCurto[]`, com título próprio.
 */

import type { ReactNode } from "react";
import { PC_MOVIMENTO } from "./pc-motion";
import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import estilos from "./ComoFunciona.module.css";

/** Um passo da versão curta. `titulo` é opcional: sem ele, sai só o texto. */
export interface PcPassoCurto {
  titulo?: string;
  texto: string;
}

export interface PcComoFuncionaProps {
  /** `string[]` (contrato) ou `PcPassoCurto[]`. Sem valor, usa PC_PASSOS_CURTOS. */
  passos?: readonly string[] | readonly PcPassoCurto[];
  rotulo?: string;
  titulo?: string;
  apoio?: string;
  /** Âncora para o mecanismo completo. `null` tira o link. */
  hrefDetalhe?: string | null;
  rotuloDetalhe?: string;
  /** Medição: quem chamar decide se isso vira evento. */
  aoVerDetalhe?: () => void;
  id?: string;
  className?: string;
}

/**
 * Os três passos, escritos só com o que o sistema faz de verdade:
 * cadastro de plano (nome, valor, serviços, comissão, regra de uso),
 * assinatura com cobrança recorrente pelo gateway, e o atendimento do
 * assinante entrando no relatório de comissões.
 *
 * NOTA EDITORIAL: micro-copy criada aqui — o acervo aprovado não tem um
 * «como funciona» do MECANISMO (o literal do cap. 13 descreve o processo
 * COMERCIAL). Revisão do comercial pendente; ver «pendências» do bloco.
 */
export const PC_PASSOS_CURTOS: readonly PcPassoCurto[] = [
  {
    titulo: "Você desenha o plano",
    texto:
      "Nome, valor, quais serviços entram, quantas vezes cada um pode ser usado, em quais dias vale e qual é a comissão do profissional.",
  },
  {
    titulo: "O assinante adere e a cobrança roda",
    texto:
      "A adesão é autorizada pelo assinante e a fatura do plano passa a ser gerada a cada ciclo pelo gateway de pagamento, com o extrato dos recebimentos no painel.",
  },
  {
    titulo: "O atendimento vira comissão",
    texto:
      "O atendimento do assinante entra no relatório de comissões separado dos atendimentos normais, com o que já foi quitado e o que está pendente por profissional.",
  },
] as const;

function normalizar(
  passos: readonly string[] | readonly PcPassoCurto[] | undefined,
): readonly PcPassoCurto[] {
  if (!passos || passos.length === 0) return PC_PASSOS_CURTOS;
  return passos.map((passo) => (typeof passo === "string" ? { texto: passo } : passo));
}

/** Dois dígitos, para a coluna de número não dançar entre 1 e 10. */
function ordinal(indice: number): string {
  return String(indice + 1).padStart(2, "0");
}

export function PcComoFunciona({
  passos,
  rotulo = "Como funciona",
  titulo = "O clube da sua barbearia, em três passos",
  apoio,
  hrefDetalhe = "#pc-mecanismo",
  rotuloDetalhe = "Ver o mecanismo passo a passo",
  aoVerDetalhe,
  id = "pc-como-funciona",
  className,
}: PcComoFuncionaProps): ReactNode {
  const lista = normalizar(passos);

  return (
    <PcSecao id={id} fundo="carvao-fundo" className={className}>
      <PcRevelar className={estilos.cabecalho}>
        <p className="pc-rotulo">{rotulo}</p>
        <h2 className="pc-titulo pc-titulo--2">{titulo}</h2>
        {apoio ? <p className="pc-texto pc-texto--grande">{apoio}</p> : null}
      </PcRevelar>

      <ol className={`pc-lista ${estilos.passos}`}>
        {lista.map((passo, indice) => (
          <PcRevelar
            key={passo.titulo ?? passo.texto}
            como="li"
            className={`pc-cartao pc-cartao--carvao ${estilos.passo}`}
            atraso={(indice % 4) * PC_MOVIMENTO.stagger}
          >
            <span className={`pc-tabular ${estilos.ordinal}`} aria-hidden="true">
              {ordinal(indice)}
            </span>
            {passo.titulo ? (
              <h3 className={`pc-titulo pc-titulo--3 ${estilos.passoTitulo}`}>{passo.titulo}</h3>
            ) : null}
            <p className="pc-texto">{passo.texto}</p>
          </PcRevelar>
        ))}
      </ol>

      {hrefDetalhe ? (
        <PcRevelar className={estilos.rodape} atraso={3 * PC_MOVIMENTO.stagger}>
          <a
            href={hrefDetalhe}
            className="pc-botao pc-botao--link"
            onClick={() => aoVerDetalhe?.()}
          >
            {rotuloDetalhe}
          </a>
        </PcRevelar>
      ) : null}
    </PcSecao>
  );
}

export default PcComoFunciona;
