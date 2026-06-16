"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { Calculator, TrendingDown } from "lucide-react";
import { PROVA } from "./calc";
import { REAIS } from "./benchmarks";

interface HeroCalcProps {
  onCtaClick?: () => void;
}

export function HeroCalc({ onCtaClick }: HeroCalcProps) {
  return (
    <section
      className="pt-28 pb-10 md:pt-36 md:pb-16 relative overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain texture overlay — assinatura visual da marca */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.02,
          mixBlendMode: "overlay",
        }}
      />

      {/* Glow superior */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] md:w-[100%] max-w-[800px] h-[400px] rounded-full opacity-[0.06] md:opacity-[0.08] animate-pulse"
          style={{
            background: "radial-gradient(ellipse, #ebad04 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDuration: "12s",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div className="mb-5 md:mb-6 animate-scale-in" style={{ animationDelay: "0.05s" }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{
                background: "rgba(235,173,4,0.12)",
                borderColor: "rgba(235,173,4,0.35)",
              }}
            >
              <Calculator className="w-4 h-4" style={{ color: "#ebad04" }} />
              <span
                className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
              >
                Calculadora Gratuita · 1 minuto
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="leading-[1.05] tracking-tight text-white mb-5 md:mb-6 animate-fade-in-up"
            style={{ fontFamily: "var(--font-vollkorn)", animationDelay: "0.1s" }}
          >
            <span
              className="block"
              style={{ fontSize: "clamp(34px, 7vw, 60px)", fontWeight: 800 }}
            >
              Quanto sua barbearia
            </span>
            <span
              className="block mt-1"
              style={{ fontSize: "clamp(34px, 7vw, 60px)", fontWeight: 800, color: "#ebad04" }}
            >
              perde todo mês?
            </span>
          </h1>

          {/* Sub */}
          <p
            className="text-[15px] md:text-[18px] leading-relaxed mb-3 animate-fade-in-up max-w-xl"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
              animationDelay: "0.2s",
            }}
          >
            Cliente que corta e some leva dinheiro junto. Descubra, em 1 minuto, quanto
            você deixa na mesa sem faturamento recorrente — e quanto poderia faturar com
            um clube de assinaturas.
          </p>
          <p
            className="inline-flex items-center gap-2 text-[13px] md:text-[14px] mb-7 md:mb-9 animate-fade-in-up"
            style={{
              color: "#fafafa",
              opacity: 0.6,
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              animationDelay: "0.25s",
            }}
          >
            <TrendingDown className="w-4 h-4" style={{ color: "#ebad04" }} />
            Dados reais da base BestBarbers — {PROVA.assinantesAtivos.toLocaleString("pt-BR")} assinantes
            ativos em {PROVA.barbearias.toLocaleString("pt-BR")} barbearias ({REAIS.percentualComClube}% já com clube)
          </p>

          {/* CTA — desce até a calculadora */}
          <div className="animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: "0.35s" }}>
            <CTAButton
              onClick={onCtaClick}
              variant="secondary"
              size="lg"
              icon={true}
              className="w-full sm:w-auto !text-[15px] !py-5 !px-10"
            >
              CALCULAR MEU PREJUÍZO
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Divisor diagonal */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 md:h-14 pointer-events-none z-10"
        style={{
          background: "#0a0a0a",
          clipPath: "polygon(0 60%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      />
    </section>
  );
}
