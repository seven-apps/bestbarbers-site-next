import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BestBarbers — Sistema para Barbearias",
  description:
    "App próprio + Gestão completa. 1.200+ barbearias. A partir de R$299/mês.",
  robots: { index: false, follow: false },
};

export default function V8Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
