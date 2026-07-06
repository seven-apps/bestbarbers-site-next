import type { Metadata } from "next";
import { Vollkorn, Montserrat } from "next/font/google";

const vollkorn = Vollkorn({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-vollkorn",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calculadora de Lucro por Corte — Descubra quanto sobra de cada corte | BestBarbers",
  description:
    "Faturamento não é lucro. Descubra em 1 minuto quanto sobra (ou quanto você perde) em cada corte depois de descontar produto, comissão e a fatia do custo fixo. Calculadora gratuita da BestBarbers — mais de 1.200 barbearias.",
  alternates: {
    canonical: "/calculadora-lucro-do-corte",
  },
  openGraph: {
    title:
      "Calculadora de Lucro por Corte — Descubra quanto sobra de cada corte | BestBarbers",
    description:
      "Faturamento não é lucro. Descubra em 1 minuto quanto sobra de cada corte depois de descontar produto, comissão e custo fixo. Calculadora gratuita.",
    url: "https://www.bestbarbers.app/calculadora-lucro-do-corte",
    type: "website",
    locale: "pt_BR",
    siteName: "BestBarbers",
  },
};

export default function CalculadoraLucroDoCorteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>
      {children}
    </div>
  );
}
