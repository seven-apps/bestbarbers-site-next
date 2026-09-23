"use client";

/**
 * Executa a micro-história da tela (contrato em `telas.tsx`) UMA vez, quando a prova entra
 * ≥50% na tela — e dispara `clube_prova_vista` no mesmo instante.
 *
 * Sem biblioteca: WAAPI com `transform` e `opacity` (roda na composição). O HTML do servidor é o
 * estado FINAL; ao hidratar, as animações são criadas PAUSADAS no quadro 0 (a prova ainda está
 * abaixo da dobra, ninguém vê a troca) e só tocam ao entrar na tela. Com
 * `prefers-reduced-motion` nada é criado: a tela fica no estado final e o evento ainda sai.
 */
import { useEffect, useRef, type ReactNode } from "react";

const ATRASO_BASE = 250;
const PASSO = 260;

type Quadros = Keyframe[];

function quadrosDe(el: HTMLElement): Array<[HTMLElement, Quadros, number]> {
  const tipo = el.dataset.anim;
  const dur = 420;
  switch (tipo) {
    case "entra":
      return [[el, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], dur]];
    case "apaga":
      return [[el, [{ opacity: 1 }, { opacity: 0.35 }], dur]];
    case "pulso":
      return [[el, [{ transform: "scale(0.6)", opacity: 0.4 }, { transform: "scale(1.25)", opacity: 1 }, { transform: "scale(1)" }], 700]];
    case "liga": {
      const bola = el.querySelector("i") as HTMLElement | null;
      const r: Array<[HTMLElement, Quadros, number]> = [[el, [{ backgroundColor: "#3a3d44" }, { backgroundColor: getComputedStyle(el).backgroundColor }], 300]];
      if (bola) r.push([bola, [{ transform: "translateX(-16px)" }, { transform: "none" }], 300]);
      return r;
    }
    case "troca": {
      const antes = el.querySelector("[data-antes]") as HTMLElement | null;
      const depois = el.querySelector("[data-depois]") as HTMLElement | null;
      const r: Array<[HTMLElement, Quadros, number]> = [];
      if (antes) r.push([antes, [{ opacity: 1 }, { opacity: 0 }], 260]);
      if (depois) r.push([depois, [{ opacity: 0, transform: "scale(0.85)" }, { opacity: 1, transform: "none" }], 320]);
      return r;
    }
    default:
      return [];
  }
}

export function TelaAnimada({ children, aoVer }: { children: ReactNode; aoVer?: () => void }) {
  const raiz = useRef<HTMLDivElement>(null);
  const aoVerRef = useRef(aoVer);
  aoVerRef.current = aoVer;

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animacoes: Animation[] = [];

    if (!reduzido && typeof el.animate === "function") {
      el.querySelectorAll<HTMLElement>("[data-anim]").forEach((alvo) => {
        const ordem = Number(alvo.dataset.ordem ?? 0);
        for (const [quem, quadros, duracao] of quadrosDe(alvo)) {
          const a = quem.animate(quadros, {
            duration: duracao,
            delay: ATRASO_BASE + ordem * PASSO,
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "both",
          });
          a.pause();
          a.currentTime = 0;
          animacoes.push(a);
        }
      });
    }

    const io = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((x) => x.isIntersecting)) return;
        io.disconnect();
        animacoes.forEach((a) => a.play());
        aoVerRef.current?.();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      animacoes.forEach((a) => a.finish());
    };
  }, []);

  return <div ref={raiz}>{children}</div>;
}
