"use client";

import { useState } from "react";
import { CTAButton } from "@/components/ui/cta-button";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

interface CaseStudyProps {
  onCtaClick?: () => void;
}

const cases = [
  {
    badge: "Embu das Artes/SP · 4 cadeiras",
    title: "Barbearia de 4 cadeiras que",
    titleHighlight: "dobrou o faturamento",
    before: {
      revenue: "R$15.892",
      perLabel: "/mes",
      items: [
        "4 cadeiras, equipe de 4",
        "Agenda via WhatsApp",
        "Sem previsibilidade de caixa",
        "Faturamento dependia do movimento",
      ],
    },
    after: {
      revenue: "R$31.690",
      perLabel: "/mes",
      items: [
        "Mesmas 4 cadeiras, mesma equipe",
        "353 assinantes no clube",
        "Receita automatica todo mes",
        "Crescimento de 2x em faturamento",
      ],
    },
    bottomText: "Mesma equipe. Mesmo ponto. A diferenca?",
    bottomHighlight: "Montou clube de assinaturas com BestBarbers.",
  },
  {
    badge: "@omilenorocha · 3 unidades · 521 assinantes",
    title: "De 1 unidade para 3.",
    titleHighlight: "R$101K por mes",
    before: {
      revenue: "1 unidade",
      perLabel: "",
      items: [
        "Operacao manual em todas as frentes",
        "Teto de crescimento visivel",
        "Gestao centralizada no dono",
        "Sem padronizacao entre unidades",
      ],
    },
    after: {
      revenue: "3 unidades",
      perLabel: "",
      items: [
        "R$101.798/mes de faturamento",
        "521 assinantes ativos",
        "R$918K acumulados em 22 meses",
        "Gestao multi-unit pelo dashboard",
      ],
    },
    bottomText: "Mileno Rocha escalou de 1 para 3 unidades.",
    bottomHighlight: "Tudo gerenciado pelo app BestBarbers.",
  },
  {
    badge: "@thaisdantbarber · Solo · 1 cadeira",
    title: "Uma cadeira. Sozinha.",
    titleHighlight: "R$12K por mes",
    before: {
      revenue: "Agenda papel",
      perLabel: "",
      items: [
        "1 cadeira, operacao solo",
        "Agenda no papel e WhatsApp",
        '"Sou pequena demais pra sistema"',
        "Sem previsibilidade nenhuma",
      ],
    },
    after: {
      revenue: "R$12.589",
      perLabel: "/mes",
      items: [
        "App proprio com sua marca",
        "Agenda no automatico",
        "Clientes marcam sozinhos",
        "Faturamento previsivel todo mes",
      ],
    },
    bottomText: "Thais provou que tamanho nao importa.",
    bottomHighlight: "1 cadeira, 1 pessoa, resultado real com BestBarbers.",
  },
];

export function CaseStudy({ onCtaClick }: CaseStudyProps) {
  const [activeCase, setActiveCase] = useState(0);
  const currentCase = cases[activeCase];

  const nextCase = () => setActiveCase((prev) => (prev + 1) % cases.length);
  const prevCase = () => setActiveCase((prev) => (prev - 1 + cases.length) % cases.length);

  return (
    <section className="py-14 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
              <TrendingUp className="w-4 h-4" />
              CASOS REAIS
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white">
              {currentCase.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">{currentCase.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-2 font-medium">{currentCase.badge}</p>
          </div>

          {/* Case Navigation */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button onClick={prevCase} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            {cases.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCase(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === activeCase ? "bg-[#ffaf02] w-6" : "bg-gray-600 hover:bg-gray-500 w-2.5"
                }`}
              />
            ))}
            <button onClick={nextCase} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Before/After Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* ANTES */}
            <div className="bg-gradient-to-br from-red-500/5 to-red-900/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Antes</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-red-400">{currentCase.before.revenue}</span>
                  {currentCase.before.perLabel && <span className="text-gray-400 text-sm font-medium">{currentCase.before.perLabel}</span>}
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {currentCase.before.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
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
                    {currentCase.after.revenue}
                  </span>
                  {currentCase.after.perLabel && <span className="text-gray-300 text-sm font-medium">{currentCase.after.perLabel}</span>}
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {currentCase.after.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffaf02] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom line + CTA */}
          <div className="text-center">
            <p className="text-gray-400 text-sm md:text-base mb-6">
              {currentCase.bottomText}{" "}
              <span className="text-white font-bold">{currentCase.bottomHighlight}</span>
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
