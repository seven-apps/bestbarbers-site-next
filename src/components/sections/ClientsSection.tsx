"use client";

import Image from "next/image";
import { CountUp } from "@/components/ui/motion";

interface ClientsSectionProps {
  onCtaClick?: () => void;
}

export function ClientsSection({ }: ClientsSectionProps) {

  // Logos da esteira. Ex-parceiro com uso de imagem revogado NÃO volta aqui: nem a
  // arte, nem o logo da barbearia dele — e nem o NOME DO ARQUIVO, que viaja na URL
  // e no HTML mesmo quando o pixel não tem texto nenhum. Um logo saiu em 19/Set/26.
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
  // desequilibrava a esteira sempre que um logo saía da lista.
  const meio = Math.ceil(allLogos.length / 2);
  const logosFileira1 = allLogos.slice(0, meio);
  const logosFileira2 = allLogos.slice(meio);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20 lg:py-24 w-full overflow-hidden">
      {/* Título com Count-up - CSS animation */}
      <div className="px-4 md:container-custom">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-normal text-neutral-black-text text-center">
            <span className="text-[#ffaf02] font-extrabold">
              Mais de <CountUp end={1200} duration={2} suffix="+" />
            </span>
            {" barbearias"}
            <br className="hidden md:block" />
            {" ativaram o modo Best!"}
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Junte-se às barbearias que já transformaram seus resultados
          </p>
        </div>
      </div>

      {/* Marquee de logos - Full width no mobile - CSS animations (GPU accelerated) */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden mb-8 md:mb-12 py-2">
        {/* Row 1 - Left to Right - 3 sets for seamless loop */}
        <div className="relative mb-4 md:mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            className="animate-marquee-left gpu-accelerated"
            style={{ '--marquee-duration': '25s' } as React.CSSProperties}
          >
            {[0, 1, 2].map((setIndex) => (
              <div key={setIndex} className="inline-flex gap-3 md:gap-6 items-center pr-3 md:pr-6">
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

        {/* Row 2 - Right to Left - 3 sets for seamless loop */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          <div
            className="animate-marquee-right gpu-accelerated"
            style={{ '--marquee-duration': '30s' } as React.CSSProperties}
          >
            {[0, 1, 2].map((setIndex) => (
              <div key={setIndex} className="inline-flex gap-3 md:gap-6 items-center pr-3 md:pr-6">
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
