"use client";

import { Star, Quote } from "lucide-react";

const masterTestimonial = {
  quote: "Era R$15 mil. Montei o clube. Dobrei em 4 meses. Mesma equipe, mesmo ponto, mesma cidade. A diferença foi ter sistema.",
  name: "Barbearia em Embu das Artes/SP",
  detail: "4 cadeiras · 353 assinantes",
  result: "R$15K → R$31K/mês",
  initials: "BP",
};

const otherTestimonials = [
  {
    quote: "Hoje eu tenho mais de R$34 mil pra receber em assinatura. Todo mês. Sem precisar cobrar cliente manualmente.",
    name: "@omilenorocha",
    detail: "3 unidades · 521 assinantes",
    result: "R$101K/mês",
  },
  {
    quote: "Em 32 meses, R$1.222.716 faturados só com clube. Receita previsível mudou meu jogo.",
    name: "@joaoseletto",
    detail: "475 assinantes ativos",
    result: "R$1,2M acumulado",
  },
  {
    quote: "57% do meu faturamento vem de assinaturas. Cortar cabelo é só 23% do negócio. Sistema é o resto.",
    name: "@o_kaique_alves",
    detail: "469 assinantes ativos",
    result: "Top 5 da rede",
  },
  {
    quote: "Uma cadeira. Sozinha. R$12 mil por mês. Sem WhatsApp travado, sem agenda no papel.",
    name: "@thaisdantbarber",
    detail: "Solo · 1 cadeira",
    result: "R$12.589/mês",
  },
];

export function TestimonialsV11() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-[#0a0a0a]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
            <Star className="w-4 h-4" />
            RESULTADOS REAIS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white">
            A diferença não foi <span className="text-[#ffaf02]">esforço.</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            Foi sistema. Foi previsibilidade. Foi a marca certa.
          </p>
        </div>

        {/* Master Quote */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="relative bg-gradient-to-br from-[#1a1a1a]/95 to-[#1e1e1e]/95 border border-[#ffaf02]/25 rounded-3xl p-7 md:p-10 shadow-[0_8px_60px_rgba(255,175,2,0.08)]">
            <Quote className="absolute -top-4 left-8 w-10 h-10 text-[#ffaf02] bg-[#0a0a0a] rounded-full p-2" />

            <div className="flex gap-1 mb-4 mt-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#ffaf02] text-[#ffaf02]" />
              ))}
            </div>

            <p className="text-white font-bold text-lg md:text-xl lg:text-2xl leading-relaxed italic mb-6">
              &ldquo;{masterTestimonial.quote}&rdquo;
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-5 border-t border-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#ffaf02] to-[#ffc233] flex items-center justify-center shadow-lg shadow-[#ffaf02]/20">
                  <span className="text-[#121212] font-extrabold text-lg md:text-xl">{masterTestimonial.initials}</span>
                </div>
                <div>
                  <p className="text-white font-extrabold text-base">{masterTestimonial.name}</p>
                  <p className="text-gray-500 text-xs md:text-sm mt-0.5">{masterTestimonial.detail}</p>
                </div>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-[#ffaf02]/15 rounded-full border border-[#ffaf02]/30 self-start md:self-center">
                <span className="text-[#ffaf02] text-sm font-extrabold">{masterTestimonial.result}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outros testemunhos — grid 2x2 com quotes dos influencers parceiros */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
          {otherTestimonials.map((t, idx) => (
            <div
              key={t.name}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] border border-gray-800/50 rounded-2xl p-5 md:p-6 hover:border-[#ffaf02]/25 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div className="flex gap-0.5 mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#ffaf02] text-[#ffaf02]" />
                ))}
              </div>

              <p className="text-white font-medium text-sm md:text-[15px] leading-relaxed italic mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-end justify-between gap-3 pt-4 border-t border-gray-800/30">
                <div className="leading-tight">
                  <p className="text-white font-extrabold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.detail}</p>
                </div>
                <span className="text-[#ffaf02] font-extrabold text-xs md:text-sm whitespace-nowrap">
                  {t.result}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm font-medium mt-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          Cinco barbeiros de referência.{" "}
          <span className="text-white font-bold">Mais de 2.000 assinantes só entre eles.</span>
        </p>
      </div>
    </section>
  );
}
