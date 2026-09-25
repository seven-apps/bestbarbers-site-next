/**
 * CASCA DO BRAÇO `longa` do A/B de página de `/clube/[peca]` (`lib/ab-clube.ts`).
 *
 * `noindex` AQUI, e em nenhum outro lugar: são onze cópias da `/clube` (que já é `noindex`)
 * e não podem nascer indexáveis nem herdar o canonical "/" do layout raiz.
 * `clube-pecas.test.ts` confere que a linha continua aqui.
 *
 * Sem `pc-tokens.css` nem `<div className="pc">`: a página longa é a `ClubePage` do site
 * (Tailwind), não a família `/projeto-do-clube`.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

export default function ClubeLongaLayout({ children }: { children: ReactNode }) {
  return children;
}
