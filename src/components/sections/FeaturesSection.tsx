import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function FeaturesSection() {
  const { features } = homeContent;

  return (
    <section className="bg-white section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center w-full space-y-12">
          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-medium leading-normal text-neutral-black-text">
              <span className="text-primary font-bold">{features.title.highlight}</span>
              {features.title.main}
            </h2>
          </div>

          {/* Grid de funcionalidades */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-6xl">
            {features.items.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 p-4" style={{ backgroundColor: '#f0f0f0', borderRadius: '20px' }}>
                <div className="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={`Ícone ${item.title}`}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm lg:text-base font-bold text-neutral-black-text leading-tight">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-2">
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-6 py-4 rounded-2xl transition-colors hover:bg-primary-hover"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={features.cta.href} target="_blank" rel="noopener noreferrer">
                {features.cta.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
