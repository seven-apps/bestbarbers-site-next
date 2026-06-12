import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { PodcastAttribution } from "@/components/podcast/PodcastAttribution";

/**
 * Destino dos links do Spotify (/podcast?desc=1.3): a home normal do site,
 * com a atribuição "Site - Podcast" carregada por baixo. Espelho da home —
 * noindex para não competir com "/" nos buscadores.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PodcastPage() {
  return (
    <>
      <PodcastAttribution />
      <JsonLd />
      <HomePage />
    </>
  );
}
