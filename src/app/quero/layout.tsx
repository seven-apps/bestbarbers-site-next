import { foraDaBusca } from "@/lib/seo-fora-da-busca";

// Página só de campanha (adesivo de link dos stories): fora do Google (SEO, 23/Nov/26).
export const metadata = foraDaBusca();

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
