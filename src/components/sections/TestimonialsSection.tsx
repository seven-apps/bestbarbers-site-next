"use client";

import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  metric: string;
}

/**
 * Cases reais, anonimizados por porte + cidade/UF — literais de
 * knowledge/dominio/cases-clube.json (campos `crescimento` e
 * `crescimento_assinantes`), todos com `crivel: true` e `bloqueio: null`.
 *
 * O que saiu daqui e por quê:
 * - o arco "4 cadeiras · 353 assinantes · R$15.892 → R$31.690" está declarado MORTO
 *   em knowledge/marketing/clube-arsenal.md (editorial não reconciliado) e nenhum
 *   case do banco bate com ele;
 * - "6 unidades · 1.000 assinantes · R$440K/mês" e "a maior barbearia single-unit
 *   do Brasil" não têm fonte — o segundo é superlativo não sustentável;
 * - as frases entre aspas eram falas inventadas atribuídas a barbearias anônimas.
 *   Aqui o texto é descritivo: número do banco, sem colocar palavra na boca de ninguém.
 *
 * Todo número abaixo é RECEITA DE CLUBE (assinaturas), nunca faturamento total.
 */
const testimonials: Testimonial[] = [
  {
    // bb#13285
    name: "Barbearia de 4 cadeiras",
    location: "Araxá/MG",
    quote:
      "De 99 para 277 assinantes em 19 meses. A receita do clube saiu de R$9.249 para R$30.447 por mês — mesmas 4 cadeiras.",
    metric: "R$9.249 → R$30.447/mês",
  },
  {
    // bb#10387
    name: "Barbearia de 8 cadeiras",
    location: "Belo Horizonte/MG",
    quote:
      "De 88 para 600 assinantes em 25 meses. Hoje são R$72.577 por mês de receita recorrente, cobrados no automático.",
    metric: "600 assinantes no clube",
  },
  {
    // bb#12164
    name: "Barbearia de 6 cadeiras",
    location: "Londrina/PR",
    quote:
      "Começou o clube do zero: 31 assinantes e R$7.682 por mês. Dezessete meses depois, 409 assinantes e R$71.002 por mês.",
    metric: "R$7.682 → R$71.002/mês",
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
            Clubes reais, números do sistema
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
            Barbearias reais na plataforma, identificadas por porte e cidade.
            Os valores são de receita de clube, medidos no próprio sistema.
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
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {testimonial.quote}
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
