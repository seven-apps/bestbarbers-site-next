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
    "Como pagar a comissão do barbeiro na assinatura — guia grátis pra quem tem clube e equipe | BestBarbers",
  description:
    "Baixe o guia gratuito Como pagar a comissão do barbeiro na assinatura: a conta do barbeiro por mês, o pote da equipe, as fichas de cada serviço, o fechamento do mês com prova real e o roteiro da reunião com a equipe. 8 capítulos, com ficha pra preencher.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/comissao-barbeiro-assinatura" },
};

export default function ComissaoBarbeiroAssinaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
