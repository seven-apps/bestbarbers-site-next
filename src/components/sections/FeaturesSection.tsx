import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

interface FeaturesSectionProps {
  onCtaClick?: () => void;
}

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { features } = homeContent;

  return (
    <section className="bg-white py-12 md:py-16 lg:section-padding flex justify-center items-center overflow-x-hidden">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center w-full space-y-8 md:space-y-10 lg:space-y-12">
          {/* Título */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold leading-normal text-neutral-black-text">
              <span className="text-primary font-bold" style={{ color: '#ffaf02' }}>{features.title.highlight}</span>
              {features.title.main}
            </h2>
          </div>

          {/* Grid de funcionalidades */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 w-full max-w-4xl">
            {features.items.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2 py-4 md:py-5 lg:py-6 px-2" style={{ backgroundColor: '#f0f0f0', borderRadius: '20px' }}>
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={`Ícone ${item.title}`}
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs md:text-sm lg:text-medium font-bold text-neutral-black-text leading-tight px-1">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-0">
            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className="btn-primary text-xs font-bold leading-tight px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-colors hover:bg-primary-hover"
                style={{ backgroundColor: '#ffaf02', color: '#121212' }}
              >
                {features.cta.text}
              </Button>
            ) : (
              <Button
                asChild
                className="btn-primary text-xs font-bold leading-tight px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-colors hover:bg-primary-hover"
                style={{ backgroundColor: '#ffaf02', color: '#121212' }}
              >
                <Link href={features.cta.href} target="_blank" rel="noopener noreferrer">
                  {features.cta.text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
