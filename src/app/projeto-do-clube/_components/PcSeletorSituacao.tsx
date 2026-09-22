"use client";

/**
 * PcSeletorSituacao — as quatro situações do cap. 13 (bloco B4).
 *
 * V2 DO CONTRATO: ESTE SELETOR NÃO NAVEGA. Nenhum `router.push`, nenhuma troca de
 * URL. `publico` é o único parâmetro que o snapshot de UTM não restaura
 * (`useUtmParams.ts:268`): navegar aqui apagaria a célula do lead no A/B. Ele só
 * avisa o orquestrador (B9), que troca a copy e pré-preenche `clubStatus`.
 *
 * Cap. 13: «A escolha não recarrega toda a jornada nem apaga o que já foi preenchido.»
 *
 * Rótulos literais: vêm de `PC_SELETOR` (B3) e não são reescritos aqui.
 */

import { useRef, type KeyboardEvent } from "react";
import { PC_SELETOR } from "./pc-copy";
import type { PcOpcaoSeletor, PcSituacao } from "./pc.types";
import estilos from "./pc-topo.module.css";

const PC_ROTULO_SELETOR = "Como está seu clube hoje?";

/** Amarra o contrato de tipo do B3 aqui: o seletor nunca inventa opção. */
const OPCOES: readonly PcOpcaoSeletor[] = PC_SELETOR;

interface PcSeletorSituacaoProps {
  situacaoAtiva: PcSituacao;
  aoEscolher: (situacao: PcSituacao) => void;
  className?: string;
}

export function PcSeletorSituacao({ situacaoAtiva, aoEscolher, className }: PcSeletorSituacaoProps) {
  const grupo = useRef<HTMLDivElement>(null);

  /** Setas andam entre as opções, como manda o padrão de `radiogroup`. */
  function aoTeclar(evento: KeyboardEvent<HTMLDivElement>) {
    const teclas = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!teclas.includes(evento.key)) return;
    evento.preventDefault();

    const indiceAtual = OPCOES.findIndex((opcao) => opcao.valor === situacaoAtiva);
    const passo = evento.key === "ArrowRight" || evento.key === "ArrowDown" ? 1 : -1;
    const base = indiceAtual < 0 ? 0 : indiceAtual;
    const proximo = (base + passo + OPCOES.length) % OPCOES.length;

    aoEscolher(OPCOES[proximo].valor);
    grupo.current?.querySelectorAll<HTMLButtonElement>("[role='radio']")[proximo]?.focus();
  }

  return (
    <div className={[estilos.seletor, className].filter(Boolean).join(" ")}>
      <p className="pc-rotulo" id="pc-seletor-rotulo">
        {PC_ROTULO_SELETOR}
      </p>
      <div
        ref={grupo}
        role="radiogroup"
        aria-labelledby="pc-seletor-rotulo"
        className={estilos.seletorOpcoes}
        onKeyDown={aoTeclar}
      >
        {OPCOES.map((opcao) => {
          const ativa = opcao.valor === situacaoAtiva;
          return (
            <button
              key={opcao.valor}
              type="button"
              role="radio"
              aria-checked={ativa}
              tabIndex={ativa ? 0 : -1}
              className={`pc-botao ${ativa ? "pc-botao--ouro" : "pc-botao--fantasma"} ${estilos.seletorOpcao}`}
              onClick={() => aoEscolher(opcao.valor)}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
