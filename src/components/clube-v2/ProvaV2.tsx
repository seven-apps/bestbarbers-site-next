import Image from "next/image";
import { clubeV2Content } from "@/content/clube-v2";

/**
 * Prova da /clube-v2, em duas camadas e nesta ordem:
 *   1. EMPRESA — o número oficial + a esteira de logos (parceiros são os primeiros da fila);
 *   2. PARCEIRO FALANDO — foto grande na metade esquerda do cartão e a fala LITERAL, entre
 *      aspas, na metade direita (o número é de quem fala; a casa não afirma).
 * Vem logo abaixo do herói: prova antes de qualquer outra promessa.
 *
 * Régua de logo: barbearia de ex-parceiro com uso de imagem revogado NÃO entra aqui, nem o
 * logo nem o nome do arquivo (mesma régua de `components/clube/ClientesClube.tsx`).
 */
const LOGOS_CLIENTES = [
  "/images/Barber-Style.webp",
  "/images/Sr-Barbearia.webp",
  "/images/Premium.webp",
  "/images/Black-House.webp",
  "/images/James.webp",
  "/images/Ferrari.webp",
  "/images/T.webp",
  "/images/Spartano.webp",
  "/images/Sr-Freitas.webp",
  "/images/Seu-Oziel.webp",
  "/images/Vicente.webp",
  "/images/R.webp",
  "/images/o.webp",
  "/images/Camilos.webp",
  "/images/Sr-Joao.webp",
  "/images/Kadosh.webp",
  "/images/Igor.webp",
  "/images/Urus.webp",
  "/images/Vitor.webp",
];

interface Logo {
  src: string;
  alt: string;
}

function Esteira({ logos, direcao, duracao }: { logos: Logo[]; direcao: "left" | "right"; duracao: string }) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-white to-transparent z-10" />
      <div
        className={`${direcao === "left" ? "animate-marquee-left" : "animate-marquee-right"} gpu-accelerated`}
        style={{ "--marquee-duration": duracao } as React.CSSProperties}
      >
        {[0, 1, 2].map((copia) => (
          <div key={copia} className="inline-flex gap-3 md:gap-6 items-center pr-3 md:pr-6">
            {logos.map((logo, i) => (
              <div
                key={`${copia}-${i}`}
                className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm p-2 md:p-3 overflow-hidden"
              >
                <Image src={logo.src} alt={copia === 0 ? logo.alt : ""} width={100} height={100} className="w-full h-full object-contain rounded-lg" loading="lazy" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProvaV2() {
  const { prova } = clubeV2Content;
  const clientes: Logo[] = LOGOS_CLIENTES.map((src, i) => ({ src, alt: `Logo de barbearia cliente ${i + 1}` }));
  // Parceiros abrem a fila: a esteira parte do início, então são os primeiros a aparecer.
  const todos: Logo[] = [...prova.logosParceiros, ...clientes];
  const meio = Math.ceil(todos.length / 2);
  const fileira1 = todos.slice(0, meio);
  const fileira2 = todos.slice(meio);

  return (
    <section className="bg-white py-12 md:py-20 w-full overflow-hidden">
      {/* 1. Empresa */}
      <div className="px-4 md:container-custom">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-neutral-black-text text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <span className="text-[#ffaf02] font-extrabold">{prova.titulo.destaque}</span>
          {prova.titulo.resto}
        </h2>
      </div>
      <div className="w-full max-w-6xl mx-auto overflow-hidden py-2 space-y-4 md:space-y-6">
        <Esteira logos={fileira1} direcao="left" duracao="28s" />
        <Esteira logos={fileira2} direcao="right" duracao="32s" />
      </div>

      {/* 2. Parceiro falando */}
      <div className="pt-12 md:pt-20">
        <div className="container-custom">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-black-text text-center mb-8 md:mb-10">
            {prova.depoimentos.titulo}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
            {prova.depoimentos.itens.map((d) => (
              <figure key={d.chave} className="bg-[#121212] rounded-2xl overflow-hidden grid grid-cols-[46%_54%] min-h-[280px] lg:grid-cols-1 lg:min-h-0">
                {/* celular: foto na metade esquerda, do topo à base · desktop: foto grande em cima */}
                <div className="relative bg-[#ffaf02] lg:h-80">
                  <Image
                    src={d.foto}
                    alt={`Foto de ${d.nome}, ${d.barbearia}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 50vw, 320px"
                  />
                </div>
                {/* metade direita: a fala literal e quem fala */}
                <div className="flex flex-col justify-center p-4 md:p-5 lg:p-6">
                  <blockquote>
                    <p className="text-sm md:text-[15px] text-white leading-snug">
                      <span aria-hidden className="text-[#ffaf02] font-extrabold">“</span>
                      {d.fala}
                      <span aria-hidden className="text-[#ffaf02] font-extrabold">”</span>
                    </p>
                  </blockquote>
                  <figcaption className="mt-4">
                    <cite className="not-italic text-sm font-bold text-white block">{d.nome}</cite>
                    <span className="text-xs text-gray-400">{d.barbearia}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
