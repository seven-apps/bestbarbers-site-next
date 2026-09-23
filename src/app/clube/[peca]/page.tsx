/**
 * /clube/[peca] — UMA página por anúncio do funil de clube. Um template, onze configurações
 * (cap. 36 §4). A 12ª página é uma entrada em `lib/tracking/portas-clube.ts` (slug + porta) e
 * outra em `content/clube-pecas.ts` (texto); o `tsc` exige as duas. Nunca copie este arquivo.
 *
 * Este arquivo serve o braço `base` do A/B do herói. O braço `cena` é `/clube-cena/[peca]`,
 * servido por REWRITE do middleware (a URL no navegador continua esta) — ver `lib/ab-clube.ts`.
 *
 * - `dynamicParams = false`: só os onze slugs existem; slug errado no anúncio = 404, visível
 *   no LPV do primeiro dia, em vez de uma página genérica calada.
 * - Nada é lido da URL no servidor: UTM, conjunto, anúncio e origem do Ploomes são do formulário.
 * - `noindex` vem da casca (`layout.tsx`), nunca daqui.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { configDaPaginaClube } from "@/content/clube-pecas";
import { SLUGS_CLUBE, ehSlugClube } from "@/lib/tracking/portas-clube";
import { ClubePecaPagina } from "../_clube/ClubePecaPagina";

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS_CLUBE.map((peca) => ({ peca }));
}

interface PropsDaRota {
  params: Promise<{ peca: string }>;
}

export async function generateMetadata({ params }: PropsDaRota): Promise<Metadata> {
  const { peca } = await params;
  if (!ehSlugClube(peca)) return {};
  const { rota, peca: conteudo } = configDaPaginaClube(peca);
  return {
    title: conteudo.titulo,
    description: conteudo.apoio,
    alternates: { canonical: null },
    openGraph: { title: conteudo.titulo, description: conteudo.apoio, siteName: "BestBarbers", locale: "pt_BR", type: "website", url: rota },
  };
}

export default async function ClubePecaPage({ params }: PropsDaRota) {
  const { peca } = await params;
  if (!ehSlugClube(peca)) notFound();
  return <ClubePecaPagina slug={peca} variante="base" />;
}
