import { Check } from "lucide-react";

interface ChecklistProps {
  itens: readonly string[];
  /** "claro" = texto escuro sobre fundo claro · "escuro" = texto claro sobre fundo escuro · "heroi" = sobre o amarelo. */
  tom?: "claro" | "escuro" | "heroi";
}

/**
 * Lista de vantagens para ler de relance no celular: um selo de "feito" e uma frase curta
 * por linha. Sempre alinhada à esquerda, mesmo quando o título da seção está centralizado —
 * lista centralizada não se lê de relance.
 */
export function Checklist({ itens, tom = "claro" }: ChecklistProps) {
  const texto = tom === "escuro" ? "text-gray-200" : tom === "heroi" ? "text-neutral-bg2" : "text-neutral-black-text";
  const selo = tom === "heroi" ? "bg-[#121212] text-[#ffaf02]" : "bg-[#ffaf02] text-[#121212]";

  return (
    <ul className="space-y-3 text-left w-full max-w-md lg:max-w-none">
      {itens.map((item) => (
        <li key={item} className={`flex items-start gap-3 text-base md:text-lg lg:text-base font-medium leading-snug ${texto}`}>
          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${selo}`}>
            <Check className="w-4 h-4" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
