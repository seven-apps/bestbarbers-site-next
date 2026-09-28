import type { Metadata } from "next";
import { ClubeV2Page } from "@/components/clube-v2/ClubeV2Page";
import { clubeV2Content } from "@/content/clube-v2";

/**
 * /clube — destino de tráfego pago de clube de assinaturas.
 * Desde 28/Set/26 (decisão do André) a página é a v2 da copy (`ClubeV2Page`): didática,
 * celular primeiro, prova logo abaixo do herói. A página anterior (`ClubePage`) segue no
 * repositório só para rollback.
 * noindex/nofollow e FORA do sitemap: não canibaliza o SEO orgânico
 * da feature page /clube-de-assinaturas.
 */
export const metadata: Metadata = {
  title: clubeV2Content.seo.title,
  description: clubeV2Content.seo.description,
  robots: { index: false, follow: false },
};

export default function Clube() {
  return <ClubeV2Page />;
}
