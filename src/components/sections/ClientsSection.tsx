"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";
import { useState, useEffect } from "react";

export function ClientsSection({ onCtaClick }: ClientsSectionProps) {
  interface ClientsSectionProps {
    onCtaClick?: () => void;
  }
  const { clients } = homeContent;

  // Logos organizados em grupos para o slider
  const logoGroups = [
    [
      "/images/Barber-Style.webp",
      "/images/Sr-Barbearia.webp",
      "/images/Premium.webp",
      "/images/Rapha_2.webp",
      "/images/Black-House.webp",
      "/images/James.webp",
      "/images/Ferrari.webp",
    ],
    [
      "/images/T.webp",
      "/images/Spartano.webp",
      "/images/Sr-Freitas.webp",
      "/images/Seu-Oziel.webp",
      "/images/Vicente.webp",
      "/images/R.webp",
      "/images/o.webp",
    ],
    [
      "/images/Camilos.webp",
      "/images/Sr-Joao.webp",
      "/images/Kadosh.webp",
      "/images/Igor.webp",
      "/images/Vicente.webp",
      "/images/Urus.webp",
      "/images/Vitor.webp",
    ],
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % logoGroups.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [logoGroups.length]);

  return (
    <section className="bg-white py-12 md:py-16 lg:py-12 flex justify-center items-center w-[100%]">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center w-full space-y-8 md:space-y-10 lg:space-y-12">
          {/* Título */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium leading-normal text-neutral-black-text text-center">
              <span className="text-primary font-bold">
                {clients.title.highlight}
              </span>
              {clients.title.main}
            </h2>
          </div>

          {/* Slider de logos - Desktop */}
          <div className="hidden lg:block overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {logoGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex justify-center items-center space-x-8 w-full flex-shrink-0"
                >
                  {group.map((logo, logoIndex) => (
                    <div
                      key={logoIndex}
                      className="w-20 h-20 lg:w-28 lg:h-28 flex items-center justify-center"
                    >
                      <Image
                        src={logo}
                        alt={`Logo barbearia ${logoIndex + 1}`}
                        width={180}
                        height={180}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Slider de logos - Mobile (4 por vez) */}
          <div className="lg:hidden overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {logoGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex justify-center items-center space-x-6 w-full flex-shrink-0"
                >
                  {group.slice(0, 4).map((logo, logoIndex) => (
                    <div
                      key={logoIndex}
                      className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                    >
                      <Image
                        src={logo}
                        alt={`Logo barbearia ${logoIndex + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-2">
            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className="btn-primary text-xs font-bold leading-tight px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-colors hover:bg-primary-hover"
                style={{ backgroundColor: "#ffaf02", color: "#121212" }}
              >
                {clients.cta.text}
              </Button>
            ) : (
              <Button
                asChild
                className="btn-primary text-xs font-bold leading-tight px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-colors hover:bg-primary-hover"
                style={{ backgroundColor: "#ffaf02", color: "#121212" }}
              >
                <Link
                  href={clients.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {clients.cta.text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
