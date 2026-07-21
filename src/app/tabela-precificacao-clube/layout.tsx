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
  title: "Tabela de Precificação de Clubes — Quanto cobrar na assinatura da barbearia | BestBarbers",
  description:
    "Descubra em 1 minuto o preço certo do clube de assinatura da sua barbearia. Arraste os controles com o valor do seu corte, cadeiras e comissão — e veja a mensalidade recomendada pela Regra dos 2 Cortes, a margem da barbearia e o ganho real do barbeiro. Ferramenta gratuita.",
  alternates: {
    canonical: "/tabela-precificacao-clube",
  },
  openGraph: {
    title:
      "Tabela de Precificação de Clubes — Quanto cobrar na assinatura da barbearia | BestBarbers",
    description:
      "O erro que mata clube de assinatura é o preço chutado. Calcule grátis a mensalidade recomendada pela Regra dos 2 Cortes — com margem da barbearia e ganho do barbeiro na mesma tela.",
    url: "https://www.bestbarbers.app/tabela-precificacao-clube",
    type: "website",
    locale: "pt_BR",
    siteName: "BestBarbers",
  },
};

export default function TabelaPrecificacaoClubeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Sem GTM container próprio (aprendizado 02/Jul da /calculadora-prejuizo:
    // container extra dobrava o evento Lead). Tracking oficial = código
    // (useLeadForm/useMetaPixel) + GTM global.
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>
      {children}
    </div>
  );
}
