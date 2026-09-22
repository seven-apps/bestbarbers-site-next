/**
 * R2 — Situação 1: já vende plano e controla o clube na mão.
 *
 * Recebe os anúncios com o token `-MANUAL-` no nome (peças L001, L002, L003,
 * L004, L005, L008). Porta 2 («roda na mão») — a porta do pixel é a da PÁGINA e
 * quem a declara é `src/lib/tracking/porta.ts` (dono: B9), não esta rota.
 *
 * Contrato: 00-ARQUITETURA.md §1.1 (R2), §1.4 (peça padrão L001), §2.4.
 * - Server component: `searchParams` é Promise no Next 15.5.7 e precisa de `await`.
 * - A peça (L###) é resolvida NO SERVIDOR pela allow-list de `pecaDaRota` (V3);
 *   peça de outra situação, token ausente ou sem match caem em L001.
 * - `clubStatus` inicial («Já tenho o clube, mas gerencio manualmente») é
 *   resolvido pela situação em `pc-copy.ts` (§5.1), não repetido aqui.
 * - `robots: noindex, nofollow` vem do layout desta família (§2.4), nunca daqui.
 */
import type { Metadata } from "next";

import { PC_ABERTURAS, pecaDaRota } from "../_components/pc-copy";
import { PcPagina } from "../_components/PcPagina";
import type { PcPaginaConfig } from "../_components/pc.types";

const ABERTURA = PC_ABERTURAS.manual;
const ROTA = "/projeto-do-clube/clube-manual";

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

export default async function ClubeManualPage({ searchParams }: PropsDaRota) {
  const params = await searchParams;
  const bruto = params.utm_content;
  const utmContent = Array.isArray(bruto) ? (bruto[0] ?? "") : (bruto ?? "");

  const config: PcPaginaConfig = {
    situacao: "manual",
    rota: ROTA,
    source: "lp_projeto_manual",
    rotulo: "ClubeManual",
    peca: pecaDaRota("manual", utmContent),
  };

  return <PcPagina config={config} />;
}
