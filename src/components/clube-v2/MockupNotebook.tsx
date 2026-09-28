import Image from "next/image";

interface MockupNotebookProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Notebook desenhado em CSS com a tela do sistema dentro — mostra o sistema como ele é usado.
 * Sem imagem de moldura: a tampa, a câmera e a base são elementos, então a tela escala com a
 * largura e não pesa na página.
 */
export function MockupNotebook({ src, alt, width, height }: MockupNotebookProps) {
  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* tampa */}
      <div className="relative bg-[#0c0c0d] rounded-t-[14px] md:rounded-t-[20px] border-[3px] border-[#2b2b2e] border-b-0 px-[2.2%] pt-[3.2%] pb-[2.2%] shadow-xl">
        <span aria-hidden className="absolute top-[1.1%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#2f2f33]" />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto rounded-[3px] block"
          sizes="(max-width: 1024px) 90vw, 45vw"
        />
      </div>
      {/* base */}
      <div aria-hidden className="relative -mx-[6%] h-[10px] md:h-[14px] bg-gradient-to-b from-[#d9dadc] to-[#a9abae] rounded-b-[14px] md:rounded-b-[18px] shadow-md">
        <span className="absolute left-1/2 -translate-x-1/2 top-0 w-[16%] h-[45%] bg-[#8e9093] rounded-b-md" />
      </div>
    </div>
  );
}
