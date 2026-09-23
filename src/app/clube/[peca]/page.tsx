/**
 * /clube/[peca] — UMA página por anúncio do funil de clube. Um template, onze
 * configurações (cap. 36 §4). Nunca copie este arquivo para criar a 12ª página:
 * ela é uma entrada em `lib/tracking/portas-clube.ts` (slug + porta) e outra em
 * `content/clube-pecas.ts` (texto). O `tsc` exige as duas.
 *
 * - `dynamicParams = false`: só os onze slugs existem; qualquer outro é 404. Um
 *   slug digitado errado no anúncio NÃO cai numa página genérica calada — some, e
 *   o LPV do conjunto despenca no primeiro dia, onde dá para ver.
 * - As onze são geradas no build (`generateStaticParams`). Nada é lido da URL no
 *   servidor: UTM, conjunto, anúncio e origem do Ploomes são resolvidos no cliente,
 *   pelo formulário (`useUtmParams` → `buildLeadAttribution`), como no resto do site.
 * - `noindex` vem da casca (`layout.tsx`), nunca daqui.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PcPagina } from "../../projeto-do-clube/_components/PcPagina";
import { configDaPaginaClube } from "@/content/clube-pecas";
import { SLUGS_CLUBE, ehSlugClube } from "@/lib/tracking/portas-clube";

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
    openGraph: {
      title: conteudo.titulo,
      description: conteudo.apoio,
      siteName: "BestBarbers",
      locale: "pt_BR",
      type: "website",
      url: rota,
    },
  };
}

export default async function ClubePecaPage({ params }: PropsDaRota) {
  const { peca } = await params;
  if (!ehSlugClube(peca)) notFound();
  return <PcPagina config={configDaPaginaClube(peca)} />;
}
