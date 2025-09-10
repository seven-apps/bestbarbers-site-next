import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function InvoicesSection() {
  const { invoices } = homeContent;

  return (
    <section className="section-dark section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-start w-full lg:w-1/2 space-y-3">
            <h2 className="text-4xl lg:text-4xl font-bold leading-tight text-white whitespace-pre-line">
              {invoices.title.main}
              <span className="text-primary" style={{ color: '#ffaf02' }}>{invoices.title.highlight}</span>
            </h2>
            
            <div className="space-y-1">
              {invoices.features.map((feature, index) => (
                <div key={index} className="text-sm lg:text-sm">
                  <strong className="text-white font-bold">
                    {feature.title}
                  </strong>
                  <span className="text-neutral-dark-grey font-medium" style={{ color: '#f0f0f0' }}>
                    {" "}{feature.description}
                  </span>
                  {index < invoices.features.length - 1 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-6 py-4 rounded-2xl transition-colors hover:bg-primary-hover mt-6"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={invoices.cta.href} target="_blank" rel="noopener noreferrer">
                {invoices.cta.text}
              </Link>
            </Button>
          </div>

          {/* Mockup da imagem */}
          <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src={invoices.image.src}
              alt={invoices.image.alt}
              width={invoices.image.width}
              height={invoices.image.height}
              className="w-full h-auto max-w-[50%] lg:max-w-full max-h-[500px] object-contain"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
