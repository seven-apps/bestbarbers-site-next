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

// LP de captura (tráfego pago) — noindex pra não competir com as páginas de SEO
// (/clube-de-assinaturas, /clube) nem ser indexada como conteúdo orgânico.
// Mesmo padrão da /cadeira-cheia.
export const metadata: Metadata = {
  title: "Do Zero à Assinatura — o guia grátis pra montar o clube da sua barbearia | BestBarbers",
  description:
    "Baixe o guia gratuito Do Zero à Assinatura: a ficha de seis linhas que mostra quantos assinantes cabem na sua barbearia hoje — sem contratar ninguém e sem cadeira nova.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/do-zero-a-assinatura" },
};

export default function DoZeroAAssinaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
