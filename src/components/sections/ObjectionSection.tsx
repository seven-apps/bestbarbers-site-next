"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface ObjectionSectionProps {
  objections: { question: string; answer: string }[];
}

export function ObjectionSection({ objections }: ObjectionSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#121212] py-10 md:py-14">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffaf02]/10 border border-[#ffaf02]/20 rounded-full text-[#ffaf02] text-[11px] font-bold mb-3">
            <HelpCircle className="w-3 h-3" />
            DUVIDAS FREQUENTES
          </span>
          <h2 className="text-lg md:text-xl font-extrabold text-white">
            Ainda com duvida?
          </h2>
        </div>

        {/* Accordion — V5 styling: bg-gradient, backdrop-blur, shadow-2xl */}
        <div className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {objections.map((obj, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-gray-800/30 last:border-b-0 ${
                  isOpen ? "bg-[#ffaf02]/5" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="group w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span
                    className={`font-bold text-sm transition-colors ${
                      isOpen
                        ? "text-[#ffaf02]"
                        : "text-white group-hover:text-[#ffaf02]"
                    }`}
                  >
                    {obj.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#ffaf02]/20 rotate-180"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-colors ${
                        isOpen
                          ? "text-[#ffaf02]"
                          : "text-gray-500 group-hover:text-[#ffaf02]"
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed pr-12">
                    {obj.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Stack — V5 styling: gradient bg, golden border */}
        <div className="mt-5 bg-gradient-to-br from-[#ffaf02]/8 to-[#ffc233]/5 border border-[#ffaf02]/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(255,175,2,0.05)]">
          <h3 className="text-white/70 font-bold text-[11px] text-center mb-3 tracking-wider uppercase">
            O que voce recebe por R$299/mes
          </h3>
          <div className="space-y-1">
            {[
              { item: "Gestao financeira completa", value: "R$500" },
              { item: "Clube de assinaturas integrado", value: "R$800" },
              { item: "Agendamento online 24h", value: "R$600" },
              { item: "NFS-e automatica", value: "R$300" },
              { item: "Dashboard multi-unidade", value: "R$400" },
              { item: "Gerente dedicado de onboarding", value: "R$1.000" },
            ].map((row) => (
              <div key={row.item} className="flex items-center justify-between py-1">
                <span className="text-gray-400 text-[13px]">{row.item}</span>
                <span className="text-gray-600 text-[13px] font-medium tabular-nums">{row.value}/mes</span>
              </div>
            ))}
            <div className="border-t border-[#ffaf02]/10 pt-2 mt-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Total percebido</span>
                <span className="text-gray-500 font-bold text-sm line-through">R$3.600/mes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm">Voce paga</span>
                <span className="text-[#ffaf02] font-extrabold text-lg">A partir de R$299/mes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
