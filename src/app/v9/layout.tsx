import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BestBarbers — Descubra o potencial da sua barbearia",
  description:
    "Quiz personalizado. Veja como barbearias iguais à sua cresceram. 1.200+ barbearias usam. A partir de R$299/mês.",
  robots: { index: false, follow: false },
};

export default function V9Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
