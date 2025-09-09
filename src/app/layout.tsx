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
      <body
        className={`${montserrat.variable} font-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}