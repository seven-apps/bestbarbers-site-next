import type { Metadata } from "next";
import { ClubeV2Page } from "@/components/clube-v2/ClubeV2Page";
import { clubeV2Content } from "@/content/clube-v2";

/**
 * /clube-v2 — a v2 da copy da página do clube (28/Set/26), para REVISÃO do André e, depois,
 * para o teste de página. Rota própria: a `/clube` é o braço `longa` do ciclo 1 e não se
 * toca no meio da leitura. noindex/nofollow e fora do sitemap, como a `/clube`.
 */
export const metadata: Metadata = {
  title: clubeV2Content.seo.title,
  description: clubeV2Content.seo.description,
  robots: { index: false, follow: false },
};

export default function ClubeV2() {
  return <ClubeV2Page />;
}
