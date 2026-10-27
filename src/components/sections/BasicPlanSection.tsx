import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";
import { BOTAO_AMARELO, BOTAO_PRETO, CLASSE_BOTAO_CHAMADA, SetaDoBotao } from "@/components/ui/botao-chamada";

export function BasicPlanSection() {
  const { basicPlan } = homeContent;

  return (
    <section className="bg-white py-12 md:py-16 lg:section-padding flex justify-center items-center overflow-x-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-16">
          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 space-y-4 md:space-y-5 text-center lg:text-left order-first lg:order-first">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight text-neutral-black-text max-w-lg lg:max-w-none">
              {basicPlan.title.main}
              <span className="text-primary" style={{ color: "#ffaf02" }}>
                {basicPlan.title.highlight}
              </span>
              {basicPlan.title.subtitle}
            </h2>

            <div className="text-base md:text-lg lg:text-base font-medium text-neutral-black-text whitespace-pre-line max-w-lg lg:max-w-none">
              {basicPlan.description}
            </div>

            <Button
              asChild
              className={`${CLASSE_BOTAO_CHAMADA} mt-6`}
              style={BOTAO_AMARELO}
            >
              <Link
                href={basicPlan.cta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {basicPlan.cta.text}
                <SetaDoBotao cor="#121212" />
              </Link>
            </Button>
          </div>

          {/* Mockup da imagem */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end order-last lg:order-last mt-6 lg:mt-0">
            <Image
              src={basicPlan.image.src}
              alt={basicPlan.image.alt}
              width={basicPlan.image.width}
              height={basicPlan.image.height}
              className="w-full h-auto max-w-[90%] md:max-w-[85%] lg:max-w-full object-contain"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
