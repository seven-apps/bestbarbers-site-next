/**
 * Braço `longa` de `/clube/[peca]`: a página longa `/clube`, servida por REWRITE do middleware.
 * Desde 28/Set/26 (decisão do André) a página longa É a v2 da copy (`ClubeV2Page`) e é o ÚNICO
 * destino de todo anúncio de clube: o sorteio tem um braço só (`lib/ab-clube.ts`).
 * O rótulo continua `longa` de propósito: o placar do ciclo e o e-mail por anúncio reconhecem
 * o card pelo sufixo `-longa` do `bb_lp_version`; rótulo novo deixaria lead sem e-mail. Ninguém chega aqui pela URL: o navegador
 * continua mostrando `/clube/<slug>?<query>`, que é a chave da porta, do `bb_lp_version` e da
 * conversão personalizada da Meta. Regra e métrica em `lib/ab-clube.ts`.
 *
 * O slug existe só para o rewrite ter um destino por peça (`dynamicParams = false`: slug fora da
 * lista = 404, como no braço curto). A página não lê nada do slug: o `bb_lp_version`
 * (`clube-<slug>-longa`) sai do pathname do navegador + a `<meta name="bb-variante">` daqui.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClubeV2Page } from "@/components/clube-v2/ClubeV2Page";
import { clubeV2Content } from "@/content/clube-v2";
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
  title: clubeV2Content.seo.title,
  description: clubeV2Content.seo.description,
  alternates: { canonical: null },
};

export default async function ClubeLongaPage({ params }: PropsDaRota) {
  const { peca } = await params;
  if (!ehSlugClube(peca)) notFound();
  return (
    <>
      {/* O braço do A/B, para o card do Ploomes e para todo evento do pixel (`lead-attribution.ts`, `useMetaPixel`). */}
      <meta name={META_VARIANTE} content="longa" />
      <ClubeV2Page />
    </>
  );
}
