"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { X, Check } from "lucide-react";

interface OfferComparisonProps {
  onCtaClick?: () => void;
}

const rows = [
  {
    label: "Taxa de implantação",
    bestbarbers: "100% gratuita",
    others: "R$ 3.000 a R$ 5.000",
  },
  {
    label: "App próprio com a sua marca",
    bestbarbers: "Totalmente personalizado",
    others: "Cobrado à parte ou indisponível",
  },
  {
    label: "Clube de assinaturas",
    bestbarbers: "100% integrado",
    others: "Limitado ou não tem",
  },
  {
    label: "Emissão de Notas fiscais",
    bestbarbers: "100% integrada e automática",
    others: "Limitado ou não tem",
  },
  {
    label: "Atendimento e Suporte",
    bestbarbers: "Gerente de contas dedicado",
    others: "Por e-mail ou não tem",
  },
  {
    label: "Mensalidade",
    bestbarbers: "A partir de R$ 299/mês",
    others: "Variável (sem app próprio)",
  },
];

export function OfferComparisonV11({ onCtaClick }: OfferComparisonProps) {
  return (
    <section className="relative py-14 md:py-20 lg:py-24 bg-[#0a0a0a] overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#ffaf02]/[0.06] blur-[140px] rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] mb-4 border border-[#ffaf02]/20">
            ★ Oferta atual
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-extrabold text-white leading-tight max-w-3xl mx-auto mb-4">
            Outros sistemas cobram <span className="text-red-400">R$ 3.000 a R$ 5.000</span> para desenvolver seu app
          </h2>
          <span className="text-[#ffaf02] text-3xl font-extrabold">O BestBarbers vai desenvolver para você de graça!</span>
        </div>

        {/* Tabela comparativa */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] rounded-3xl border border-[#ffaf02]/20 overflow-hidden shadow-[0_8px_60px_rgba(255,175,2,0.08)] animate-fade-in-up">
            {/* Header — BestBarbers primeiro à esquerda */}
            <div className="grid grid-cols-[0.9fr_1.2fr_1fr] md:grid-cols-[1.3fr_1.3fr_1fr] gap-3 md:gap-4 px-3 md:px-8 py-4 md:py-5 border-b border-white/10 bg-[#0d0d0d]/50">
              <div />
              <div className="text-center">
                <p className="text-[10px] md:text-xs font-extrabold text-emerald-400 uppercase tracking-wider">BestBarbers <br className="md:hidden" />(o melhor)</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Outros<br className="md:hidden" /> sistemas</p>
              </div>
            </div>

            {/* Linhas */}
            {rows.map((row, idx) => (
              <div
                key={row.label}
                className={`grid grid-cols-[0.9fr_1.2fr_1fr] md:grid-cols-[1.3fr_1.3fr_1fr] gap-3 md:gap-4 px-3 md:px-8 py-4 md:py-5 ${
                  idx !== rows.length - 1 ? "border-b border-white/5" : ""
                } animate-fade-in`}
                style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
              >
                <div className="flex items-center">
                  <p className="text-white font-bold text-[12px] md:text-sm leading-snug break-words">{row.label}</p>
                </div>
                <div className="flex items-start gap-1.5 md:gap-2 min-w-0">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white stroke-[3]" />
                  </span>
                  <div className="leading-snug min-w-0">
                    <p className="text-white font-extrabold text-[12px] md:text-sm break-words">{row.bestbarbers}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1 md:gap-2 text-gray-500 min-w-0">
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] md:text-sm leading-snug break-words min-w-0">{row.others}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10 md:mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CTAButton
              onClick={onCtaClick}
              variant="secondary"
              size="lg"
              icon={true}
              className="!shadow-[0_10px_40px_rgba(2,171,21,0.45)] hover:!shadow-[0_14px_50px_rgba(2,171,21,0.55)]"
            >
              QUERO APROVEITAR A OFERTA
            </CTAButton>
            <p className="text-xs md:text-sm text-gray-500 mt-3 font-medium">
              Sem taxa de implantação · Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
