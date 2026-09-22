/**
 * R1 — Entrada geral da família `/projeto-do-clube`.
 *
 * Quem cai aqui chegou sem situação declarada (bio, e-mail, parceiro, anúncio
 * genérico). A página abre com a copy geral do cap. 13 e o seletor das quatro
 * situações visível — o seletor troca a copy e pré-preenche `clubStatus`,
 * **nunca navega** (V2 da arquitetura).
 *
 * Contrato: 00-ARQUITETURA.md §1.1 (R1), §1.4 (peça padrão L021), §2.4.
 * - Server component: `searchParams` é Promise no Next 15.5.7 e precisa de `await`.
 * - A peça (L###) é resolvida NO SERVIDOR, contra a allow-list de `pecaDaRota`
 *   (V3). Query param escolhe uma CHAVE de mapa fechado; nunca entrega texto.
 * - `robots: noindex, nofollow` vem do layout desta família (§2.4), nunca daqui.
 * - Origem do Ploomes não aparece na rota: quem resolve é o UTM dentro do
 *   formulário (§1.5). Nenhum `?origin=` no anúncio.
 */
import type { Metadata } from "next";

import { PC_ABERTURAS, pecaDaRota } from "./_components/pc-copy";
import { PcPagina } from "./_components/PcPagina";
import type { PcPaginaConfig } from "./_components/pc.types";

const ABERTURA = PC_ABERTURAS.geral;
const ROTA = "/projeto-do-clube";

export const metadata: Metadata = {
  title: ABERTURA.titulo,
  description: ABERTURA.apoio,
  // Cancela o canonical "/" herdado do layout raiz: esta rota não é a home.
  alternates: { canonical: null },
  openGraph: {
    title: ABERTURA.titulo,
    description: ABERTURA.apoio,
    siteName: "BestBarbers",
    locale: "pt_BR",
    type: "website",
    url: ROTA,
  },
};

interface PropsDaRota {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjetoDoClubePage({ searchParams }: PropsDaRota) {
  const params = await searchParams;
  const bruto = params.utm_content;
  const utmContent = Array.isArray(bruto) ? (bruto[0] ?? "") : (bruto ?? "");

  const config: PcPaginaConfig = {
    situacao: "geral",
    rota: ROTA,
    source: "lp_projeto_geral",
    rotulo: "Geral",
    peca: pecaDaRota("geral", utmContent),
  };

  return <PcPagina config={config} />;
}
