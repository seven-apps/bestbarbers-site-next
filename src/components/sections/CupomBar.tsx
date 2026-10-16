"use client";

import { Ticket, ArrowRight } from "lucide-react";
import { CUPOM_VALIDO_ATE_TEXTO, CUPOM_VALOR, type CupomParceiro } from "@/lib/cupom-parceiro";

/**
 * Faixa verde do cupom do parceiro (out/26), colada embaixo do menu e fixa com ele: o cupom fica na tela o tempo todo.
 * Pedido do André (15/Out/26): "o verde dá a sensação de que está ganhando". Um brilho corre pelo verde e o botão
 * pulsa; o clique leva ao formulário. Vai na prop `faixa` do Navbar.
 * No celular (< 640px) a 1ª linha é só o código: "SELETTO200 ATIVADO" já encostava no botão em 390px, e o
 * "THECHAMPS200 ATIVADO" ou o "HENRIQUESTB200 ATIVADO" passavam por baixo dele (medido em 15/Out/26).
 */
export function CupomBar({ cupom, onCtaClick }: { cupom: CupomParceiro; onCtaClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onCtaClick}
      aria-label={`Cupom ${cupom.codigo} ativado: R$${CUPOM_VALOR} de desconto. Ir para o cadastro`}
      className="cupom-faixa relative block w-full overflow-hidden text-white"
      style={{ background: "linear-gradient(90deg, #02a114, #06c81e 50%, #02a114)", fontFamily: "var(--font-montserrat)" }}
    >
      <span className="cupom-brilho" aria-hidden="true" />
      {/* O espaçamento vertical fica num span por fora: o .container-custom do site zera o padding vertical. */}
      <span className="relative block py-2.5 md:py-3">
      <span className="container-custom relative flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <Ticket className="h-6 w-6 md:h-7 md:w-7 flex-none" strokeWidth={2.4} />
          <span className="flex min-w-0 flex-col text-left leading-tight md:flex-row md:items-baseline md:gap-3">
            <span className="text-[16px] md:text-[19px] font-extrabold tracking-wide whitespace-nowrap"><span className="hidden md:inline">CUPOM </span>{cupom.codigo}<span className="hidden sm:inline"> ATIVADO</span></span>
            <span className="text-[12.5px] md:text-[15px] font-semibold opacity-95">
              R${CUPOM_VALOR} off no<span className="hidden md:inline"> seu</span> app próprio<span className="hidden md:inline"> · até {CUPOM_VALIDO_ATE_TEXTO}</span>
            </span>
          </span>
        </span>
        <span className="cupom-botao flex flex-none items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 md:px-5 md:py-2 text-[12.5px] md:text-[14px] font-extrabold uppercase text-[#028a10]">
          <span>Usar<span className="hidden sm:inline"> cupom</span></span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </span>
      </span>
      <style jsx>{`
        .cupom-brilho {
          position: absolute;
          inset: 0 auto 0 -40%;
          width: 35%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transform: skewX(-20deg);
          animation: cupom-brilho 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes cupom-brilho {
          0% { left: -40%; }
          55%, 100% { left: 130%; }
        }
        @keyframes cupom-pulso {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 7px rgba(255, 255, 255, 0); }
        }
        .cupom-botao { animation: cupom-pulso 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cupom-brilho, .cupom-botao { animation: none; }
        }
      `}</style>
    </button>
  );
}
