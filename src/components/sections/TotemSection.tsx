import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

interface TotemSectionProps {
  onCtaClick?: () => void;
}

export function TotemSection({ onCtaClick }: TotemSectionProps) {
  const { totem } = homeContent;

  return (
    <section className="section-dark py-0 lg:section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-16">
          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 space-y-4 md:space-y-5 text-center lg:text-left order-first lg:order-first">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight text-white max-w-lg lg:max-w-none">
              {totem.title.main}
              <br />
              <span className="text-primary font-bold" style={{ color: '#ffaf02' }}>{totem.title.highlight}</span>
            </h2>
            
            <div className="space-y-4 mt-4 max-w-lg lg:max-w-none">
              {totem.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 md:space-x-4 text-left">
                  <div className="flex-shrink-0 mt-1">
                    <Image
                      src="/images/CIRCULO-VERDE_1CIRCULO VERDE.webp"
                      alt="Check icon"
                      width={20}
                      height={20}
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </div>
                  <p className="text-sm md:text-lg lg:text-base text-white font-medium leading-normal">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className="btn-primary text-sm font-bold leading-tight px-6 md:px-8 py-4 md:py-5 rounded-2xl transition-colors hover:bg-primary-hover mt-6 whitespace-pre-line text-center"
                style={{ backgroundColor: '#ffaf02', color: '#121212' }}
              >
                {totem.cta.text}
              </Button>
            ) : (
              <Button
                asChild
                className="btn-primary text-sm font-bold leading-tight px-6 md:px-8 py-4 md:py-5 rounded-2xl transition-colors hover:bg-primary-hover mt-6 whitespace-pre-line text-center"
                style={{ backgroundColor: '#ffaf02', color: '#121212' }}
              >
                <Link href={totem.cta.href} target="_blank" rel="noopener noreferrer">
                  {totem.cta.text}
                </Link>
              </Button>
            )}
          </div>

          {/* Mockup da imagem */}
          <div className="w-screen lg:w-1/2 flex justify-center lg:justify-end order-last lg:order-last mt-6 lg:mt-0 -mx-4 md:-mx-8 lg:mx-0">
            <Image
              src={totem.image.src}
              alt={totem.image.alt}
              width={totem.image.width}
              height={totem.image.height}
              className="w-full h-auto max-w-full lg:max-w-full object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
