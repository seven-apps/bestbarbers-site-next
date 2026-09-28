import Image from "next/image";
import { Button } from "@/components/ui/button";
import { clubeV2Content } from "@/content/clube-v2";

interface HeroV2Props {
  onCtaClick: () => void;
}

/**
 * Herói da /clube-v2. Mesma moldura da home e da /clube (fundo #ffaf02, foto dos cinco
 * parceiros ancorada no canto inferior direito): a identidade do site é o que dá cara de
 * empresa. Muda só o texto — mecanismo em vez de promessa. originDesc: [Site-Clube-V2]BT-Hero.
 */
export function HeroV2({ onCtaClick }: HeroV2Props) {
  const { hero } = clubeV2Content;

  return (
    <section
      className="section-primary pt-32 pb-8 md:pb-12 lg:pb-0 flex justify-center items-end relative overflow-hidden"
      style={{ backgroundColor: "#ffaf02", borderBottomLeftRadius: 0 }}
    >
      <div className="container-custom relative">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-0 w-full lg:min-h-[460px]">
          <div className="w-full lg:w-[44%] flex flex-col justify-center items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left relative z-10 pb-8 md:pb-12 lg:pb-12">
            <h1 className="text-[28px] md:text-4xl lg:text-[34px] font-extrabold leading-tight text-neutral-bg2 max-w-lg lg:max-w-none">
              {hero.title.main}
              <span className="text-white">{hero.title.highlight}</span>
              <br />
              {hero.title.subtitle}
            </h1>

            <p className="text-medium font-medium leading-normal text-neutral-bg2">
              {hero.description}
            </p>

            <Button
              onClick={onCtaClick}
              className="min-h-[44px] h-auto text-sm font-bold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
              style={{ backgroundColor: "#121212", color: "#ffaf02" }}
            >
              {hero.cta.text}
            </Button>
          </div>

          <div className="w-full flex justify-center lg:justify-end -mb-8 md:-mb-12 lg:absolute lg:bottom-0 lg:-right-35 lg:mb-0">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              className="w-[550px] md:w-[70%] lg:w-[55vw] max-w-[900px] h-auto"
              style={{ display: "block" }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
