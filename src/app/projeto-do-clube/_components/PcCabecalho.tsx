"use client";

/**
 * PcCabecalho — cabeçalho enxuto da família (bloco B4).
 *
 * Cap. 13: «marca, acesso a condições e botão para o formulário. Evitar um menu que
 * obrigue o visitante a procurar a oferta em outras páginas.» Sem menu, sem dropdown
 * e sem animação de entrada (§2.2).
 *
 * `data-pc-cabecalho` é lido por `rolarAte` (PcAncoras) para descontar a altura fixa
 * na rolagem — sem isso, o título do destino para embaixo deste bloco.
 *
 * Micro-strings criadas aqui por ausência de copy aprovada (§8, P11): «Condições» e
 * «Pedir contato».
 */

import Image from "next/image";
import { rolarAte } from "./PcAncoras";
import { usePcMovimentoReduzido } from "./pc-motion";
import estilos from "./pc-topo.module.css";

const PC_ROTULO_CONDICOES = "Condições";
const PC_ROTULO_CONTATO = "Pedir contato";

interface PcCabecalhoProps {
  aoPedirContato: () => void;
  hrefCondicoes: string;
  /** Gancho de medição opcional (`condicoes_abertas`), ligado por B9. */
  aoAbrirCondicoes?: () => void;
}

export function PcCabecalho({ aoPedirContato, hrefCondicoes, aoAbrirCondicoes }: PcCabecalhoProps) {
  const movimentoReduzido = usePcMovimentoReduzido();

  return (
    <header className={estilos.cabecalho} data-pc-cabecalho>
      <a
        className={estilos.marca}
        href="#pc-inicio"
        aria-label="BestBarbers — início da página"
        onClick={(evento) => {
          if (evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
          evento.preventDefault();
          rolarAte("pc-inicio", !movimentoReduzido);
        }}
      >
        {/* O único `priority` da rota é o artefato do herói (§4.3): a marca carrega
            `eager`, sem disputar a fila com ele. */}
        <Image
          src="/images/Logo-BestBarbers-branco_1.webp"
          alt="BestBarbers"
          width={132}
          height={30}
          loading="eager"
        />
      </a>

      <div className={estilos.cabecalhoAcoes}>
        <a
          className={`pc-botao pc-botao--link ${estilos.condicoesCabecalho}`}
          href={hrefCondicoes}
          onClick={() => aoAbrirCondicoes?.()}
        >
          {PC_ROTULO_CONDICOES}
        </a>
        <button
          type="button"
          className={`pc-botao pc-botao--acao ${estilos.botaoCompacto}`}
          onClick={aoPedirContato}
        >
          {PC_ROTULO_CONTATO}
        </button>
      </div>
    </header>
  );
}
