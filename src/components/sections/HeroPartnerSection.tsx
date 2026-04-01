"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";
import { useMemo } from "react";
import type { StaticImageData } from "next/image";

// Import partner images
import raphaImg from "@/app/parceiros/assets/rapha.png";
import santiagoImg from "@/app/parceiros/assets/santiago.png";
import maurilioImg from "@/app/parceiros/assets/maurilio-sr-bigode.png";
import gabrielImg from "@/app/parceiros/assets/gabriel-gordovisk.png";
import edsonImg from "@/app/parceiros/assets/edson-lapa.png";
import milenoImg from "@/app/parceiros/assets/mileno.png";
import henriqueImg from "@/app/parceiros/assets/henrique.png";
import kaleoImg from "@/app/parceiros/assets/kaleo.png";
import araujoSalvianoImg from "@/app/parceiros/assets/araujo-salviano.png";
import brunoEstevaoImg from "@/app/parceiros/assets/bruno-estevao.png";
import jamesImg from "@/app/parceiros/assets/james.png";
import igorBezerraImg from "@/app/parceiros/assets/igor-bezerra.png";
import kaiqueAlvesImg from "@/app/parceiros/assets/kaique-alves.png";
import thaisDantunesImg from "@/app/parceiros/assets/thais-dantunes.png";
import davidChampsImg from "@/app/parceiros/assets/david-champs.png";
import gladstoneImg from "@/app/parceiros/assets/gladstone.png";


interface HeroPartnerSectionProps {
  onCtaClick?: () => void;
  source?: string | null;
}

export function HeroPartnerSection({
  onCtaClick,
  source,
}: HeroPartnerSectionProps) {
  const { hero } = homeContent;

  // Map source to partner images
  const imageMap: Record<string, StaticImageData> = useMemo(() => ({
    rapha: raphaImg,
    santiago: santiagoImg,
    "maurilio-sr-bigode": maurilioImg,
    "gabriel-gordovisk": gabrielImg,
    "edson-lapa": edsonImg,
    mileno: milenoImg,
    "henrique-daniels": henriqueImg,
    kaleo: kaleoImg,
    "araujo-salviano": araujoSalvianoImg,
    "bruno-estevao": brunoEstevaoImg,
    james: jamesImg,
    "igor-bezerra": igorBezerraImg,
    "kaique-alves": kaiqueAlvesImg,
    "thais-dantunes": thaisDantunesImg,
    "david-champs": davidChampsImg,
    gladstone: gladstoneImg,
  }), []);

  const isPartnerImage = !!(source && imageMap[source]);
  const displayImage = isPartnerImage ? imageMap[source!] : hero.image.src;

  return (
    <section
      className="section-primary pt-32 pb-8 md:pb-12 lg:pb-0 flex justify-center items-end relative overflow-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom relative">
        <div className={`flex flex-col lg:flex-row justify-between gap-0 w-full ${isPartnerImage ? 'items-center lg:gap-16' : 'items-end lg:min-h-[420px]'}`}>
          {/* Conteúdo textual */}
          <div className={`flex flex-col justify-center items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left relative z-10 ${isPartnerImage ? 'w-full lg:w-1/2 order-first mb-8 lg:mb-0 pb-0' : 'w-full lg:w-[35%] pb-8 md:pb-12 lg:pb-12'}`}>
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
                className="text-sm font-bold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                style={{ backgroundColor: "#121212", color: "#ffaf02" }}
              >
                {hero.cta.text}
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

          {/* Mockup da imagem */}
          {isPartnerImage ? (
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-last -mb-8 lg:-mb-12">
              <div className="relative w-full max-w-[100%] md:max-w-[95%] lg:max-w-full">
                <Image
                  src={displayImage}
                  alt={hero.image.alt}
                  width={hero.image.width}
                  height={hero.image.height}
                  className="w-full h-auto max-h-[65vh] md:max-h-[70vh] lg:max-h-[605px] object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center lg:justify-end -mb-8 md:-mb-12 lg:absolute lg:bottom-0 lg:-right-35 lg:mb-0">
              <Image
                src={displayImage}
                alt={hero.image.alt}
                width={hero.image.width}
                height={hero.image.height}
                className="w-[550px] md:w-[70%] lg:w-[55vw] max-w-[900px] h-auto"
                style={{ display: "block" }}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
