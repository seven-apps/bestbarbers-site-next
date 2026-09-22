"use client";

import Image from "next/image";
import { CountUp } from "@/components/ui/motion";
import { clubeContent } from "@/content/clube";

/**
 * Clone da ClientsSection da homepage para /clube.
 * CountUp em 51.000+ assinantes + linha de agregados oficiais;
 * marquee de logos igual ao da home.
 */
export function ClientesClube() {
  const { clients } = clubeContent;

  // Logos de clientes na esteira. Barbearia de ex-parceiro com uso de imagem revogado
  // NÃO volta aqui: nem o logo, nem o nome do arquivo (que viaja na URL e no HTML).
  // Mesma régua escrita em `src/app/v12/_components/TrustHeroV12.tsx`.
  // Saiu em 19/Set/26: `/images/Rapha_2.webp` — a marca da barbearia do banido
  // (círculo azul, "R" turquesa). A v12 já tinha tirado; a /clube tinha ficado para trás.
  const allLogos = [
    "/images/Barber-Style.webp",
    "/images/Sr-Barbearia.webp",
    "/images/Premium.webp",
    "/images/Black-House.webp",
    "/images/James.webp",
    "/images/Ferrari.webp",
    "/images/T.webp",
    "/images/Spartano.webp",
    "/images/Sr-Freitas.webp",
    "/images/Seu-Oziel.webp",
    "/images/Vicente.webp",
    "/images/R.webp",
    "/images/o.webp",
    "/images/Camilos.webp",
    "/images/Sr-Joao.webp",
    "/images/Kadosh.webp",
    "/images/Igor.webp",
    "/images/Urus.webp",
    "/images/Vitor.webp",
  ];

  // As duas fileiras se dividem pelo tamanho real do array — o corte fixo em 10
  // desequilibrava a esteira sempre que um logo saía da lista. Mesma régua já
  // aplicada no clone da home (`src/components/sections/ClientsSection.tsx`).
  const meio = Math.ceil(allLogos.length / 2);
  const logosFileira1 = allLogos.slice(0, meio);
  const logosFileira2 = allLogos.slice(meio);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20 lg:py-24 w-full overflow-hidden">
      {/* Título com Count-up */}
      <div className="px-4 md:container-custom">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-normal text-neutral-black-text text-center">
            <span className="text-[#ffaf02] font-extrabold">
              Mais de <CountUp end={clients.countUp} duration={2} suffix="+" />
              {clients.titleAfterCount}
            </span>
            {clients.titleMiddle}
            <br className="hidden md:block" />
            {clients.titleEnd}
          </h2>
          <p
            className="text-gray-500 mt-3 text-sm md:text-base animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {clients.subline}
          </p>
        </div>
      </div>

      {/* Marquee de logos - CSS animations (GPU accelerated) */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden mb-8 md:mb-12 py-2">
        {/* Row 1 - Left to Right */}
        <div className="relative mb-4 md:mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            className="animate-marquee-left gpu-accelerated"
            style={{ "--marquee-duration": "25s" } as React.CSSProperties}
          >
            {[0, 1, 2].map((setIndex) => (
              <div
                key={setIndex}
                className="inline-flex gap-3 md:gap-6 items-center pr-3 md:pr-6"
              >
                {logosFileira1.map((logo, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-2 md:p-3"
                  >
                    <Image
                      src={logo}
                      alt={`Logo barbearia ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          <div
            className="animate-marquee-right gpu-accelerated"
            style={{ "--marquee-duration": "30s" } as React.CSSProperties}
          >
            {[0, 1, 2].map((setIndex) => (
              <div
                key={setIndex}
                className="inline-flex gap-3 md:gap-6 items-center pr-3 md:pr-6"
              >
                {logosFileira2.map((logo, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-2 md:p-3"
                  >
                    <Image
                      src={logo}
                      alt={`Logo barbearia ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
