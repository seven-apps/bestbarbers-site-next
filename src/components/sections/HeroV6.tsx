"use client";

import { useMemo, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useUtmParams, useWhatsAppRedirect } from "@/hooks";
import { getVariant } from "@/data/lp-variants";
import { MultiStepForm } from "./MultiStepForm";

export function HeroV6() {
  const { getUtmParams } = useUtmParams();
  const { generateWhatsAppLink } = useWhatsAppRedirect();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const utmContent = useMemo(
    () => (mounted ? getUtmParams().utm_content : null),
    [mounted, getUtmParams]
  );
  const variant = useMemo(() => getVariant(utmContent), [utmContent]);
  const whatsappLink = useMemo(
    () => (mounted ? generateWhatsAppLink() : "#"),
    [mounted, generateWhatsAppLink]
  );

  return (
    <section
      id="hero-section"
      className="relative pt-20 md:pt-24 lg:pt-28 pb-10 md:pb-16 lg:pb-20 flex justify-center items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ffaf02 0%, #ffbe33 50%, #ffaf02 100%)",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />

      <div className="container-custom relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* LEFT — Copy */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/90 rounded-full text-white text-xs md:text-sm font-bold shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#ffaf02]" />
                {variant.hero.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[24px] md:text-[32px] lg:text-[40px] font-extrabold leading-[1.15] text-neutral-bg2 mb-3">
              {variant.hero.headline}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black/90 to-black/70">
                {variant.hero.highlight}
              </span>
            </h1>

            {/* Sub */}
            <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold leading-relaxed text-neutral-bg2/90 max-w-xl mb-4">
              {variant.hero.sub}
            </p>

            {/* Trust pills — horizontal scroll on mobile */}
            <div className="flex justify-center lg:justify-start gap-1.5 mb-5 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {["R$0 implantacao", "3 assinantes pagam", "Gerente dedicado"].map((text) => (
                <span key={text} className="flex-shrink-0 text-white bg-black/80 px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap">
                  {text}
                </span>
              ))}
            </div>

            {/* Trust line — desktop only */}
            <p className="hidden lg:block text-neutral-bg2/70 text-xs font-semibold">
              {variant.hero.trustLine}
            </p>
          </div>

          {/* RIGHT — Multi-step Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <MultiStepForm
              ctaText="VER MEU DIAGNOSTICO GRATUITO"
              formLocation="hero"
            />

            {/* WhatsApp alternative */}
            <div className="mt-3 text-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neutral-bg2/80 text-xs font-semibold hover:text-white transition-colors"
              >
                Prefere falar direto?
                <span className="bg-[#25D366] text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-[#20bd5a] transition-colors">
                  WhatsApp →
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Trust line — mobile only */}
        <p className="lg:hidden text-center text-neutral-bg2/70 text-xs font-semibold mt-6">
          {variant.hero.trustLine}
        </p>
      </div>
    </section>
  );
}
