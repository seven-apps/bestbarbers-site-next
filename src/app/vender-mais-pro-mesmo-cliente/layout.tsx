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
// Mesmo padrão da /cadeira-cheia, da /do-zero-a-assinatura e da /assinante-por-indicacao.
export const metadata: Metadata = {
  title:
    "Como vender mais pro mesmo cliente na sua barbearia — guia grátis pra quem tem equipe | BestBarbers",
  description:
    "Baixe o guia gratuito Como vender mais pro mesmo cliente na sua barbearia: a métrica atendidos por vendidos, a ordem certa de lançar extra, o preço pelo custo real e o quadro por barbeiro. 12 capítulos, sem cliente novo e sem anúncio.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/vender-mais-pro-mesmo-cliente" },
};

export default function VenderMaisMesmoClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
