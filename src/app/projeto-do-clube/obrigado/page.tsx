/**
 * R6 — Confirmação pós-envio de `/projeto-do-clube`.
 *
 * Chega aqui só pelo `router.push` do `onSuccess` do `PcFormulario` (§1.1, R6).
 * Nenhum anúncio aponta, nenhum menu leva, nenhuma origem do Ploomes é resolvida
 * aqui — a pessoa já é lead quando esta rota abre.
 *
 * Contrato: 00-ARQUITETURA.md §1.1 (R6), §2.4, §2.5.
 * - Server component. Não lê `searchParams`: não há peça a resolver, e a query
 *   (que veio colada pelo `pc-link`) é lida no cliente só para manter os links
 *   internos com a atribuição intacta.
 * - **Nenhum evento de conversão.** O `useLeadForm` já disparou `Lead`,
 *   `QualifiedLead`, `QualifiedLead60` (e `LeadComEquipe`) no Pixel e na CAPI com
 *   o mesmo `eventId`, com `await` ANTES do redirect. §2.5: aqui só `PageView`,
 *   que o layout raiz dispara sozinho. O detalhe está no cabeçalho de
 *   `PcObrigado.tsx`.
 * - `robots: noindex, nofollow` vem do layout desta família (§2.4), nunca daqui.
 */
import type { Metadata } from "next";

import { PcObrigado } from "../_components/PcObrigado";

const ROTA = "/projeto-do-clube/obrigado";

export const metadata: Metadata = {
  title: "Recebemos seu pedido | BestBarbers",
  description:
    "O próximo passo é confirmar sua situação e apresentar as condições da implantação.",
  // Cancela o canonical "/" herdado do layout raiz: esta rota não é a home.
  alternates: { canonical: null },
  openGraph: {
    title: "Recebemos seu pedido | BestBarbers",
    description:
      "O próximo passo é confirmar sua situação e apresentar as condições da implantação.",
    siteName: "BestBarbers",
    locale: "pt_BR",
    type: "website",
    url: ROTA,
  },
};

export default function ProjetoDoClubeObrigadoPage() {
  return <PcObrigado />;
}
