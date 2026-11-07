// Fonte: ficha da consultoria on-line gratuita (04/Nov/26), no ar em 07/Nov/26. Fora do índice: a página é de campanha.
import type { Metadata } from "next";

const titulo = "Consultoria on-line gratuita para a sua barbearia";
const descricao = "Responda 7 perguntas de toque e receba na hora o seu plano: a distância até a sua meta e o primeiro passo.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "/consultoria", languages: {} },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: titulo, description: descricao, url: "/consultoria" },
  twitter: { title: titulo, description: descricao },
};

export default function ConsultoriaLayout({ children }: { children: React.ReactNode }) {
  // Montserrat já é carregada pelo layout raiz, na variável usada pelos tokens do site.
  return <div style={{ fontFamily: "var(--font-primary), Montserrat, sans-serif" }}>{children}</div>;
}
