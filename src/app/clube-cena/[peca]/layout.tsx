/**
 * CASCA DO BRAÇO `cena` do A/B de `/clube/[peca]` — mesmo contrato da casca de `/clube/[peca]/layout.tsx`.
 *
 * 1. `noindex` AQUI, e em nenhum outro lugar. Onze páginas do mesmo produto
 *    canibalizam a `/clube` e a `/clube-de-assinaturas` no Google (cap. 36 §4.2).
 *    `robots.ts` libera `/` e o sitemap é allow-list — sitemap não impede
 *    indexação, só deixa de sugerir. A única trava real é este `metadata.robots`,
 *    e declarado na casca ele cobre as onze por herança: não há como uma página
 *    nova nascer indexável. `clube-pecas.test.ts` confere que a linha continua aqui.
 *
 * 2. O template é o orquestrador da família `/projeto-do-clube` (`PcPagina`), e
 *    todo token e toda classe dele vivem sob o escopo `.pc` de `pc-tokens.css`.
 *    Sem o import e o `<div className="pc">`, a página renderiza sem estilo e o
 *    conteúdo que revela ao rolar pode ficar invisível. Mesmo contrato da casca
 *    de `/projeto-do-clube/layout.tsx`.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../../projeto-do-clube/_components/pc-tokens.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  // Rede embaixo do `canonical: null` de cada página: sem ela, as onze herdam o
  // canonical "/" do layout raiz.
  alternates: { canonical: null },
};

export default function ClubePecaLayout({ children }: { children: ReactNode }) {
  return <div className="pc">{children}</div>;
}
