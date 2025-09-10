import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

export function NotificationsSection() {
  const { notifications } = homeContent;

  return (
    <section className="section-primary-hover py-16 md:py-20 lg:section-padding flex justify-center items-center">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-16">
          {/* Mockup da imagem - mobile first */}
          <div className="w-screen lg:w-1/2 flex justify-center lg:justify-start order-first lg:order-first mb-0 lg:mb-0 -mx-4 md:-mx-8 lg:mx-0">
            <div className="relative w-full flex justify-center">
              <Image
                src={notifications.image.src}
                alt={notifications.image.alt}
                width={notifications.image.width}
                height={notifications.image.height}
                className="w-full h-auto max-w-[95%] md:max-w-[85%] lg:max-w-full object-contain lg:ml-[-64px]"
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 85vw, 55vw"
              />
            </div>
          </div>

          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 space-y-3 md:space-y-5 text-center lg:text-left order-last lg:order-last">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight text-neutral-bg2 whitespace-pre-line max-w-lg lg:max-w-none">
              {notifications.title.main}
              <span className="text-white">{notifications.title.highlight}</span>
            </h2>
            
            <div className="space-y-3 md:space-y-4 max-w-lg lg:max-w-none">
              {notifications.features.map((feature, index) => (
                <div key={index} className="text-sm md:text-lg lg:text-base">
                  <strong className="text-neutral-bg2 font-bold">
                    {feature.title}
                  </strong>
                  <span className="text-neutral-bg2 font-medium">
                    {" "}{feature.description}
                  </span>
                </div>
              ))}
            </div>
            
            <Button
              asChild
              className="btn-primary bg-white text-neutral-bg2 hover:bg-neutral-card-grey text-sm font-bold leading-tight px-6 md:px-8 py-4 md:py-5 rounded-2xl transition-colors mt-6"
              style={{ backgroundColor: '#121212', color: '#ffaf02' }}
            >
              <Link href={notifications.cta.href} target="_blank" rel="noopener noreferrer">
                {notifications.cta.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
