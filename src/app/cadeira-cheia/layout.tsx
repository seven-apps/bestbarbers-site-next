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
// nem ser indexada como conteúdo orgânico.
export const metadata: Metadata = {
  title: "Cadeira Cheia — o guia grátis pra trazer de volta o cliente que sumiu | BestBarbers",
  description:
    "Baixe o guia gratuito Cadeira Cheia: o passo a passo pra identificar quem parou de aparecer na sua cadeira e trazer de volta — sem anúncio, indicação ou desconto.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cadeira-cheia" },
};

export default function CadeiraCheiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
