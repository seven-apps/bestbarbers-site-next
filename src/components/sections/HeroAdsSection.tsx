"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { Sparkles } from "lucide-react";

interface HeroAdsSectionProps {
  onCtaClick?: () => void;
}

export function HeroAdsSection({ onCtaClick }: HeroAdsSectionProps) {
  return (
    <section
      className="relative pt-32 pb-16 md:py-40 flex justify-center items-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain texture overlay — assinatura visual V12 */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.02,
          mixBlendMode: "overlay",
        }}
      />

      {/* Bokeh / Glow Effects — Estilo V12 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] md:w-[100%] max-w-[800px] h-[400px] rounded-full opacity-[0.08] animate-pulse"
          style={{
            background: "radial-gradient(ellipse, #ebad04 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDuration: "12s",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Row 1: Headlines + Video */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-14 w-full max-w-6xl mx-auto">
          {/* Headlines */}
          <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 animate-scale-in">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: "rgba(235,173,4,0.12)",
                  borderColor: "rgba(235,173,4,0.35)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ebad04]" fill="currentColor" />
                <span
                  className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
                >
                  Sistema #1 para Barbearias
                </span>
              </div>
            </div>

            <h1 
              className="leading-[1.1] tracking-tight text-white mb-6 animate-fade-in-up"
              style={{ fontFamily: "var(--font-vollkorn)" }}
            >
              <span 
                className="block mb-2"
                style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800 }}
              >
                SUA BARBEARIA ESTÁ CRESCENDO,
              </span>
              <span 
                className="block"
                style={{ fontSize: "clamp(32px, 8vw, 56px)", fontWeight: 800, color: "#ebad04" }}
              >
                O DINHEIRO ENTRANDO...
              </span>
            </h1>

            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span 
                className="inline-block text-white border-l-4 border-[#ebad04] pl-4 md:pl-6 py-2 font-extrabold text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1]"
                style={{ fontFamily: "var(--font-vollkorn)" }}
              >
                Mas seu lucro
                <br />
                não aumenta!
              </span>
            </div>
          </div>

          {/* Video */}
          <div 
            className="w-full lg:w-[52%] flex justify-center lg:justify-end animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative w-full max-w-lg">
              {/* Glow effect behind video */}
              <div className="absolute -inset-4 bg-[#ebad04]/10 rounded-2xl blur-3xl" />

              {/* Video container estilo V12 */}
              <div 
                className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style={{ background: "#000" }}
              >
                <iframe
                  src="https://www.youtube.com/embed/ZnicnaPdui0?autoplay=1&mute=1&loop=1&playlist=ZnicnaPdui0&rel=0"
                  title="Best Barbers"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Description + CTA */}
        <div 
          className="w-full mt-12 md:mt-16 flex flex-col lg:flex-row items-center justify-between gap-8 animate-fade-in-up max-w-6xl mx-auto"
          style={{ animationDelay: '0.4s' }}
        >
          {/* Textos */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <p 
              className="text-[17px] md:text-[19px] leading-relaxed mb-4 text-white font-medium"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Não é sobre atender mais clientes. É sobre{" "}
              <span className="text-[#ebad04] font-bold">ganhar mais dinheiro e lucrar mais</span>,
              com a barbearia que você já tem.
            </p>

            <p 
              className="text-[14px] md:text-[15px] leading-relaxed text-white/60 font-medium"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              O BestBarbers ajuda barbearias a organizarem a gestão, criarem novas fontes de receita e transformarem faturamento em lucro real.
            </p>
          </div>

          {/* CTA estilo V12 */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <div className="animate-pulse-glow">
              <CTAButton
                onClick={onCtaClick}
                variant="secondary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto !text-[15px] !py-5 !px-10"
              >
                QUERO LUCRAR MAIS AGORA
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
