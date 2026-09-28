import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImagemDaSecao {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface SecaoTextoImagemProps {
  titulo: { main: string; highlight: string };
  /** Parágrafos corridos OU itens em lista — a seção usa um dos dois. */
  paragrafos?: readonly string[];
  itens?: readonly string[];
  cta: string;
  onCtaClick: () => void;
  imagem: ImagemDaSecao;
  /** Lado da imagem no desktop. No celular o texto vem sempre primeiro. */
  imagemNa: "esquerda" | "direita";
  /** Fundo da seção: alterna branco e cinza-claro, como na home. */
  fundo?: "branco" | "cinza";
  /** Linha pequena sob a imagem (ex.: "Tela real do sistema, conta de demonstração."). */
  legenda?: string;
  /** Imagem estreita (retrato): limita a largura para o texto não ficar espremido. */
  imagemEstreita?: boolean;
}

/**
 * Bloco padrão da /clube-v2: título em duas partes, texto didático, imagem e UM botão.
 * Mesma gramática visual da SubscriptionsSection da home (texto + mockup lado a lado).
 */
export function SecaoTextoImagem({
  titulo,
  paragrafos,
  itens,
  cta,
  onCtaClick,
  imagem,
  imagemNa,
  fundo = "branco",
  legenda,
  imagemEstreita = false,
}: SecaoTextoImagemProps) {
  const figura = (
    <figure className={`w-full ${imagemEstreita ? "max-w-[380px]" : "max-w-[620px]"} mx-auto`}>
      <Image
        src={imagem.src}
        alt={imagem.alt}
        width={imagem.width}
        height={imagem.height}
        className="w-full h-auto rounded-2xl shadow-lg"
        sizes="(max-width: 1024px) 90vw, 45vw"
      />
      {legenda ? <figcaption className="text-xs text-gray-500 mt-2 text-center">{legenda}</figcaption> : null}
    </figure>
  );

  return (
    <section className={`${fundo === "cinza" ? "bg-gray-50" : "bg-white"} py-14 md:py-20 flex justify-center items-center overflow-x-hidden`}>
      <div className="container-custom">
        <div className={`flex flex-col ${imagemNa === "esquerda" ? "lg:flex-row-reverse" : "lg:flex-row"} items-center justify-between gap-8 lg:gap-16`}>
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full space-y-4 md:space-y-5 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-neutral-black-text max-w-xl lg:max-w-none">
              {titulo.main}{" "}
              <span style={{ color: "#ffaf02" }}>{titulo.highlight}</span>
            </h2>

            {paragrafos ? (
              <div className="space-y-3 md:space-y-4 max-w-xl lg:max-w-none">
                {paragrafos.map((p) => (
                  <p key={p} className="text-base md:text-lg lg:text-base text-neutral-dark-grey leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ) : null}

            {itens ? (
              <ol className="space-y-3 max-w-xl lg:max-w-none text-left">
                {itens.map((item, i) => (
                  <li key={item} className="flex gap-3 text-base md:text-lg lg:text-base text-neutral-dark-grey leading-relaxed">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#ffaf02] text-[#121212] text-sm font-extrabold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : null}

            <Button
              onClick={onCtaClick}
              className="min-h-[44px] h-auto text-sm font-bold leading-tight px-6 md:px-8 py-4 md:py-5 rounded-2xl mt-4"
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
