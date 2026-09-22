/**
 * R4 — Situação 3: vai abrir barbearia com equipe.
 *
 * Recebe os anúncios com o token `-ABERT-` no nome (peça L031, única aprovada
 * desta situação). Porta 1 («não roda, quer entender») — declarada em
 * `src/lib/tracking/porta.ts` (dono: B9), não aqui.
 *
 * Contrato: 00-ARQUITETURA.md §1.1 (R4), §1.4 (peça padrão L031), §2.4.
 * - Server component: `searchParams` é Promise no Next 15.5.7 e precisa de `await`.
 * - A peça (L###) é resolvida NO SERVIDOR pela allow-list de `pecaDaRota` (V3).
 * - `clubStatus` inicial («Ainda não tenho, mas tenho muito interesse em
 *   implementar») é resolvido pela situação em `pc-copy.ts` (§5.1).
 * - A copy trata a data de abertura como insumo da implantação, nunca como
 *   promessa de entrega nessa data (§9).
 * - `robots: noindex, nofollow` vem do layout desta família (§2.4), nunca daqui.
 */
import type { Metadata } from "next";

import { PC_ABERTURAS, pecaDaRota } from "../_components/pc-copy";
import { PcPagina } from "../_components/PcPagina";
import type { PcPaginaConfig } from "../_components/pc.types";

const ABERTURA = PC_ABERTURAS.abertura;
const ROTA = "/projeto-do-clube/abertura";

export const metadata: Metadata = {
  title: ABERTURA.titulo,
  description: ABERTURA.apoio,
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

export default async function AberturaPage({ searchParams }: PropsDaRota) {
  const params = await searchParams;
  const bruto = params.utm_content;
  const utmContent = Array.isArray(bruto) ? (bruto[0] ?? "") : (bruto ?? "");

  const config: PcPaginaConfig = {
    situacao: "abertura",
    rota: ROTA,
    source: "lp_projeto_abertura",
    rotulo: "Abertura",
    peca: pecaDaRota("abertura", utmContent),
  };

  return <PcPagina config={config} />;
}
