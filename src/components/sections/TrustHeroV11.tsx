"use client";

import Image from "next/image";

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
  "/images/Kadosh.webp",
];

export function TrustHeroV11() {
  return (
    <section className="relative bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-8 md:py-10 overflow-hidden border-y border-white/5">
      {/* Glow ambiente */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#ffaf02]/[0.04] blur-[120px] rounded-full" />
      </div>

      <div className="container-custom relative z-10 space-y-6 md:space-y-8">
        {/* CAMADA 1 — Influencers parceiros (autoridade aspiracional) */}
        <div className="text-center animate-fade-in-up">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-[#ffaf02] mb-4">
            Validado por barbeiros de referência
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Image
              src="/images/hero-best-5-influencers.png"
              alt="Mileno Rocha, João Seletto, Kaique Bagulho, Thaís D'Antunes e Rapha — barbeiros parceiros BestBarbers"
              width={600}
              height={244}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3 md:mt-4">
            {influencerHandles.map((handle) => (
              <span
                key={handle}
                className="text-[10px] md:text-xs font-semibold text-gray-400"
              >
                {handle}
              </span>
            ))}
          </div>

          <p className="text-sm md:text-base text-white font-bold mt-3 md:mt-4">
            Mais de <span className="text-[#ffaf02]">2.000 assinantes</span> só entre eles. <span className="text-gray-400 font-medium">E você?</span>
          </p>
        </div>

        {/* CAMADA 2 — Marquee 2 linhas (escala "muitas barbearias") */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-center text-[11px] md:text-xs uppercase tracking-[0.18em] font-semibold text-gray-500 mb-4">
            +1.200 barbearias confiam
          </p>

          {/* Linha 1 — esquerda → direita */}
          <div className="relative w-full overflow-hidden mb-3 md:mb-5">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

            <div
              className="animate-marquee-left gpu-accelerated"
              style={{ "--marquee-duration": "25s" } as React.CSSProperties}
            >
              {[0, 1, 2].map((setIndex) => (
                <div key={setIndex} className="inline-flex gap-3 md:gap-5 items-center pr-3 md:pr-5">
                  {allLogos.slice(0, 10).map((logo, index) => (
                    <div
                      key={`row1-${setIndex}-${index}`}
                      className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm p-2 md:p-3"
                    >
                      <Image
                        src={logo}
                        alt={`Cliente BestBarbers ${index + 1}`}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Linha 2 — direita → esquerda */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

            <div
              className="animate-marquee-right gpu-accelerated"
              style={{ "--marquee-duration": "30s" } as React.CSSProperties}
            >
              {[0, 1, 2].map((setIndex) => (
                <div key={setIndex} className="inline-flex gap-3 md:gap-5 items-center pr-3 md:pr-5">
                  {allLogos.slice(10).map((logo, index) => (
                    <div
                      key={`row2-${setIndex}-${index}`}
                      className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm p-2 md:p-3"
                    >
                      <Image
                        src={logo}
                        alt={`Cliente BestBarbers ${index + 11}`}
                        width={128}
                        height={128}
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
