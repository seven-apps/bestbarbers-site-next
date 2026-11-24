import type { Metadata } from "next";

/**
 * Metadados de página de anúncio, formulário ou variante de teste: fora do Google.
 * Elas existem para o tráfego pago e para o time; indexadas, herdavam o título da home e disputavam
 * a busca com ela (SEO, 23/Nov/26). `follow: true` deixa o Google seguir os links para o site.
 * O título segue o do site: quem chega pelo anúncio lê esse texto na aba, e fora do Google ele não disputa busca.
 */
export function foraDaBusca(): Metadata {
  return { robots: { index: false, follow: true } };
}
