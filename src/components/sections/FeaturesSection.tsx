"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";

interface FeaturesSectionProps {
  onCtaClick?: () => void;
}

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { features } = homeContent;

  return (
    <section
      className="py-20 md:py-32 overflow-hidden border-b border-white/5"
      style={{ background: "#0a0a0a" }}
    >
      <div className="px-4 md:container-custom">
        {/* Título estilo V12 */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <span 
            className="inline-block px-4 py-1.5 bg-[#ebad04]/10 rounded-full text-[#ebad04] text-[11px] md:text-xs font-bold mb-4 border border-[#ebad04]/20 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Funcionalidades
          </span>
          <h2 
            className="leading-[1.1] tracking-tight text-white mb-4"
            style={{ fontFamily: "var(--font-vollkorn)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800 }}
          >
            Funcionalidades do Sistema para Barbearia
          </h2>
          <p 
            className="text-sm md:text-base text-white/50 mt-2 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Tudo que sua barbearia precisa em um só lugar, com design premium e alta performance.
          </p>
        </div>
      </div>

      {/* Carrossel estilo V12 */}
      <div className="w-full max-w-[1400px] mx-auto overflow-hidden relative">
        <div className="relative">
          {/* Gradients fade estilo V12 */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div
            className="py-4 items-center animate-marquee-left gpu-accelerated flex whitespace-nowrap"
            style={{ '--marquee-duration': '40s' } as React.CSSProperties}
          >
            {[0, 1, 2].map((setIndex) => (
              <div key={setIndex} className="inline-flex gap-4 md:gap-6 items-center pr-4 md:pr-6">
                {features.items.map((item, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center text-center gap-4 p-6 bg-white/[0.02] border border-white/10 rounded-3xl transition-all duration-500 hover:bg-white/[0.05] hover:border-[#ebad04]/30 hover:scale-[1.02] group w-[140px] h-[130px] md:w-[180px] md:h-[170px]"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                      <Image
                        src={item.icon}
                        alt={`Ícone ${item.title}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <p 
                      className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest px-1 group-hover:text-[#ebad04] transition-colors"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button estilo V12 */}
      <div className="flex justify-center mt-12 md:mt-20 px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="animate-pulse-glow">
          <CTAButton
            onClick={onCtaClick}
            variant="secondary"
            size="lg"
            icon={true}
            className="w-full sm:w-auto !text-[15px] !py-5 !px-10"
          >
            QUERO UM APP PRÓPRIO
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
