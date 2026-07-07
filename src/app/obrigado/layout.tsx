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

// Página de agradecimento pós-conversão — noindex (não é conteúdo público).
export const metadata: Metadata = {
  title: "Seu guia Cadeira Cheia está a caminho | BestBarbers",
  description: "Obrigado! Seu guia Cadeira Cheia já está a caminho do seu WhatsApp e e-mail.",
  robots: { index: false, follow: false },
};

export default function ObrigadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
