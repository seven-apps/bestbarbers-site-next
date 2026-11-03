// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
import type { Metadata } from "next";
import { getPublicContent } from "./_lib/content";

const opening = getPublicContent().screens.abertura;

export const metadata: Metadata = {
  title: opening.titulo,
  description: opening.texto,
  alternates: { canonical: "/diagnostico", languages: {} },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: opening.titulo, description: opening.texto, url: "/diagnostico" },
  twitter: { title: opening.titulo, description: opening.texto },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  // Montserrat já é carregada pelo layout raiz, na variável usada pelos tokens do site.
  return <div style={{ fontFamily: "var(--font-primary), Montserrat, sans-serif" }}>{children}</div>;
}
