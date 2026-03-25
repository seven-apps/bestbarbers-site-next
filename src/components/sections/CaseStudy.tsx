"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { TrendingUp } from "lucide-react";

interface CaseStudyProps {
  onCtaClick?: () => void;
}

export function CaseStudy({ onCtaClick }: CaseStudyProps) {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
              <TrendingUp className="w-4 h-4" />
              CASO REAL
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white">
              Barbearia de 4 cadeiras que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">dobrou o faturamento</span>
            </h2>
          </div>

          {/* Before/After Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* ANTES */}
            <div className="bg-gradient-to-br from-red-500/5 to-red-900/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Antes</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-red-400">R$15.892</span>
                  <span className="text-gray-400 text-sm font-medium">/mes</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                    4 cadeiras, equipe de 4
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                    Agenda via WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                    Sem previsibilidade de caixa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                    Faturamento dependia do movimento
                  </li>
                </ul>
              </div>
            </div>

            {/* DEPOIS */}
            <div className="bg-gradient-to-br from-[#ffaf02]/5 to-[#ffc233]/5 border border-[#ffaf02]/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-[#ffaf02]/20 px-2 py-0.5 rounded-full">
                <span className="text-[#ffaf02] text-[10px] font-bold">COM BESTBARBERS</span>
              </div>
              <div className="text-xs font-bold text-[#ffaf02] uppercase tracking-wider mb-4">Depois</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#ffaf02]">
                    R$31.690
                  </span>
                  <span className="text-gray-300 text-sm font-medium">/mes</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]" />
                    Mesmas 4 cadeiras, mesma equipe
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]" />
                    353 assinantes no clube
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]" />
                    Receita automatica todo mes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]" />
                    Crescimento de 2x em faturamento
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom line + CTA */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              Mesma equipe. Mesmo ponto. A diferenca?{" "}
              <span className="text-white font-bold">Montou clube de assinaturas com BestBarbers.</span>
            </p>
            <CTAButton
              onClick={onCtaClick}
              variant="secondary"
              size="lg"
              icon={true}
              className="!shadow-[0_8px_40px_rgba(2,171,21,0.5)]"
            >
              QUERO VER O POTENCIAL DA MINHA BARBEARIA
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
