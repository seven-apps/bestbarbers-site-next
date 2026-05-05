import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  variable: "--font-primary",
  display: "swap",
});

// Usando apenas Montserrat para ambas as variáveis CSS (primary e secondary)

export const metadata: Metadata = {
  title: "BestBarbers — Sistema para Barbearia com App Próprio, Clube de Assinaturas e Agendamento Online",
  description: "Sistema completo para barbearia: app próprio na App Store, clube de assinaturas, agendamento 24h, nota fiscal automática e financeiro. 1.200+ barbearias confiam.",
  keywords: [
    "sistema para barbearia",
    "app para barbearia",
    "app proprio barbearia",
    "clube de assinaturas barbearia",
    "agendamento online barbearia",
    "nota fiscal barbearia",
    "gestao barbearia",
    "software barbearia",
    "totem autoatendimento barbearia",
    "comissao barbeiro",
    "controle financeiro barbearia",
    "plataforma barbearia",
    "sistema gestao barbearia",
    "app personalizado barbearia",
  ],
  authors: [{ name: "BestBarbers" }],
  creator: "BestBarbers",
  publisher: "BestBarbers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.bestbarbers.app"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "https://www.bestbarbers.app",
      "x-default": "https://www.bestbarbers.app",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app",
    title: "BestBarbers — Sistema para Barbearia com App Próprio e Clube de Assinaturas",
    description: "Sistema completo para barbearia: app próprio na App Store, clube de assinaturas, agendamento 24h, nota fiscal automática e financeiro. 1.200+ barbearias confiam.",
    siteName: "BestBarbers",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BestBarbers — Sistema completo para barbearia com app próprio personalizado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BestBarbers — Sistema para Barbearia com App Próprio",
    description: "Sistema completo para barbearia: app próprio, clube de assinaturas, agendamento 24h e nota fiscal automática. 1.200+ barbearias confiam.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth overflow-x-hidden">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WTZDP6PL');
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1100195158903491');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1100195158903491&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${montserrat.variable} font-primary antialiased overflow-x-hidden max-w-[100vw]`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTZDP6PL"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
      </body>
    </html>
  );
}