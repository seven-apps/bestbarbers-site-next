import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function TotemSection() {
  const { totem } = homeContent;

  return (
    <section className="section-dark section-padding flex justify-center items-center" style={{ padding: 0 }}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-start w-full lg:w-1/2 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
              {totem.title.main}
              <br />
              <span className="text-primary font-bold" style={{ color: '#ffaf02' }}>{totem.title.highlight}</span>
            </h2>
            
            <div className="space-y-3 mt-3">
              {totem.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Image
                      src="/images/CIRCULO-VERDE_1CIRCULO VERDE.webp"
                      alt="Check icon"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                  <p className="text-sm lg:text-sm text-white font-medium leading-normal">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-6 py-6 rounded-2xl transition-colors hover:bg-primary-hover mt-3 whitespace-pre-line text-center"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={totem.cta.href} target="_blank" rel="noopener noreferrer">
                {totem.cta.text}
              </Link>
            </Button>
          </div>

          {/* Mockup da imagem */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src={totem.image.src}
              alt={totem.image.alt}
              width={totem.image.width}
              height={totem.image.height}
              className="w-full h-auto max-w-[90%] lg:max-w-full object-contain"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
