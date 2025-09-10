import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function HeroSection() {
  const { hero } = homeContent;

  return (
    <section className="section-primary pt-24 pb-12 flex justify-center items-end relative" style={{ backgroundColor: "#ffaf02" }}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-start w-full lg:w-1/2 space-y-2">
            <h1 className="text-4xl lg:text-4xl font-extrabold leading-tight text-neutral-bg2">
              {hero.title.main}
              <span className="text-white">{hero.title.highlight}</span>
              <br />
              {hero.title.subtitle}
            </h1>

            <p className="text-sm lg:text-sm font-medium leading-normal text-neutral-bg2 w-[90%]">
              {hero.description}
            </p>

            <Button
              asChild
              className="text-xs font-bold leading-tight px-6 py-6 rounded-2xl mt-3 whitespace-pre-line text-center"
              style={{ backgroundColor: '#121212', color: '#ffaf02' }}
            >
              <Link href={hero.cta.href} target="_blank" rel="noopener noreferrer">
                {hero.cta.text}
              </Link>
            </Button>
          </div>

          {/* Mockup da imagem */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end" style={{ marginBottom: -48 }}>
            <div className="relative max-w-[88%] lg:max-w-full">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={hero.image.width}
                height={hero.image.height}
                className="w-full h-auto max-h-[605px] object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 88vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
