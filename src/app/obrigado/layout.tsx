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

// Página de agradecimento pós-conversão — noindex (não é conteúdo público).
// TÍTULO E DESCRIÇÃO NÃO MORAM AQUI: a página serve VÁRIAS iscas (lê `?isca=`) e o
// título traz o NOME do guia, montado pelo `generateMetadata` do page.tsx, que tem
// acesso aos searchParams. O layout guarda só o que vale para todas as iscas.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ObrigadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
