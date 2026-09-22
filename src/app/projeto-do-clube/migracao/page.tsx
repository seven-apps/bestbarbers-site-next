/**
 * R3 — Situação 2: tem clube em outro sistema e avalia trocar.
 *
 * Recebe os anúncios com o token `-MIGRA-` no nome (peças L011, L012, L013,
 * L016). Porta 3 («quer migrar») — declarada em `src/lib/tracking/porta.ts`
 * (dono: B9), não aqui.
 *
 * Contrato: 00-ARQUITETURA.md §1.1 (R3), §1.4 (peça padrão L011), §2.4.
 * - Server component: `searchParams` é Promise no Next 15.5.7 e precisa de `await`.
 * - A peça (L###) é resolvida NO SERVIDOR pela allow-list de `pecaDaRota` (V3).
 * - `clubStatus` inicial («Já tenho o clube, integrado no meu sistema de
 *   gestão») é resolvido pela situação em `pc-copy.ts` (§5.1).
 * - A copy desta situação não promete transferir cartões, manter todos os
 *   assinantes nem concluir migração antes da avaliação (§9).
 * - `robots: noindex, nofollow` vem do layout desta família (§2.4), nunca daqui.
 */
import type { Metadata } from "next";

import { PC_ABERTURAS, pecaDaRota } from "../_components/pc-copy";
import { PcPagina } from "../_components/PcPagina";
import type { PcPaginaConfig } from "../_components/pc.types";

const ABERTURA = PC_ABERTURAS.migracao;
const ROTA = "/projeto-do-clube/migracao";

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

export default async function MigracaoPage({ searchParams }: PropsDaRota) {
  const params = await searchParams;
  const bruto = params.utm_content;
  const utmContent = Array.isArray(bruto) ? (bruto[0] ?? "") : (bruto ?? "");

  const config: PcPaginaConfig = {
    situacao: "migracao",
    rota: ROTA,
    source: "lp_projeto_migracao",
    rotulo: "Migracao",
    peca: pecaDaRota("migracao", utmContent),
  };

  return <PcPagina config={config} />;
}
