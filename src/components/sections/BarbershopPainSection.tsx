"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";

interface BarbershopPainSectionProps {
  onCtaClick?: () => void;
}

export function BarbershopPainSection({ onCtaClick }: BarbershopPainSectionProps) {
  const { subscriptions } = homeContent;

  const scrollToNextSection = () => {
    const growthSection = document.getElementById("growth-section");
    if (growthSection) {
      growthSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="bg-[#fafafa] py-12 md:py-16 lg:py-20 flex justify-center items-center overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Mockup da imagem - desktop */}
          <div className="hidden lg:block lg:w-[45%] animate-fade-in-up">
            <Image
              src={subscriptions.image.src}
              alt={subscriptions.image.alt}
              width={subscriptions.image.width}
              height={subscriptions.image.height}
              className="w-full h-auto max-w-[500px] drop-shadow-xl"
              sizes="(max-width: 1200px) 50vw, 500px"
              loading="lazy"
            />
          </div>

          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full lg:w-[55%] space-y-4 text-center lg:text-left order-first lg:order-last">
            <h2 className="text-2xl md:text-3xl lg:text-[36px] font-bold leading-[1.2] text-neutral-black-text animate-fade-in-up">
              Sabe por que o faturamento da sua barbearia cresce,{" "}
              <span className="text-[#ffaf02]">mas o lucro não acompanha?</span>
            </h2>

            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-neutral-black-text font-bold text-base md:text-lg leading-relaxed">
                Porque a maioria das barbearias cresce tentando atender mais clientes — e não estruturando a gestão e novas formas de ganhar mais com quem já atende.
              </p>

              <p className="text-gray-500 font-normal text-sm md:text-base leading-relaxed">
                Sem gestão clara, controle financeiro e fontes de receita recorrente, o crescimento vira volume — não lucro. O dinheiro entra, gira, paga custos… e no fim sobra pouco para o dono.
              </p>
            </div>

            {/* Bullet points visuais */}
            <div className="flex flex-nowrap gap-1.5 sm:gap-2 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {["Gestão estruturada", "Receita recorrente", "Lucro real"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#ffaf02]/10 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold text-[#121212] border border-[#ffaf02]/20 whitespace-nowrap"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ffaf02]" />
                  {item}
                </span>
              ))}
            </div>

            <div className="pt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CTAButton
                onClick={scrollToNextSection}
                variant="secondary"
                size="md"
                icon={true}
              >
                QUERO SABER COMO LUCRAR MAIS
              </CTAButton>
            </div>
          </div>

          {/* Mockup da imagem - mobile */}
          <div className="lg:hidden w-full flex justify-center order-last mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Image
              src={subscriptions.image.src}
              alt={subscriptions.image.alt}
              width={subscriptions.image.width}
              height={subscriptions.image.height}
              className="w-full h-auto max-w-[400px] drop-shadow-lg"
              sizes="(max-width: 768px) 90vw, 400px"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
