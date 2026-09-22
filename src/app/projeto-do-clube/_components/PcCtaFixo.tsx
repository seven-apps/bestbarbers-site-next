"use client";

/**
 * PcCtaFixo — botão persistente do celular (bloco B4).
 *
 * §4.1: entra depois do herói e SOME quando o formulário entra na viewport —
 * por `IntersectionObserver`, nunca por handler de scroll.
 * Cap. 13: «no celular, botão persistente pode levar ao formulário sem cobrir
 * conteúdo, teclado ou controles». Por isso ele respeita `safe-area-inset-bottom`,
 * some no desktop (media query) e desaparece com o formulário na tela.
 *
 * Sem JS ele nunca aparece — e não precisa: os botões reais estão no herói e na
 * página inteira (V6 vale para conteúdo, não para conveniência).
 */

import { useEffect, useState } from "react";
import { rolarAte } from "./PcAncoras";
import { usePcMovimentoReduzido } from "./pc-motion";
import estilos from "./pc-topo.module.css";

interface PcCtaFixoProps {
  rotulo: string;
  /** `id` do formulário — o destino e, ao mesmo tempo, o gatilho de sumiço. */
  alvoId: string;
  aoClicar: () => void;
  /** Enquanto este bloco estiver na tela, o CTA fica escondido. Padrão: o herói. */
  gatilhoId?: string;
}

export function PcCtaFixo({ rotulo, alvoId, aoClicar, gatilhoId = "pc-inicio" }: PcCtaFixoProps) {
  const [visivel, setVisivel] = useState(false);
  const movimentoReduzido = usePcMovimentoReduzido();

  useEffect(() => {
    const formulario = document.getElementById(alvoId);
    const gatilho = document.getElementById(gatilhoId);

    let formularioNaTela = false;
    let gatilhoNaTela = Boolean(gatilho);

    const recalcular = () => setVisivel(!formularioNaTela && !gatilhoNaTela);

    const observadores: IntersectionObserver[] = [];

    if (formulario) {
      const observador = new IntersectionObserver(
        ([entrada]) => {
          formularioNaTela = entrada.isIntersecting;
          recalcular();
        },
        { threshold: 0 },
      );
      observador.observe(formulario);
      observadores.push(observador);
    }

    if (gatilho) {
      const observador = new IntersectionObserver(
        ([entrada]) => {
          gatilhoNaTela = entrada.isIntersecting;
          recalcular();
        },
        { threshold: 0 },
      );
      observador.observe(gatilho);
      observadores.push(observador);
    }

    recalcular();
    return () => observadores.forEach((observador) => observador.disconnect());
  }, [alvoId, gatilhoId]);

  return (
    <div
      className={`${estilos.ctaFixo} ${visivel ? "" : estilos.ctaFixoOculto}`}
      aria-hidden={!visivel}
    >
      <button
        type="button"
        className={`pc-botao pc-botao--acao pc-botao--g ${estilos.ctaFixoBotao}`}
        tabIndex={visivel ? 0 : -1}
        onClick={() => {
          aoClicar();
          rolarAte(alvoId, !movimentoReduzido);
        }}
      >
        {rotulo}
      </button>
    </div>
  );
}
