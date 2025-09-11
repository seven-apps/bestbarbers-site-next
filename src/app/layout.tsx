import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-primary",
  display: "swap",
});

// Usando apenas Montserrat para ambas as variáveis CSS (primary e secondary)

export const metadata: Metadata = {
  title: "BestBarbers - App Próprio Personalizado para Barbearias",
  description: "Impulsione o seu negócio com um App Próprio + o melhor sistema de gerenciamento para barbearias! Mais de 700 barbearias ativaram o modo Best!",
  keywords: ["barbearia", "app", "agendamento", "sistema de gestão", "aplicativo móvel", "barbeiro"],
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
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app",
    title: "BestBarbers - App Próprio Personalizado para Barbearias", 
    description: "Impulsione o seu negócio com um App Próprio + o melhor sistema de gerenciamento para barbearias! Mais de 700 barbearias ativaram o modo Best!",
    siteName: "BestBarbers",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BestBarbers - App Próprio para Barbearias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BestBarbers - App Próprio Personalizado para Barbearias",
    description: "Impulsione o seu negócio com um App Próprio + o melhor sistema de gerenciamento para barbearias!",
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
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
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
        className={`${montserrat.variable} font-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}