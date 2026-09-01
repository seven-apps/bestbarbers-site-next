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
  title:
    "Assinatura do Zero — o guia grátis pra montar o clube da sua barbearia na ordem certa | BestBarbers",
  description:
    "Baixe o guia gratuito Assinatura do Zero: 8 capítulos, 20 minutos de leitura. Como desenhar o plano, quanto cobrar, o que dizer pra equipe, os 12 erros que derrubam o clube e o que esperar do mês 1 ao mês 12.",
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
