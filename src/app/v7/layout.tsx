import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BestBarbers — 353 assinantes. 4 cadeiras. R$31.690/mês.",
  description:
    "Caso real de Embu das Artes/SP. A partir de R$299/mês. Sem taxa de implantação. 1.200+ barbearias já usam.",
  robots: { index: false, follow: false },
};

export default function V7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
