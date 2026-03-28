"use client";

import { Star, Quote } from "lucide-react";
import { CountUp } from "@/components/ui/motion";

const testimonials = [
  {
    quote: "Era R$15 mil. Montei o clube. Dobrei em 4 meses. Mesma equipe, mesmo ponto.",
    name: "Barbearia Pirajussara",
    detail: "Embu das Artes/SP · 4 cadeiras · 353 assinantes",
    result: "R$15K → R$31K/mes",
  },
  {
    quote: "De 1 pra 3 unidades. R$100K por mes. Tudo pelo app e dashboard.",
    name: "Mileno Rocha",
    detail: "@omilenorocha · 3 unidades · 521 assinantes",
    result: "R$918K acumulados",
  },
  {
    quote: "Uma cadeira. Sozinha. R$12K por mes. Sem WhatsApp, sem papel.",
    name: "Thais D'Antunes",
    detail: "@thaisdantbarber · Solo · 1 cadeira",
    result: "R$12.589/mes",
  },
];

const consolidatedStats = [
  { value: 1200, suffix: "+", label: "Barbearias" },
  { value: 51, suffix: "K+", label: "Assinantes ativos" },
  { value: 5, prefix: "R$", suffix: "M+", label: "Processado/mes" },
  { value: 5, suffix: ".0 ★", label: "App Store" },
];

export function Testimonials() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-[#0a0a0a]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
            <Star className="w-4 h-4" />
            RESULTADOS REAIS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            O que donos de barbearia dizem
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            Nomes reais. Resultados reais. Verificaveis.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-12 md:mb-16">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 border border-gray-800/50 rounded-2xl p-6 flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
            >
              <Quote className="w-6 h-6 text-[#ffaf02]/40 mb-3" />
              <p className="text-white font-medium text-sm md:text-[15px] leading-relaxed mb-4 flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-gray-800/30 pt-4">
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{t.detail}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-[#ffaf02]/10 rounded-full">
                  <span className="text-[#ffaf02] text-xs font-bold">{t.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Consolidated Numbers */}
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {consolidatedStats.map((stat, i) => (
              <div key={i} className="text-center py-4">
                <div className="text-2xl md:text-3xl font-extrabold text-[#ffaf02]">
                  {stat.prefix || ""}<CountUp end={stat.value} duration={2} />{stat.suffix}
                </div>
                <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
