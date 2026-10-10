import type { Metadata } from "next";
import { TEXTOS_AREA } from "@/content/curso-assinatura";
import { AreaDoAluno } from "./_components/AreaDoAluno";

/**
 * /curso-assinatura/aluno — a área do aluno do curso de assinatura (contrato `02-contrato-tecnico.md`
 * §3, no bestbarbers-ai). Abre só com o link pessoal (`#t=<token>` ou o token guardado no aparelho).
 *
 * Sem indexação (`noindex`, `Disallow` no robots.ts, fora do sitemap), sem `Referer` e sem
 * rastreador: o GTM e o pixel do layout raiz têm a guarda pelo caminho desta página.
 *
 * TEXTOS PENDENTES DE APROVAÇÃO DO ANDRÉ (`src/content/curso-assinatura.ts`).
 */
export const metadata: Metadata = {
  title: TEXTOS_AREA.seo.titulo,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default function AreaDoAlunoPage() {
  return <AreaDoAluno />;
}
