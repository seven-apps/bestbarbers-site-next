"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { Sparkles, BadgeCheck } from "lucide-react";

interface HeroV5Props {
  onCtaClick?: () => void;
}

export function HeroV5({ onCtaClick }: HeroV5Props) {
  return (
    <section
      className="relative pt-24 md:pt-28 lg:pt-32 pb-14 md:pb-20 lg:pb-24 flex justify-center items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffaf02 0%, #ffbe33 50%, #ffaf02 100%)"
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-5 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/90 rounded-full text-white text-xs md:text-sm font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#ffaf02]" />
              1.200 barbearias ja usam
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[24px] md:text-[36px] lg:text-[44px] font-extrabold leading-[1.15] text-neutral-bg2 mb-4 animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            Seu App. Seus Clientes. Receita Todo Mes.
          </h1>

          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <span className="inline-block text-white bg-black px-5 py-3 rounded-xl font-extrabold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.1] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              R$0 de Implantação.
            </span>
          </div>

          {/* Subheadline */}
          <p
            className="text-[15px] md:text-[17px] lg:text-[19px] font-extrabold leading-relaxed text-neutral-bg2 max-w-2xl mb-8 animate-fade-in-up"
            style={{ animationDelay: '0.35s' }}
          >
            <span className="text-white bg-black/80 px-2 py-0.5 rounded-md">R$299/mes</span>.{" "}
            <span className="text-white bg-black/80 px-2 py-0.5 rounded-md">3 assinantes ja pagam</span>.{" "}
            <span className="text-white bg-black/80 px-2 py-0.5 rounded-md">Nota 5.0</span>.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <div className="rounded-full animate-pulse-glow">
              <CTAButton
                onClick={onCtaClick}
                variant="secondary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto !shadow-[0_8px_40px_rgba(2,171,21,0.5)] hover:!shadow-[0_12px_50px_rgba(2,171,21,0.6)]"
              >
                DESCOBRIR MEU POTENCIAL DE LUCRO
              </CTAButton>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-neutral-bg2/80 animate-fade-in" style={{ animationDelay: '0.55s' }}>
              <BadgeCheck className="w-4 h-4" />
              <span className="text-xs md:text-sm font-semibold">Zero Implantação — Antes era R$2.400</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
