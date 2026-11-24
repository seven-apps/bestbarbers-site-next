import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";

// A home é a dona de "app/aplicativo para barbearia" (é a URL que o Google já mostra nessas buscas, posição 4 a 6
// no Search Console de 90 dias até 21/Nov/26). "sistema para barbearia" fica com /sistema-para-barbearia, que o
// Google escolhe em ~80% das impressões dessa busca. Plano: bestbarbers-ai/docs/operacional/seo/PLANO.md.
export const metadata: Metadata = {
  title: "Aplicativo para Barbearia com a Sua Marca | BestBarbers",
  description:
    "App com a marca da sua barbearia na App Store e no Google Play, com agendamento, assinatura no cartão, comissão e nota fiscal. Mais de 1.200 barbearias usam.",
  alternates: { canonical: "/" },
  // `openGraph` fica só no layout: no Next, o openGraph da página SUBSTITUI o do layout inteiro (perderia imagem e título).
};

export default function Home() {
  return (
    <>
      <JsonLd />
      <HomePage />
    </>
  );
}
