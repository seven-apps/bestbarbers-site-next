import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

interface BarbershopPainSectionProps {
  onCtaClick?: () => void;
}

export function BarbershopPainSection({ onCtaClick }: BarbershopPainSectionProps) {
  const { subscriptions } = homeContent;

  return (
    <section className="section-white py-16 md:py-20 lg:section-padding flex justify-center items-center overflow-x-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-16">
          {/* Mockup da imagem - desktop */}
          <div className="hidden lg:block lg:w-[40%]">
            <Image
              src={subscriptions.image.src}
              alt={subscriptions.image.alt}
              width={subscriptions.image.width}
              height={subscriptions.image.height}
              className="w-full h-auto max-w-[90%]"
              sizes="(max-width: 2000px) 80vw, 80vw"
            />
          </div>

          {/* Conteúdo textual */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full lg:w-3/5 space-y-4  text-center lg:text-left order-first lg:order-last">
            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-bold leading-tight text-neutral-black-text max-w-lg lg:max-w-none">
              Sabe por que o faturamento da sua barbearia cresce,

              <br />
              <span className="text-primary" style={{ color: '#ffaf02' }}>{" mas o lucro não acompanha?"}</span>
            </h2>

            <strong className="text-neutral-black-text font-bold text-[18px]">
              Porque a maioria das barbearias cresce tentando atender mais clientes — e não estruturando a gestão e novas formas de ganhar mais com quem já atende.
            </strong>
            <span className="text-neutral-dark-grey font-normal">
              Sem gestão clara, controle financeiro e fontes de receita recorrente, o crescimento vira volume — não lucro.
              O dinheiro entra, gira, paga custos… e no fim sobra pouco para o dono.
            </span>

            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className="text-sm font-extrabold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                style={{ backgroundColor: "#02ab15", color: "#ffffff" }}
              >
                QUERO ESTRUTURAR A MINHA GESTÃO E LUCRAR MAIS
              </Button>
            ) : (
              <Button
                asChild
                className="btn-primary text-sm font-bold leading-tight px-6 md:px-8 py-4 md:py-5 rounded-2xl transition-colors hover:bg-primary-hover mt-6"
                style={{ backgroundColor: '#ffaf02', color: '#121212' }}
              >
                <Link href={subscriptions.cta.href} target="_blank" rel="noopener noreferrer">
                  {subscriptions.cta.text}
                </Link>
              </Button>
            )}
          </div>

          {/* Mockup da imagem - mobile last */}
          <div className="lg:hidden w-full flex justify-center order-last mt-6">
            <Image
              src={subscriptions.image.src}
              alt={subscriptions.image.alt}
              width={subscriptions.image.width}
              height={subscriptions.image.height}
              className="w-full h-auto max-w-[90%] md:max-w-[80%]"
              sizes="(max-width: 768px) 90vw, 80vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
