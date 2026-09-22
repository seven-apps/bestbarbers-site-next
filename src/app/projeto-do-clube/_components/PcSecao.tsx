import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Faixa horizontal da página. **Server component** — não tem estado, não toca
 * `window`, não custa um byte de JS no cliente.
 *
 * Dá o ritmo vertical (`--pc-secao-y`), a goteira lateral (`--pc-secao-x`) e o
 * chão da seção. A identidade da família é a alternância: o ARGUMENTO vem sobre
 * carvão, o ARTEFATO do produto vem sobre papel — como um documento que o dono
 * confere. Alternar é o que dá ritmo; alternar a cada bloco é o que dá enjoo.
 *
 * O miolo já vem com a medida máxima (`--pc-max`, 1120px) e centralizado.
 * `medida="texto"` aperta para 62ch (bloco de leitura corrida);
 * `medida="cheia"` solta, para o artefato que precisa sangrar.
 */

export interface PcSecaoProps {
  id?: string;
  fundo?: "carvao" | "papel" | "carvao-fundo";
  className?: string;
  /** Largura do miolo. `padrao` = 1120px, `texto` = 62ch, `cheia` = sem teto. */
  medida?: "padrao" | "texto" | "cheia";
  /** Classe aplicada ao miolo, não à faixa. Útil para `grid`/`flex` de layout. */
  classNameMedida?: string;
  children: ReactNode;
}

const FUNDOS = {
  carvao: "pc-secao--carvao",
  "carvao-fundo": "pc-secao--carvao-fundo",
  // `pc-papel` junto porque o contrato do formulário usa essa classe direto.
  papel: "pc-secao--papel pc-papel",
} as const;

const MEDIDAS = {
  padrao: "",
  texto: "pc-medida--texto",
  cheia: "pc-medida--cheia",
} as const;

export function PcSecao({
  id,
  fundo = "carvao",
  className,
  medida = "padrao",
  classNameMedida,
  children,
}: PcSecaoProps) {
  return (
    <section id={id} className={cn("pc-secao", FUNDOS[fundo], className)}>
      <div className={cn("pc-medida", MEDIDAS[medida], classNameMedida)}>{children}</div>
    </section>
  );
}

export default PcSecao;
