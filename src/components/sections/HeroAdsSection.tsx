import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

interface HeroAdsSectionProps {
  onCtaClick?: () => void;
}

export function HeroAdsSection({ onCtaClick }: HeroAdsSectionProps) {
  const { hero } = homeContent;

  return (
    <section
      className="section-primary pt-32 pb-8 md:pb-12 lg:pb-12 flex justify-center items-end relative overflow-x-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom flex items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-16 w-full">
          {/* Conteúdo textual */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center items-center lg:items-start space-y-3 text-center lg:text-left order-first lg:order-first mb-8 lg:mb-0">
            <h1 className="text-2xl md:text-5xl lg:text-3xl font-extrabold leading-tight text-neutral-bg2 max-w-lg lg:max-w-none">
              Sua barbearia está crescendo, o dinheiro entrando...
            </h1>
            <h1 className="">
              <span className="text-white bg-black px-5 rounded-md font-extrabold text-4xl">{"Mas seu lucro"}</span>
              <br />
              <span className="text-white bg-black px-5 rounded-md font-extrabold text-4xl">{"não aumenta "}</span>
            </h1>
            <p className="text-medium font-bold leading-normal text-neutral-bg2 ">
              Não é sobre atender mais clientes. É sobre ganhar mais dinheiro e lucrar mais, com a barbearia que você já tem.
            </p>
            <p className="text-sm font-medium leading-normal text-neutral-bg2 ">
              O BestBarbers ajuda barbearias a organizarem a gestão, criarem novas fontes de receita e transformarem faturamento em lucro real.
            </p>

            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className="text-sm font-extrabold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                style={{ backgroundColor: "#02ab15", color: "#ffffff" }}
              >
                QUERO GANHAR MAIS COM A MINHA BARBEARIA
              </Button>
            ) : (
              <Button
                asChild
                className="text-sm font-bold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                style={{ backgroundColor: "#121212", color: "#ffaf02" }}
              >
                <Link
                  href={hero.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hero.cta.text}
                </Link>
              </Button>
            )}
          </div>

          {/* Video do YouTube */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-last lg:order-last mb-8 lg:mb-0">
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
              <iframe
                src="https://www.youtube.com/embed/ZnicnaPdui0?autoplay=1&mute=1&loop=1&playlist=ZnicnaPdui0&rel=0"
                title="Best Barbers"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
