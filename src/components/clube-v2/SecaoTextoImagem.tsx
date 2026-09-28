import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checklist } from "@/components/clube-v2/Checklist";
import { MockupNotebook } from "@/components/clube-v2/MockupNotebook";

interface ImagemDaSecao {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface SecaoTextoImagemProps {
  titulo: { main: string; highlight: string };
  /** Vantagens em frases curtas, lidas de relance (celular primeiro). */
  itens: readonly string[];
  cta: string;
  onCtaClick: () => void;
  imagem: ImagemDaSecao;
  /** Lado da imagem no desktop. No celular o texto vem sempre primeiro. */
  imagemNa: "esquerda" | "direita";
  /** Fundo da seção: alterna branco e cinza-claro, como na home. */
  fundo?: "branco" | "cinza";
  /**
   * Como a imagem aparece:
   * - "sombra": cartão com cantos arredondados e sombra (capturas de tela);
   * - "solta": sem moldura nem sombra (artes que já trazem o próprio recorte);
   * - "notebook": a tela do sistema dentro de um notebook.
   */
  moldura?: "sombra" | "solta" | "notebook";
  /** Linha pequena sob a imagem (ex.: "Tela real do sistema, conta de demonstração."). */
  legenda?: string;
}

/**
 * Bloco padrão da /clube-v2: título em duas partes, lista de vantagens, UM botão e a imagem.
 * Mesma gramática visual da seção de assinaturas da home (texto + mockup lado a lado).
 */
export function SecaoTextoImagem({
  titulo,
  itens,
  cta,
  onCtaClick,
  imagem,
  imagemNa,
  fundo = "branco",
  moldura = "sombra",
  legenda,
}: SecaoTextoImagemProps) {
  const figura = (
    <figure className="w-full max-w-[640px] mx-auto">
      {moldura === "notebook" ? (
        <MockupNotebook {...imagem} />
      ) : (
        <Image
          src={imagem.src}
          alt={imagem.alt}
          width={imagem.width}
          height={imagem.height}
          className={`w-full h-auto ${moldura === "sombra" ? "rounded-2xl shadow-lg" : ""}`}
          sizes="(max-width: 1024px) 90vw, 45vw"
        />
      )}
      {legenda ? <figcaption className="text-xs text-gray-500 mt-3 text-center">{legenda}</figcaption> : null}
    </figure>
  );

  return (
    <section className={`${fundo === "cinza" ? "bg-gray-50" : "bg-white"} py-12 md:py-20 flex justify-center items-center overflow-x-hidden`}>
      <div className="container-custom">
        <div className={`flex flex-col ${imagemNa === "esquerda" ? "lg:flex-row-reverse" : "lg:flex-row"} items-center justify-between gap-8 lg:gap-16`}>
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full space-y-5 md:space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold leading-tight text-neutral-black-text text-center lg:text-left max-w-xl lg:max-w-none">
              {titulo.main}{" "}
              <span style={{ color: "#ffaf02" }}>{titulo.highlight}</span>
            </h2>

            <Checklist itens={itens} />

            <Button
              onClick={onCtaClick}
              className="min-h-[44px] h-auto w-full sm:w-auto text-sm font-bold leading-tight px-6 md:px-8 py-4 md:py-5 rounded-2xl whitespace-normal text-center"
              style={{ backgroundColor: "#ffaf02", color: "#121212" }}
            >
              {cta}
            </Button>
          </div>

          <div className="flex-1 w-full">{figura}</div>
        </div>
      </div>
    </section>
  );
}
