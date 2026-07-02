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
  title: "Calculadora de Prejuízo da Barbearia — Quanto você perde por mês | BestBarbers",
  description:
    "Descubra em 1 minuto quanto sua barbearia deixa de faturar por mês sem clube de assinaturas. Calculadora gratuita baseada em dados reais da BestBarbers — 47.793 assinantes ativos em 1.297 barbearias, 48% já com clube.",
  alternates: {
    canonical: "/calculadora-prejuizo",
  },
  openGraph: {
    title:
      "Calculadora de Prejuízo da Barbearia — Quanto você perde por mês | BestBarbers",
    description:
      "Descubra em 1 minuto quanto sua barbearia deixa de faturar por mês sem clube de assinaturas. Calculadora gratuita baseada em cases reais.",
    url: "https://www.bestbarbers.app/calculadora-prejuizo",
    type: "website",
    locale: "pt_BR",
    siteName: "BestBarbers",
  },
};

export default function CalculadoraPrejuizoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GTM-WWR94GLQ REMOVIDO (02/Jul/2026): mesma limpeza da /v12 — o container
          disparava uma 2ª tag Meta Pixel 'Lead' no form_submit com eventId próprio
          (dobrava a contagem de leads dos anúncios). Tracking oficial segue no
          código (useLeadForm/useMetaPixel) + GTM global. */}
      <div className={`${vollkorn.variable} ${montserrat.variable}`}>
        {children}
      </div>
    </>
  );
}
