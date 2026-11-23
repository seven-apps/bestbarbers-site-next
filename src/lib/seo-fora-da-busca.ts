import type { Metadata } from "next";

/**
 * Metadados de página de anúncio, formulário ou variante de teste: fora do Google.
 * Elas existem para o tráfego pago e para o time; indexadas, herdavam o título da home e disputavam
 * a busca com ela (SEO, 23/Nov/26). `follow: true` deixa o Google seguir os links para o site.
 */
export function foraDaBusca(title: string): Metadata {
  return { title, robots: { index: false, follow: true } };
}
