"use client";

import { useEffect, useState } from "react";
import { Ticket, ArrowRight } from "lucide-react";
import { CUPOM_VALIDO_ATE_TEXTO, CUPOM_VALOR, type CupomParceiro } from "@/lib/cupom-parceiro";

/**
 * Barra verde do cupom do parceiro (out/26): fixa no rodapé da tela enquanto a pessoa lê a página, para o cupom não
 * sair de vista. Some quando o formulário aparece na tela (não cobre o botão de enviar) e leva ao formulário no clique.
 */
export function CupomBar({ cupom, onCtaClick }: { cupom: CupomParceiro; onCtaClick: () => void }) {
  const [formNaTela, setFormNaTela] = useState(false);
  useEffect(() => {
    const form = document.getElementById("form-section");
    if (!form || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setFormNaTela(e.isIntersecting), { threshold: 0.15 });
    obs.observe(form);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${formNaTela ? "translate-y-full" : "translate-y-0"}`}
      style={{ background: "linear-gradient(135deg, #029912, #02ab15)", paddingBottom: "env(safe-area-inset-bottom, 0px)", boxShadow: "0 -6px 24px rgba(2,171,21,0.35)" }}
      role="region"
      aria-label={`Cupom ${cupom.codigo} ativado`}
    >
      <div className="container-custom flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3 min-w-0 text-white">
          <Ticket className="w-5 h-5 md:w-6 md:h-6 flex-none" />
          <p className="leading-tight font-semibold min-w-0" style={{ fontFamily: "var(--font-montserrat)" }}>
            <span className="block sm:inline text-[14px] md:text-[15px]">Cupom <b className="font-extrabold tracking-wide">{cupom.codigo}</b><span className="hidden sm:inline"> ativado</span></span>
            <span className="hidden sm:inline text-[15px]">: R${CUPOM_VALOR} de desconto na 1ª mensalidade, até {CUPOM_VALIDO_ATE_TEXTO}</span>
            <span className="block sm:hidden text-[12px] opacity-90">R${CUPOM_VALOR} off na 1ª mensalidade</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          className="flex-none flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-[#028a10] hover:scale-[1.03] transition-transform"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <span className="hidden sm:inline">Usar agora</span><span className="sm:hidden">Usar</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
