"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { CheckCircle2, XCircle } from "lucide-react";

interface OfferComparisonV12Props {
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
    label: "Emissão de Notas Fiscais",
    bestbarbers: "Automática e integrada",
    others: "Limitado ou não tem",
  },
  {
    label: "Suporte dedicado",
    bestbarbers: "Gerente de contas real",
    others: "E-mail ou chatbot",
  },
  {
    label: "Mensalidade",
    bestbarbers: "A partir de R$ 299/mês",
    others: "Variável (sem app próprio)",
  },
];

export function OfferComparisonV12({ onCtaClick }: OfferComparisonV12Props) {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain sutil */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] mb-5 border"
            style={{
              background: "rgba(235,173,4,0.1)",
              color: "#ebad04",
              borderColor: "rgba(235,173,4,0.2)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            ★ Oferta por tempo limitado
          </span>

          <h2
            className="leading-tight max-w-3xl mx-auto mb-3"
            style={{
              fontFamily: "var(--font-vollkorn)",
              fontWeight: 700,
              fontSize: "clamp(24px, 4.5vw, 44px)",
              color: "#ffffff",
            }}
          >
            Enquanto outros cobram para começar,{" "}
            <span style={{ color: "#ebad04" }}>você já está vendendo.</span>
          </h2>

          <p
            className="text-sm md:text-base max-w-xl mx-auto"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
            }}
          >
            Outros sistemas cobram de{" "}
            <span style={{ color: "#f87171", fontWeight: 700 }}>R$3.000 a R$5.000</span>{" "}
            só pra desenvolver seu app. O BestBarbers faz isso de graça.
          </p>
        </div>

        {/* Grid de Comparação - Estilo Bento Cards */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto relative z-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          {rows.map((row, idx) => (
            <div
              key={row.label}
              className="flex flex-col p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 md:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ebad04]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <h3 
                className="text-[15px] md:text-[17px] font-bold text-white mb-6 relative z-10" 
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {row.label}
              </h3>
              
              <div className="flex flex-col gap-3 relative z-10 mt-auto">
                {/* BestBarbers */}
                <div className="flex items-center gap-3 p-4 rounded-[16px] bg-[#ebad04]/10 border border-[#ebad04]/20">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" fill="currentColor" />
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#ebad04] tracking-widest block mb-0.5">BestBarbers</span>
                    <span className="text-[13px] md:text-[14px] font-extrabold text-white leading-tight block">{row.bestbarbers}</span>
                  </div>
                </div>

                {/* Outros */}
                <div className="flex items-center gap-3 p-4 rounded-[16px] bg-white/[0.02] border border-white/5">
                  <XCircle className="w-5 h-5 text-[#ef4444] shrink-0 opacity-80" fill="currentColor" />
                  <div>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block mb-0.5">Outros sistemas</span>
                    <span className="text-[12px] md:text-[13px] text-white/50 leading-tight block">{row.others}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-14 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <CTAButton
            onClick={onCtaClick}
            variant="secondary"
            size="lg"
            icon={true}
            className="mt-2"
          >
            QUERO APROVEITAR A OFERTA
          </CTAButton>
          <p
            className="text-xs md:text-sm mt-4 font-medium"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
          >
            Sem taxa de implantação · Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
