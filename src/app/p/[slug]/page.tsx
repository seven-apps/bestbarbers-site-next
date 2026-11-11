import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { baseDoOS } from "@/lib/recadastro";
import { PaginaDoParceiro, type ParceiroDaPagina } from "./PaginaDoParceiro";

/**
 * PÁGINA DO PARCEIRO CRIADA PELO TIME (11/Nov/26) — bestbarbers.app/p/<slug>.
 *
 * O time cria o parceiro no dashboard de marketing (OS, Afiliados › Páginas dos parceiros): nome, barbearia e foto.
 * O OS cria a origem no Ploomes e guarda a foto; esta página lê pela rota pública e se refaz a cada 60 s (ISR), sem
 * deploy por parceiro. Se o OS cair, fica no ar a última versão boa da página.
 * Parceiro desligado ou link errado: vai para a /parceiros genérica (nunca uma página quebrada).
 * Os parceiros antigos continuam em /parceiros?source=<slug> (imageMap do HeroPartnerSection).
 */
export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return [];
}

interface ParceiroPublico {
  slug: string;
  nome: string;
  odesc: string;
  originId: number;
  foto: { caminho: string; largura: number; altura: number } | null;
}

const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** null = não existe ou foi desligado. Erro de rede/servidor LANÇA: o ISR mantém a última página boa. */
async function buscarParceiro(slug: string): Promise<ParceiroDaPagina | null> {
  if (!SLUG_VALIDO.test(slug) || slug.length > 60) return null;
  const base = baseDoOS();
  const res = await fetch(`${base}/api/parceiros-publico/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`parceiros-publico/${slug}: HTTP ${res.status}`);
  const p = (await res.json()) as ParceiroPublico;
  return {
    slug: p.slug,
    nome: p.nome,
    odesc: p.odesc,
    originId: p.originId,
    foto: p.foto ? { src: `${base}${p.foto.caminho}`, width: p.foto.largura, height: p.foto.altura } : null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await buscarParceiro(slug).catch(() => null);
  return {
    title: p ? `${p.nome} indica o BestBarbers | App próprio para a sua barbearia` : "BestBarbers",
    // Página de indicação, não de busca: igual em tudo menos a foto, ficaria como conteúdo duplicado.
    robots: { index: false, follow: true },
  };
}

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parceiro = await buscarParceiro(slug.toLowerCase());
  if (!parceiro) redirect("/parceiros");
  return <PaginaDoParceiro parceiro={parceiro} />;
}
