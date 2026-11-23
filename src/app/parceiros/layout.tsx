import type { Metadata } from "next";

// Página de indicação de parceiro (link com ?source=), não de busca: mesmo critério de /p/[slug].
// Sem isto ela herdava o título da home e o Google indexou /parceiros?source=… e o espelho no lp.
// (1.668 + 7.715 impressões em 90 dias até 21/Nov/26) disputando a busca da marca com a home.
export const metadata: Metadata = {
  title: "Indicação de parceiro | BestBarbers",
  robots: { index: false, follow: true },
};

export default function ParceirosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
