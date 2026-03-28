"use client";

import { Sparkles } from "lucide-react";
import { useWhatsAppRedirect } from "@/hooks";
import { MultiStepForm } from "./MultiStepForm";

interface CTAFinalSectionProps {
  headline: string;
  sub: string;
  cta: string;
}

export function CTAFinalSection({ headline, sub, cta }: CTAFinalSectionProps) {
  const { generateWhatsAppLink } = useWhatsAppRedirect();

  return (
    <section id="form-section" className="relative bg-[#121212] py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Decorative blur orbs — V5 pattern */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffaf02]/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#ffaf02]/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-4">
        {/* Badge with glow */}
        <div className="text-center mb-5 animate-fade-in-up">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#ffaf02]/15 to-[#ffc233]/15 border border-[#ffaf02]/30 rounded-full text-[#ffaf02] text-xs font-bold"
            style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            DIAGNOSTICO GRATUITO
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-center text-xl md:text-2xl lg:text-[28px] font-extrabold text-white mb-2 leading-tight animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {headline}
        </h2>

        {/* Sub */}
        <p
          className="text-center text-gray-400 text-sm mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {sub}
        </p>

        {/* Form repeat — same MultiStepForm */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <MultiStepForm ctaText={cta} formLocation="bottom" />
        </div>

        {/* WhatsApp alternative */}
        <div className="mt-4 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 text-xs font-semibold hover:text-white transition-colors"
          >
            Ou fale direto
            <span className="bg-[#25D366] text-white text-[11px] font-bold px-3 py-1 rounded-full hover:bg-[#20bd5a] transition-colors">
              WhatsApp \u2192
            </span>
          </a>
        </div>
      </div>

      {/* Inline keyframe for glow-pulse */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,175,2,0.15); }
          50% { box-shadow: 0 0 40px rgba(255,175,2,0.25); }
        }
      `}</style>
    </section>
  );
}
