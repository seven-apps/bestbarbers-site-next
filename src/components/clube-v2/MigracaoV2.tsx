import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { clubeV2Content } from "@/content/clube-v2";

interface MigracaoV2Props {
  onCtaClick: () => void;
}

/**
 * Bloco de quem JÁ cobra assinatura (PIX, planilha, caderno). Sobe para o alto da página:
 * é o leitor que mais compra, e ele só se reconhece se a página falar da situação dele.
 * As três frases são as que o André liberou em 22/Set/26 (importa a planilha com os
 * vencimentos · cartão no primeiro acesso · não perde assinante).
 * originDesc: [Site-Clube-V2]BT-Migracao — é o lado "migrar" do fork (porta 3).
 */
export function MigracaoV2({ onCtaClick }: MigracaoV2Props) {
  const { migracao } = clubeV2Content;

  return (
    <section className="py-12 md:py-16 bg-[#121212] overflow-x-hidden">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-[42%]">
            <Image
              src={migracao.image.src}
              alt={migracao.image.alt}
              width={migracao.image.width}
              height={migracao.image.height}
              className="w-full h-auto rounded-2xl"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
              {migracao.titulo}
            </h2>
            <p className="text-base md:text-lg lg:text-base leading-relaxed text-gray-300 mb-6">
              {migracao.texto}
            </p>
            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center min-h-[44px] gap-2 border-2 border-[#ffaf02] text-[#ffaf02] font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-[#ffaf02] hover:text-[#121212]"
            >
              {migracao.cta}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
