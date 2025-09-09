import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function BasicPlanSection() {
  const { basicPlan } = homeContent;

  return (
    <section className="bg-white section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-start w-full lg:w-1/2 space-y-3">
            <h2 className="text-4xl lg:text-4xl font-bold leading-tight text-neutral-black-text">
              {basicPlan.title.main}
              <span className="text-primary" style={{ color: '#ffaf02' }}>{basicPlan.title.highlight}</span>
              {basicPlan.title.subtitle}
            </h2>
            
            <div className="text-sm lg:text-base text-neutral-black-text mt-2 whitespace-pre-line">
              {basicPlan.description}
            </div>
            
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-6 py-4 rounded-2xl transition-colors hover:bg-primary-hover mt-3"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={basicPlan.cta.href} target="_blank" rel="noopener noreferrer">
                {basicPlan.cta.text}
              </Link>
            </Button>
          </div>

          {/* Mockup da imagem */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src={basicPlan.image.src}
              alt={basicPlan.image.alt}
              width={basicPlan.image.width}
              height={basicPlan.image.height}
              className="w-full h-auto max-w-[90%] lg:max-w-full object-contain"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
