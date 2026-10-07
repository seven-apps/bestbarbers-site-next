import type { Metadata } from "next";
import { CAMINHO_VITRINE, TEXTOS_VITRINE } from "@/content/curso-assinatura";
import { VitrineCurso } from "./_components/VitrineCurso";

/**
 * /curso-assinatura — vitrine do curso de assinatura (estrutura decidida pelo André em 06/Out/26;
 * contrato `02-contrato-tecnico.md` no bestbarbers-ai). Indexável. O formulário é o de hoje; depois
 * dele, a pessoa vai direto para a área do aluno (`/curso-assinatura/aluno`) com o link pessoal.
 *
 * TEXTOS PENDENTES DE APROVAÇÃO DO ANDRÉ (`src/content/curso-assinatura.ts`).
 */
export const metadata: Metadata = {
  title: TEXTOS_VITRINE.seo.titulo,
  description: TEXTOS_VITRINE.seo.descricao,
  alternates: { canonical: CAMINHO_VITRINE },
  openGraph: {
    title: TEXTOS_VITRINE.seo.titulo,
    description: TEXTOS_VITRINE.seo.descricao,
    url: CAMINHO_VITRINE,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BestBarbers" }],
  },
};

export default function CursoAssinaturaPage() {
  return <VitrineCurso />;
}
