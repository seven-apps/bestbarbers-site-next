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
// (/clube-de-assinaturas, /clube) nem ser indexada como conteúdo orgânico.
// Mesmo padrão da /cadeira-cheia, da /do-zero-a-assinatura e da /assinante-por-indicacao.
export const metadata: Metadata = {
  title:
    "Passo a passo pra sua barbearia rodar sem você — guia grátis pra quem tem equipe | BestBarbers",
  description:
    "Baixe o guia gratuito Passo a passo pra sua barbearia rodar sem você: o perfil que filtra antes da vaga, a contratação em 4 etapas, os 30 dias de POP, meta e bônus, a reunião trimestral e a saída sem drama. 12 capítulos, com ficha pra preencher.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/rodar-sem-voce" },
};

export default function RodarSemVoceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vollkorn.variable} ${montserrat.variable}`}>{children}</div>
  );
}
