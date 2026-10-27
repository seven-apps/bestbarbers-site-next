import { ArrowRight } from "lucide-react";

/**
 * BOTÃO DE CHAMADA das páginas institucionais (home, /clube, /parceiros) — André, 27/Out/26: o botão preto de duas
 * linhas em caixa alta "não tinha cara de botão". Formato único: uma linha, letra normal e maior, seta, sombra, altura
 * de toque e, no celular, quase a largura da tela. `h-auto` porque o `Button` do shadcn fixa a altura e esmagava o
 * texto. A cor fica com cada seção (preto sobre o amarelo; amarelo sobre o claro ou o escuro).
 */
export const CLASSE_BOTAO_CHAMADA =
  "h-auto min-h-[52px] w-full max-w-sm sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-extrabold leading-tight text-center whitespace-normal shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:scale-[1.02] active:scale-[0.98]";

export const BOTAO_PRETO = { backgroundColor: "#121212", color: "#ffffff" } as const;
export const BOTAO_AMARELO = { backgroundColor: "#ffaf02", color: "#121212" } as const;

/** A seta do botão: amarela no preto, preta no amarelo. */
export function SetaDoBotao({ cor = "#ffaf02" }: { cor?: string }) {
  return <ArrowRight aria-hidden="true" className="w-5 h-5 flex-none" style={{ color: cor }} />;
}
