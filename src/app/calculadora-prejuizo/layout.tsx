import type { Metadata } from "next";
import Script from "next/script";
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
  title: "Calculadora de Prejuízo da Barbearia — Quanto você perde por mês | BestBarbers",
  description:
    "Descubra em 1 minuto quanto sua barbearia deixa de faturar por mês sem clube de assinaturas. Calculadora gratuita baseada em cases reais da BestBarbers — 51 mil assinantes em 1.200 barbearias.",
  alternates: {
    canonical: "/calculadora-prejuizo",
  },
  openGraph: {
    title:
      "Calculadora de Prejuízo da Barbearia — Quanto você perde por mês | BestBarbers",
    description:
      "Descubra em 1 minuto quanto sua barbearia deixa de faturar por mês sem clube de assinaturas. Calculadora gratuita baseada em cases reais.",
    url: "https://www.bestbarbers.app/calculadora-prejuizo",
    type: "website",
    locale: "pt_BR",
    siteName: "BestBarbers",
  },
};

export default function CalculadoraPrejuizoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google Tag Manager - Calculadora de Prejuízo */}
      <Script id="gtm-calc-prejuizo" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WWR94GLQ');
        `}
      </Script>

      {/* Google Tag Manager (noscript) - Calculadora de Prejuízo */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WWR94GLQ"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <div className={`${vollkorn.variable} ${montserrat.variable}`}>
        {children}
      </div>
    </>
  );
}
