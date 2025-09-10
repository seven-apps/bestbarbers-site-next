import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function StepsSection() {
  const { steps } = homeContent;

  return (
    <section className="section-dark py-12 md:py-16 lg:section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center w-full space-y-8 md:space-y-10 lg:space-y-12">
          {/* Título */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium leading-normal text-white text-center whitespace-pre-line">
              <span className="text-primary font-bold" style={{ color: '#ffaf02' }}>{steps.title.highlight}</span>
              {steps.title.main}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 md:gap-8 lg:gap-16 w-full">
            {/* Lista de passos */}
            <div className="flex-1 w-full lg:w-1/2 space-y-4 md:space-y-5">
              {steps.items.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 md:space-x-6">
                  {/* Número do passo */}
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffaf02' }}>
                    <span className="text-lg md:text-xl font-black text-neutral-bg2">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Conteúdo do passo */}
                  <div className="flex-1 space-y-1 md:space-y-2">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-sm text-neutral-dark-grey font-medium leading-normal" style={{ color: '#f0f0f0' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mockup da imagem */}
            <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end order-first lg:order-last">
              <Image
                src={steps.image.src}
                alt={steps.image.alt}
                width={steps.image.width}
                height={steps.image.height}
                className="w-full h-auto max-w-[70%] md:max-w-[80%] lg:max-w-full object-contain"
                sizes="(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 50vw"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-0">
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-colors hover:bg-primary-hover"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={steps.cta.href} target="_blank" rel="noopener noreferrer">
                {steps.cta.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
