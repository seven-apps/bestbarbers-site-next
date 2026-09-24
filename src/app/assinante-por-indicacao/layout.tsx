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
// Mesmo padrão da /cadeira-cheia e da /do-zero-a-assinatura.
export const metadata: Metadata = {
  title:
    "Assinante por Indicação — o guia grátis pra sua equipe trazer cliente novo que assina | BestBarbers",
  description:
    "Baixe o guia gratuito Assinante por Indicação: 6 passos, as mensagens prontas, a conta do convite e o checklist. Como transformar a cadeira dos seus barbeiros em canal de cliente novo — sem pagar anúncio.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/assinante-por-indicacao" },
};

export default function AssinantePorIndicacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
