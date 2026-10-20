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
    "Como subir o preço da assinatura sem perder assinante — guia grátis pra quem já roda clube | BestBarbers",
  description:
    "Baixe o guia gratuito Como subir o preço da assinatura sem perder assinante: o termômetro do clube, a ordem do reajuste, a frase pra equipe e a mensagem pro assinante. 12 capítulos, passo a passo, sem perder a base.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/subir-preco-assinatura" },
};

export default function SubirPrecoAssinaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
