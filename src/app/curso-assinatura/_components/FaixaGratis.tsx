"use client";

import { ArrowRight, Gift } from "lucide-react";
import { TEXTOS_VITRINE } from "@/content/curso-assinatura";

const T = TEXTOS_VITRINE.faixa;

/** O verde da faixa e do "grátis" da vitrine: o mesmo da faixa do cupom dos parceiros (`CupomBar`). */
export const VERDE_GRATIS = { forte: "#06c81e", escuro: "#028a10", claro: "#2fe04a" } as const;

/**
 * Faixa verde do curso grátis (17/Out/26), colada embaixo do menu e fixa com ele: o "grátis" fica na tela o
 * tempo todo. Pedido do André: "deixar muito escancarado que é de graça", com a tag verde da página dos
 * parceiros (mesmo verde, mesmo brilho e mesmo pulso da `CupomBar`). O clique leva ao formulário.
 * No celular a 2ª linha encurta e o botão vira só a seta, para nada passar por baixo dele em 360px.
 */
export function FaixaGratis({ onCta }: { onCta: () => void }) {
  return (
    <button
      type="button"
      onClick={onCta}
      aria-label={`${T.titulo}: ${T.frase}`}
      className="faixa-gratis relative block w-full overflow-hidden text-white"
      style={{ background: "linear-gradient(90deg, #02a114, #06c81e 50%, #02a114)", fontFamily: "var(--font-montserrat)" }}
    >
      <span className="faixa-brilho" aria-hidden="true" />
      {/* O espaçamento vertical fica num span por fora: o .container-custom do site zera o padding vertical. */}
      <span className="relative block py-2.5 md:py-3">
        <span className="container-custom relative flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2.5 md:gap-3">
            <Gift className="h-6 w-6 md:h-7 md:w-7 flex-none" strokeWidth={2.4} />
            <span className="flex min-w-0 flex-col text-left leading-tight md:flex-row md:items-baseline md:gap-3">
              <span className="text-[16px] md:text-[19px] font-extrabold tracking-wide whitespace-nowrap">{T.titulo}</span>
              <span className="text-[12.5px] md:text-[15px] font-semibold opacity-95">
                <span className="md:hidden">{T.fraseCelular}</span>
                <span className="hidden md:inline">{T.frase}</span>
              </span>
            </span>
          </span>
          {/* Celular: só a seta num círculo, para o título inteiro caber (medido em 360px: com "GARANTIR" no botão sobravam 126px para um título de 200px). */}
          <span
            className="faixa-botao flex flex-none items-center justify-center gap-1.5 rounded-full bg-white h-9 w-9 md:h-auto md:w-auto md:px-5 md:py-2 text-[14px] font-extrabold uppercase"
            style={{ color: VERDE_GRATIS.escuro }}
          >
            <span className="hidden md:inline">{T.botao}</span>
            <ArrowRight className="h-5 w-5 md:h-4 md:w-4" strokeWidth={2.6} />
          </span>
        </span>
      </span>
      <style jsx>{`
        .faixa-brilho {
          position: absolute;
          inset: 0 auto 0 -40%;
          width: 35%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transform: skewX(-20deg);
          animation: faixa-brilho 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes faixa-brilho {
          0% { left: -40%; }
          55%, 100% { left: 130%; }
        }
        @keyframes faixa-pulso {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 7px rgba(255, 255, 255, 0); }
        }
        .faixa-botao { animation: faixa-pulso 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .faixa-brilho, .faixa-botao { animation: none; }
        }
      `}</style>
    </button>
  );
}

/** Selo verde "100% GRATUITO" (em cima do título do formulário). */
export function SeloGratis({ children }: { children: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 self-center rounded-full px-3.5 py-1.5 text-[12px] md:text-[13px] font-extrabold uppercase tracking-wide text-white shadow-[0_4px_14px_rgba(6,200,30,0.35)]"
      style={{ background: `linear-gradient(90deg, #02a114, ${VERDE_GRATIS.forte})` }}
    >
      <Gift className="h-4 w-4" strokeWidth={2.6} />
      {children}
    </span>
  );
}
