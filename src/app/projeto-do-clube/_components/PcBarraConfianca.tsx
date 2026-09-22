"use client";

/**
 * PcBarraConfianca — a prova de credibilidade do topo (bloco B4).
 *
 * REGRA EDITORIAL (cap. 13 «Prova» + doutrina): zero nome de cliente, de parceiro ou
 * de concorrente; zero antes/depois; zero depoimento; zero promessa de prazo. Só os
 * quatro números OFICIAIS de divulgação da BestBarbers, que já estão no ar no site
 * (`src/app/layout.tsx`, `/do-zero-a-assinatura`) — nenhum número novo nasce aqui.
 *
 * Os quatro entram como fatos SEPARADOS. Nunca «51.000 assinantes EM 1.200
 * barbearias»: isso afirmaria que toda barbearia da plataforma tem clube, o que é
 * falso. A nota abaixo da barra existe exatamente para fechar essa porta.
 *
 * Movimento: M1 (entrada por `PcRevelar`, porque a barra fica logo abaixo da dobra)
 * + M2 (o número conta via `PcNumero`, que imprime o valor final no SSR e não conta
 * nada sob `prefers-reduced-motion`).
 */

import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import { PcNumero } from "./PcNumero";
import { PC_MOVIMENTO } from "./pc-motion";
import estilos from "./pc-topo.module.css";

interface PcItemConfianca {
  valor: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
}

/** Números oficiais de divulgação da marca — não recalcular por página. */
const PC_CONFIANCA: PcItemConfianca[] = [
  { valor: 1200, sufixo: "+", rotulo: "barbearias rodando na BestBarbers" },
  { valor: 51000, sufixo: "+", rotulo: "assinantes de clube na plataforma" },
  { valor: 5, prefixo: "R$ ", sufixo: " mi+", rotulo: "processados por mês" },
  { valor: 6, sufixo: " mi+", rotulo: "agendamentos por mês" },
];

const PC_NOTA_CONFIANCA =
  "Números oficiais de divulgação da BestBarbers, atualizados periodicamente. " +
  "Cada um é um fato próprio: nem toda barbearia da plataforma tem clube de assinatura.";

interface PcBarraConfiancaProps {
  id?: string;
  className?: string;
}

export function PcBarraConfianca({ id = "pc-confianca", className }: PcBarraConfiancaProps) {
  return (
    <PcSecao
      id={id}
      fundo="carvao-fundo"
      className={[estilos.barra, className].filter(Boolean).join(" ")}
    >
      <ul className={`pc-lista ${estilos.barraGrade}`}>
        {PC_CONFIANCA.map((item, indice) => (
          <PcRevelar
            key={item.rotulo}
            como="li"
            atraso={indice * PC_MOVIMENTO.stagger}
            className={estilos.barraItem}
          >
            <span className={estilos.barraValor}>
              <PcNumero valor={item.valor} prefixo={item.prefixo} sufixo={item.sufixo} />
            </span>
            <span className={estilos.barraRotulo}>{item.rotulo}</span>
          </PcRevelar>
        ))}
      </ul>
      <p className={`pc-texto pc-texto--suave ${estilos.barraNota}`}>{PC_NOTA_CONFIANCA}</p>
    </PcSecao>
  );
}
