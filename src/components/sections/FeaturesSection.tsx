"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";

interface FeaturesSectionProps {
  onCtaClick?: () => void;
}

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { features } = homeContent;

  // Duplicate items for infinite scroll effect
  const duplicatedItems = [...features.items, ...features.items];

  return (
    <section
      className="pt-6 md:pt-8 pb-12 md:pb-14 lg:pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #ffaf02 0%, #ffbe33 100%)"
      }}
    >
      <div className="px-4 md:container-custom">
        {/* Título - CSS animation */}
        <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-black/10 rounded-full text-neutral-bg2 text-xs md:text-sm font-bold mb-3">
            FUNCIONALIDADES
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-bg2">
            E muito mais!
          </h2>
          <p className="text-sm md:text-base text-neutral-bg2/80 mt-2 max-w-md mx-auto">
            Tudo que sua barbearia precisa em um só lugar
          </p>
        </div>
      </div>

      {/* Carrossel container - full width no mobile */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden">
        <div className="relative">
          {/* Gradient fade esquerda */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#ffaf02] to-transparent z-10 pointer-events-none" />

          {/* Gradient fade direita */}
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#ffbe33] to-transparent z-10 pointer-events-none" />

          {/* Carousel track - CSS animation (GPU accelerated) */}
          <div
            className="flex gap-3 md:gap-4 py-8 items-center animate-marquee-left gpu-accelerated"
            style={{ '--marquee-duration': '10s' } as React.CSSProperties}
          >
            {duplicatedItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center justify-center text-center gap-2.5 md:gap-3.5 p-4 md:p-5 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 w-[130px] h-[120px] md:w-[170px] md:h-[160px] border border-white/50 cursor-pointer group"
              >
                <div className="w-11 h-11 md:w-14 md:h-14 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={`Ícone ${item.title}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] md:text-sm font-bold text-neutral-black-text leading-tight px-1 group-hover:text-[#121212] transition-colors">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button - CSS animation */}
      <div className="flex justify-center mt-10 md:mt-12 px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Pulse animation wrapper using CSS (GPU accelerated) */}
        <div className="rounded-full animate-pulse-glow-subtle">
          {onCtaClick ? (
            <CTAButton
              onClick={onCtaClick}
              variant="secondary"
              size="md"
              icon={true}
              className="!shadow-[0_8px_30px_rgba(2,171,21,0.4)]"
            >
              QUERO UM APP PRÓPRIO
            </CTAButton>
          ) : (
            <CTAButton
              href={features.cta.href}
              variant="secondary"
              size="md"
              icon={true}
              className="!shadow-[0_8px_30px_rgba(2,171,21,0.4)]"
            >
              QUERO UM APP PRÓPRIO
            </CTAButton>
          )}
        </div>
      </div>
    </section>
  );
}
