import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function SubscriptionsSection() {
  const { subscriptions } = homeContent;

  return (
    <section className="section-white section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Mockup da imagem - desktop */}
          <div className="hidden lg:block flex-1 w-full lg:w-[55%]">
            <Image
              src={subscriptions.image.src}
              alt={subscriptions.image.alt}
              width={subscriptions.image.width}
              height={subscriptions.image.height}
              className="w-full h-auto max-w-[80%]"
              sizes="(max-width: 2000px) 80vw, 80vw"
            />
          </div>

          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-start w-full lg:w-3/5 space-y-3">
            <h2 className="text-4xl lg:text-4xl font-bold leading-tight text-neutral-black-text">
              {subscriptions.title.main}
              <br />
              <span className="text-primary" style={{ color: '#ffaf02' }}>{subscriptions.title.highlight}</span>
            </h2>
            
            <div className="space-y-0">
              {subscriptions.features.map((feature, index) => (
                <div key={index} className="text-sm lg:text-sm">
                  <strong className="text-neutral-black-text font-bold">
                    {feature.title}
                  </strong>
                  <span className="text-neutral-dark-grey font-normal">
                    {" "}{feature.description}
                  </span>
                  {index < subscriptions.features.length - 1 && (
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
              className="btn-primary text-xs font-bold leading-tight px-6 py-4 rounded-2xl transition-colors hover:bg-primary-hover mt-3"
              style={{ backgroundColor: '#ffaf02', color: '#121212' }}
            >
              <Link href={subscriptions.cta.href} target="_blank" rel="noopener noreferrer">
                {subscriptions.cta.text}
              </Link>
            </Button>
          </div>

          {/* Mockup da imagem - mobile */}
          <div className="lg:hidden w-full flex justify-center">
            <Image
              src={subscriptions.image.src}
              alt={subscriptions.image.alt}
              width={subscriptions.image.width}
              height={subscriptions.image.height}
              className="w-full h-auto max-w-[100%]"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
