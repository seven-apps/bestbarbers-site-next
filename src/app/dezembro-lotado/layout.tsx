import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// LP de EVENTO — Projeto Dezembro Lotado (06/09/2026, Belo Horizonte).
// Efêmera: existe para o e-mail 3 da campanha aos inscritos do evento (botão
// "Garantir minha vaga"). noindex/nofollow e FORA do sitemap de propósito —
// não é página de SEO nem de tráfego pago.
export const metadata: Metadata = {
  title: "Dezembro Lotado — 25 vagas do app personalizado | BestBarbers",
  description:
    "Condição exclusiva para participantes do Projeto Dezembro Lotado: 25 vagas de gratuidade no desenvolvimento do app personalizado da sua barbearia.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dezembro-lotado" },
};

export default function DezembroLotadoLayout({ children }: { children: React.ReactNode }) {
  return <div className={montserrat.variable}>{children}</div>;
}
