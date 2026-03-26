"use client";

import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  metric: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Barbearia com 4 cadeiras",
    location: "Grande São Paulo/SP",
    quote:
      "4 cadeiras, 353 assinantes, de R$15K para R$31.690/mês. Mesma equipe, mesmo ponto. O clube mudou tudo.",
    metric: "R$15K → R$31.690/mês",
  },
  {
    name: "Rede com 6 unidades",
    location: "Minas Gerais",
    quote:
      "6 unidades, 1.000 assinantes, R$176K/mês só em clube. R$440K total. O BestBarbers é a espinha dorsal.",
    metric: "R$440K/mês faturamento",
  },
  {
    name: "Barbearia single-unit",
    location: "São Paulo/SP",
    quote:
      "Mais de 700 assinantes em uma única unidade. A maior barbearia single-unit do Brasil no clube de assinaturas.",
    metric: "700+ assinantes",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#b37a00] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
            <Star className="w-4 h-4 fill-[#ffaf02] text-[#ffaf02]" />
            RESULTADOS REAIS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-black-text mb-3">
            O que Donos de Barbearia Dizem
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
            Resultados reais de barbearias que transformaram seus negócios com
            BestBarbers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <figure
              key={index}
              className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#ffaf02] text-[#ffaf02]"
                  />
                ))}
              </div>

              {/* Metric highlight */}
              <div className="mb-4 px-3 py-1.5 bg-[#ffaf02]/10 rounded-lg inline-block">
                <span className="text-sm font-bold text-[#b37a00]">
                  {testimonial.metric}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Attribution */}
              <figcaption className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center">
                  <span className="text-[#ffaf02] font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <cite className="not-italic text-sm font-bold text-neutral-black-text block">
                    {testimonial.name}
                  </cite>
                  <span className="text-xs text-gray-500">
                    {testimonial.location}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
