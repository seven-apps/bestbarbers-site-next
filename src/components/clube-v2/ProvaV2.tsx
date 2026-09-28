import Image, { type StaticImageData } from "next/image";
import { clubeV2Content } from "@/content/clube-v2";
import fotoJoaoSeletto from "@/app/parceiros/assets/joao-seletto.png";
import fotoKaiqueAlves from "@/app/parceiros/assets/kaique-alves.png";
import fotoDavidChamps from "@/app/parceiros/assets/david-champs.png";

/**
 * Prova da /clube-v2, em três camadas e nesta ordem:
 *   1. EMPRESA — o número oficial + a esteira de logos (parceiros da foto do herói primeiro);
 *   2. PARCEIRO FALANDO — foto + fala LITERAL entre aspas (o número é de quem fala);
 *   3. BARBEARIA DO TAMANHO DO LEITOR — 3 cases por porte e cidade, sem nome.
 * Vem logo abaixo do herói: prova antes de qualquer outra promessa.
 *
 * Régua de logo: barbearia de ex-parceiro com uso de imagem revogado NÃO entra aqui, nem o
 * logo nem o nome do arquivo (mesma régua de `components/clube/ClientesClube.tsx`).
 */
const FOTOS: Record<string, StaticImageData> = {
  "joao-seletto": fotoJoaoSeletto,
  "kaique-alves": fotoKaiqueAlves,
  "david-champs": fotoDavidChamps,
};

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

function Esteira({ logos, direcao, duracao }: { logos: { src: string; alt: string }[]; direcao: "left" | "right"; duracao: string }) {
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
  const clientes = LOGOS_CLIENTES.map((src, i) => ({ src, alt: `Logo de barbearia cliente ${i + 1}` }));
  const meio = Math.ceil(clientes.length / 2);
  // Parceiros ficam numa fileira FIXA acima da esteira: em movimento eles se perdem.
  const fileira1 = clientes.slice(0, meio);
  const fileira2 = clientes.slice(meio);

  return (
    <section className="bg-white py-14 md:py-20 w-full overflow-hidden">
      {/* 1. Empresa */}
      <div className="px-4 md:container-custom">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-neutral-black-text text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <span className="text-[#ffaf02] font-extrabold">{prova.titulo.destaque}</span>
          {prova.titulo.resto}
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-4 mb-6 md:mb-8">
        {prova.logosParceiros.map((logo) => (
          <div
            key={logo.src}
            className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-white rounded-2xl shadow-md border border-[#ffaf02]/40 p-2 md:p-3 overflow-hidden"
          >
            <Image src={logo.src} alt={logo.alt} width={128} height={128} className="w-full h-full object-contain rounded-xl" />
          </div>
        ))}
      </div>
      <div className="w-full max-w-6xl mx-auto overflow-hidden py-2 space-y-4 md:space-y-6">
        <Esteira logos={fileira1} direcao="left" duracao="28s" />
        <Esteira logos={fileira2} direcao="right" duracao="32s" />
      </div>

      {/* 2. Parceiro falando */}
      <div className="pt-14 md:pt-20">
      <div className="container-custom">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-black-text text-center mb-8 md:mb-10">
          {prova.depoimentos.titulo}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {prova.depoimentos.itens.map((d) => (
            <figure key={d.chave} className="bg-[#121212] rounded-2xl p-6 md:p-7 flex flex-col">
              <blockquote className="flex-1">
                <p className="text-base md:text-[17px] text-white leading-relaxed">
                  <span aria-hidden className="text-[#ffaf02] font-extrabold">“</span>
                  {d.fala}
                  <span aria-hidden className="text-[#ffaf02] font-extrabold">”</span>
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-6">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#2a2a2a] shrink-0">
                  <Image src={FOTOS[d.chave]} alt={`Foto de ${d.nome}`} width={112} height={112} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <cite className="not-italic text-sm font-bold text-white block">{d.nome}</cite>
                  <span className="text-xs text-gray-400">{d.barbearia}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      </div>

      {/* 3. Barbearia do tamanho do leitor */}
      <div className="pt-14 md:pt-20">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-black-text mb-3">
            {prova.cases.titulo}
          </h3>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">{prova.cases.apoio}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {prova.cases.itens.map((c) => (
            <div key={c.cidade} className="bg-gray-50 rounded-2xl p-6 md:p-7 border border-gray-100">
              <p className="text-xl md:text-2xl font-extrabold text-[#b37a00] leading-tight mb-2">{c.numero}</p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">{c.texto}</p>
              <p className="text-sm font-bold text-neutral-black-text">{c.porte}</p>
              <p className="text-xs text-gray-500">{c.cidade}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
