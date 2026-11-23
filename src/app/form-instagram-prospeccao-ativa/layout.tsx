import { foraDaBusca } from "@/lib/seo-fora-da-busca";

// Página de anúncio ou formulário do time: fora do Google (SEO, 23/Nov/26).
export const metadata = foraDaBusca("Formulário | BestBarbers");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
