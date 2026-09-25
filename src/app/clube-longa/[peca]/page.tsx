/**
 * Braço `longa` do A/B de página de `/clube/[peca]`: a página longa `/clube` (`ClubePage`, com o
 * formulário antigo), servida por REWRITE do middleware. Ninguém chega aqui pela URL: o navegador
 * continua mostrando `/clube/<slug>?<query>`, que é a chave da porta, do `bb_lp_version` e da
 * conversão personalizada da Meta. Regra e métrica em `lib/ab-clube.ts`.
 *
 * O slug existe só para o rewrite ter um destino por peça (`dynamicParams = false`: slug fora da
 * lista = 404, como no braço curto). A página não lê nada do slug: o `bb_lp_version`
 * (`clube-<slug>-longa`) sai do pathname do navegador + a `<meta name="bb-variante">` daqui.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClubePage } from "@/components/clube/ClubePage";
import { clubeContent } from "@/content/clube";
import { META_VARIANTE } from "@/lib/ab-clube";
import { SLUGS_CLUBE, ehSlugClube } from "@/lib/tracking/portas-clube";

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS_CLUBE.map((peca) => ({ peca }));
}

interface PropsDaRota {
  params: Promise<{ peca: string }>;
}

export const metadata: Metadata = {
  title: clubeContent.seo.title,
  description: clubeContent.seo.description,
  alternates: { canonical: null },
};

export default async function ClubeLongaPage({ params }: PropsDaRota) {
  const { peca } = await params;
  if (!ehSlugClube(peca)) notFound();
  return (
    <>
      {/* O braço do A/B, para o card do Ploomes e para todo evento do pixel (`lead-attribution.ts`, `useMetaPixel`). */}
      <meta name={META_VARIANTE} content="longa" />
      <ClubePage />
    </>
  );
}
