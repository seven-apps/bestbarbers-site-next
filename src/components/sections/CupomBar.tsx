"use client";

import { useEffect, useState } from "react";
import { Ticket, ArrowRight } from "lucide-react";
import { CUPOM_VALIDO_ATE_TEXTO, CUPOM_VALOR, type CupomParceiro } from "@/lib/cupom-parceiro";

/**
 * Cartão verde do cupom do parceiro (out/26), fixo no rodapé da tela enquanto a pessoa lê a página. Pedido do André
 * (15/Out/26): "tem que ser bem mais chamativo" — o código grande, o valor e um botão que pulsa. Leva ao formulário no
 * clique.
 */
export function CupomBar({ cupom, onCtaClick }: { cupom: CupomParceiro; onCtaClick: () => void }) {
  // Aparece quando o topo (que já mostra o cupom) sai da tela; some quando o formulário aparece. Assim a 1ª tela fica
  // limpa e o cartão sobe na rolagem, sem cobrir o botão do topo nem o de enviar.
  const [heroNaTela, setHeroNaTela] = useState(true);
  const [formNaTela, setFormNaTela] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setHeroNaTela(false); return; }
    const hero = document.getElementById("cupom-hero");
    const form = document.getElementById("form-section");
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === hero) setHeroNaTela(e.isIntersecting);
        if (e.target === form) setFormNaTela(e.isIntersecting);
      }
    }, { threshold: 0.05 });
    if (hero) obs.observe(hero); else setHeroNaTela(false);
    if (form) obs.observe(form);
    return () => obs.disconnect();
  }, []);
  const escondido = heroNaTela || formNaTela;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 md:px-6 transition-transform duration-300 ${escondido ? "translate-y-[140%]" : "translate-y-0"}`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      role="region"
      aria-label={`Cupom ${cupom.codigo} ativado`}
    >
      <button
        type="button"
        onClick={onCtaClick}
        className="cupom-cartao mx-auto flex w-full max-w-3xl items-center gap-3 md:gap-5 rounded-2xl border-2 border-dashed border-white/60 px-4 py-3.5 md:px-6 md:py-4 text-left text-white"
        style={{ background: "linear-gradient(135deg, #02a114, #04c41a)", boxShadow: "0 12px 40px rgba(2,171,21,0.55), 0 0 0 4px rgba(4,196,26,0.18)", fontFamily: "var(--font-montserrat)" }}
      >
        <span className="flex h-12 w-12 md:h-14 md:w-14 flex-none items-center justify-center rounded-full bg-white/20">
          <Ticket className="h-7 w-7 md:h-8 md:w-8" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] opacity-90">Cupom ativado</span>
          <span className="text-[24px] md:text-[30px] font-extrabold leading-none tracking-wide">{cupom.codigo}</span>
          <span className="mt-1 text-[13px] md:text-[15px] font-semibold leading-tight">
            R${CUPOM_VALOR} off no seu app próprio<span className="hidden md:inline"> · até {CUPOM_VALIDO_ATE_TEXTO}</span>
          </span>
        </span>
        <span className="cupom-botao flex flex-none items-center gap-1.5 rounded-xl bg-white px-4 py-3 md:px-6 md:py-3.5 text-[14px] md:text-[16px] font-extrabold uppercase text-[#028a10]">
          Usar <span className="hidden sm:inline">cupom</span> <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
        </span>
      </button>
      <style jsx>{`
        @keyframes cupom-pulso {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.55); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
        }
        .cupom-botao { animation: cupom-pulso 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cupom-botao { animation: none; } }
      `}</style>
    </div>
  );
}
