import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BestBarbers — Transforme sua barbearia",
  description:
    "De R$15 mil pra R$31 mil. Mesmas 4 cadeiras. App próprio, clube de assinaturas, gestão completa. A partir de R$299/mês.",
  robots: { index: false, follow: false },
};

export default function V10Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
