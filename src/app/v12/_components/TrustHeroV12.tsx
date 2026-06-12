"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";

const influencerHandles = [
  "@omilenorocha",
  "@joaoseletto",
  "@o_kaique_alves",
  "@thaisdantbarber",
  "@henriquedaniels",
];

const allLogos = [
  "/images/Rapha_2.webp",
  "/images/Sr-Barbearia.webp",
  "/images/Premium.webp",
  "/images/Black-House.webp",
  "/images/Spartano.webp",
  "/images/James.webp",
  "/images/Ferrari.webp",
  "/images/Sr-Freitas.webp",
  "/images/Kadosh.webp",
  "/images/Vicente.webp",
  "/images/Camilos.webp",
  "/images/Igor.webp",
  "/images/Capitao.webp",
  "/images/Cia-da-Barba.webp",
  "/images/Casa-77.webp",
  "/images/Fernandes.webp",
  "/images/Gabriel.webp",
  "/images/Irmandade.webp",
  "/images/JR.webp",
];

interface TrustHeroV12Props {
  onCtaClick?: () => void;
}

export function TrustHeroV12({ onCtaClick }: TrustHeroV12Props) {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      <div className="container-custom relative z-10 space-y-12 md:space-y-16">

        {/* CAMADA 1 — "Quem já entendeu" */}
        <div className="text-center animate-fade-in-up">
          <p
            className="text-[18px] md:text-xl uppercase tracking-[0.25em] font-bold mb-6"
            style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
          >
            Eles já tinham o melhor da cidade
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Image
              src="/images/hero-best-5-influencers.png"
              alt="Mileno Rocha, João Seletto, Kaique Alves, Thaís D'Ant e Rapha — barbeiros parceiros BestBarbers"
              width={600}
              height={244}
              sizes="(max-width: 768px) 100vw, 600px"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Handles */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4">
            {influencerHandles.map((handle) => (
              <span
                key={handle}
                className="text-[11px] md:text-[13px] font-semibold"
                style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
              >
                {handle}
              </span>
            ))}
          </div>

          {/* Resultado */}
          <p
            className="text-xl md:text-2xl font-bold mt-8"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
          >
            Agora têm os dados para provar.{" "}
            <span style={{ color: "#ebad04" }}>+2.000 assinantes só entre eles.</span>
          </p>
          <p
            className="text-lg md:text-xl mt-3 font-medium mb-10"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
          >
            E você?
          </p>

          {/* CTA Adicionado */}
          <div className="flex justify-center mb-16">
            <CTAButton
              onClick={onCtaClick}
              variant="secondary"
              size="lg"
              icon={true}
            >
              QUERO VER QUANTO POSSO FATURAR
            </CTAButton>
          </div>
        </div>

        {/* CAMADA 2 — Marquee logos */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p
            className="text-center text-[12px] md:text-[13px] uppercase tracking-[0.2em] font-semibold mb-8"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
          >
            +1.200 barbearias confiam
          </p>

          {/* Linha 1 — esquerda para direita */}
          <div className="relative w-full overflow-hidden mb-4 md:mb-5">
            <div
              className="absolute left-0 top-0 bottom-0 w-8 md:w-20 z-10"
              style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-8 md:w-20 z-10"
              style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }}
            />

            <div
              className="animate-marquee-left gpu-accelerated"
              style={{ "--marquee-duration": "25s" } as React.CSSProperties}
            >
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="inline-flex gap-3 md:gap-5 items-center pr-3 md:pr-5">
                  {allLogos.slice(0, 10).map((logo, index) => (
                    <div
                      key={`row1-${setIndex}-${index}`}
                      className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl p-2 md:p-3"
                      style={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      <Image
                        src={logo}
                        alt=""
                        width={112}
                        height={112}
                        sizes="(max-width: 768px) 80px, 112px"
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Linha 2 — direita para esquerda */}
          <div className="relative w-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-8 md:w-20 z-10"
              style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-8 md:w-20 z-10"
              style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }}
            />

            <div
              className="animate-marquee-right gpu-accelerated"
              style={{ "--marquee-duration": "30s" } as React.CSSProperties}
            >
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="inline-flex gap-3 md:gap-5 items-center pr-3 md:pr-5">
                  {allLogos.slice(10).map((logo, index) => (
                    <div
                      key={`row2-${setIndex}-${index}`}
                      className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl p-2 md:p-3"
                      style={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      <Image
                        src={logo}
                        alt=""
                        width={112}
                        height={112}
                        sizes="(max-width: 768px) 80px, 112px"
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
