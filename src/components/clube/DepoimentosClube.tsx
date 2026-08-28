"use client";

import { Star } from "lucide-react";

interface CaseClube {
  name: string;
  location: string;
  text: string;
  metric: string;
}

/**
 * Clone da TestimonialsSection da homepage para /clube.
 * 3 cards anônimos (porte + cidade, nunca nome de barbearia) com os
 * literais do cases-clube.json vivo: bb#12612, bb#15550 e bb#16402.
 */
const cases: CaseClube[] = [
  {
    // bb#12612
    name: "Barbearia de 4 cadeiras",
    location: "Belo Horizonte/MG",
    text: "De 23 para 100 assinantes em 15 meses. A receita do clube saiu de R$2.724 para R$10.486 por mês.",
    metric: "R$2.724 → R$10.486/mês",
  },
  {
    // bb#15550
    name: "Barbearia de 4 cadeiras",
    location: "Antônio Carlos/SC",
    text: "90 assinantes no clube. Em 12 meses, a receita de assinaturas saiu de R$2.264 para R$10.542 por mês.",
    metric: "R$2.264 → R$10.542/mês",
  },
  {
    // bb#16402
    name: "Barbearia de 2 cadeiras",
    location: "São Paulo/SP",
    text: "75 assinantes pagando pelo app — R$16.152 por mês de receita recorrente no clube.",
    metric: "R$16.152/mês em clube",
  },
];

export function DepoimentosClube() {
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
            Barbearias reais na plataforma, identificadas por porte e cidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cases.map((caseItem, index) => (
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
                  {caseItem.metric}
                </span>
              </div>

              {/* Resultado */}
              <blockquote className="mb-6">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {caseItem.text}
                </p>
              </blockquote>

              {/* Attribution */}
              <figcaption className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center">
                  <span className="text-[#ffaf02] font-bold text-sm">
                    {caseItem.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <cite className="not-italic text-sm font-bold text-neutral-black-text block">
                    {caseItem.name}
                  </cite>
                  <span className="text-xs text-gray-500">
                    {caseItem.location}
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
