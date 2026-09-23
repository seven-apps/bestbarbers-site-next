/**
 * Braço `cena` do A/B do herói de `/clube/[peca]`: a MESMA página, com a foto do anúncio no topo.
 * Ninguém chega aqui pela URL: o middleware faz REWRITE de `/clube/<slug>` para cá (o navegador
 * continua mostrando `/clube/<slug>`, que é a chave da porta, do `bb_lp_version` e da conversão
 * personalizada da Meta). Regra e métrica em `lib/ab-clube.ts`.
 * Só existem as 7 páginas com arte estática (`SLUGS_COM_CENA`); as de vídeo são sempre `base`.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { configDaPaginaClube } from "@/content/clube-pecas";
import { SLUGS_COM_CENA, temCena } from "@/lib/ab-clube";
import { ehSlugClube } from "@/lib/tracking/portas-clube";
import { ClubePecaPagina } from "../../clube/_clube/ClubePecaPagina";

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS_COM_CENA.map((peca) => ({ peca }));
}

interface PropsDaRota {
  params: Promise<{ peca: string }>;
}

export async function generateMetadata({ params }: PropsDaRota): Promise<Metadata> {
  const { peca } = await params;
  if (!ehSlugClube(peca) || !temCena(peca)) return {};
  const { peca: conteudo } = configDaPaginaClube(peca);
  return { title: conteudo.titulo, description: conteudo.apoio, alternates: { canonical: null } };
}

export default async function ClubeCenaPage({ params }: PropsDaRota) {
  const { peca } = await params;
  if (!ehSlugClube(peca) || !temCena(peca)) notFound();
  return <ClubePecaPagina slug={peca} variante="cena" />;
}
