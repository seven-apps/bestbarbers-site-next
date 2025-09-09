"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";
import { useState, useEffect } from "react";

export function ClientsSection() {
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
      "/images/Ferrari.webp"
    ],
    [
      "/images/T.webp",
      "/images/Spartano.webp",
      "/images/Sr-Freitas.webp",
      "/images/Seu-Oziel.webp",
      "/images/Vicente.webp",
      "/images/R.webp",
      "/images/o.webp"
    ],
    [
      "/images/Camilos.webp",
      "/images/Sr-Joao.webp",
      "/images/Kadosh.webp",
      "/images/Igor.webp",
      "/images/Vicente.webp",
      "/images/Urus.webp",
      "/images/Vitor.webp"
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
    <section className="bg-white section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center w-full space-y-12">
          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-medium leading-normal text-neutral-black-text text-center">
              <span className="text-primary font-bold">{clients.title.highlight}</span>
              {clients.title.main}
            </h2>
          </div>

          {/* Slider de logos - Desktop */}
          <div className="hidden lg:block w-full max-w-6xl overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {logoGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex justify-center items-center space-x-8 w-full flex-shrink-0">
                  {group.map((logo, logoIndex) => (
                    <div key={logoIndex} className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                      <Image
                        src={logo}
                        alt={`Logo barbearia ${logoIndex + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Grid de logos - Mobile */}
          <div className="lg:hidden grid grid-cols-3 gap-6 w-full max-w-sm">
            {logoGroups[0].slice(0, 6).map((logo, index) => (
              <div key={index} className="w-16 h-16 flex items-center justify-center">
                <Image
                  src={logo}
                  alt={`Logo barbearia ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            ))}
          </div>

          {/* Indicadores do slider - Desktop */}
          <div className="hidden lg:flex justify-center space-x-2 mt-6">
            {logoGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-neutral-grey"
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-2">
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-6 py-4 rounded-2xl transition-colors hover:bg-primary-hover"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={clients.cta.href} target="_blank" rel="noopener noreferrer">
                {clients.cta.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
