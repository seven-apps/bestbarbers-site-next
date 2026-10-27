import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

/**
 * Botão do herói com cara de botão (André, 27/Out/26): uma linha, letra normal e maior, seta, sombra e altura de
 * toque; no celular quase da largura da tela. `h-auto` porque o Button do shadcn fixa a altura e esmagava o texto.
 */
const CLASSE_BOTAO =
  "h-auto w-full max-w-sm lg:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-extrabold shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-transform hover:scale-[1.02] active:scale-[0.98]";
const ESTILO_BOTAO = { backgroundColor: "#121212", color: "#ffffff" } as const;

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const { hero } = homeContent;

  return (
    <section
      className="section-primary pt-32 pb-8 md:pb-12 lg:pb-0 flex justify-center items-end relative overflow-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom relative">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-0 w-full lg:min-h-[420px]">
          {/* Conteúdo textual */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left relative z-10 pb-8 md:pb-12 lg:pb-12">
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-extrabold leading-tight text-neutral-bg2 max-w-lg lg:max-w-none">
              {hero.title.main}
              <span className="text-white">{hero.title.highlight}</span>
              <br />
              {hero.title.subtitle}
            </h1>

            <p className="text-medium font-medium leading-normal text-neutral-bg2 ">
              {hero.description}
            </p>

            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className={CLASSE_BOTAO}
                style={ESTILO_BOTAO}
              >
                {hero.cta.text}
                <ArrowRight className="w-5 h-5" style={{ color: "#ffaf02" }} />
              </Button>
            ) : (
              <Button
                asChild
                className={CLASSE_BOTAO}
                style={ESTILO_BOTAO}
              >
                <Link
                  href={hero.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hero.cta.text}
                  <ArrowRight className="w-5 h-5" style={{ color: "#ffaf02" }} />
                </Link>
              </Button>
            )}
          </div>

          {/* Mockup da imagem - Mobile Last */}
          <div className="w-full flex justify-center lg:justify-end -mb-8 md:-mb-12 lg:absolute lg:bottom-0 lg:-right-35 lg:mb-0">
            {/* A arte do herói é trocável. `h-auto` deriva a altura dos width/height
                declarados em content/home.ts, então arte com proporção diferente da
                declarada entrava esticada — `object-contain` impede isso. */}
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              className="w-[550px] md:w-[70%] lg:w-[55vw] max-w-[900px] h-auto object-contain"
              style={{ display: "block" }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
