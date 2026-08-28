import type { Metadata } from "next";
import { ClubePage } from "@/components/clube/ClubePage";
import { clubeContent } from "@/content/clube";

/**
 * /clube — destino de tráfego pago de clube de assinaturas.
 * noindex/nofollow e FORA do sitemap: não canibaliza o SEO orgânico
 * da feature page /clube-de-assinaturas.
 */
export const metadata: Metadata = {
  title: clubeContent.seo.title,
  description: clubeContent.seo.description,
  robots: { index: false, follow: false },
};

export default function Clube() {
  return <ClubePage />;
}
