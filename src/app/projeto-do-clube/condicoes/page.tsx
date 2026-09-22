/**
 * R5 — Fatos comerciais de `/projeto-do-clube`, abertos antes do cadastro.
 *
 * Nenhum anúncio aponta para cá: a rota existe para ser LINKADA de dentro da
 * família (nota de preço do herói, bloco de condições, rodapé e confirmação),
 * como manda o cap. 13 — «não esconder recebimento, módulos ou contrato atrás do
 * cadastro» (§1.1, R5).
 *
 * Contrato: 00-ARQUITETURA.md §1.1 (R5), §2.4, §2.5.
 * - Server component. Sem `searchParams`: não há peça a resolver. A query é lida
 *   no cliente apenas para preservar a atribuição nos links de volta.
 * - **Sem formulário.** Quem quiser pedir contato volta para a entrada, onde mora
 *   o único formulário da família (§5.1, regra 1).
 * - `condicoes_abertas` (com `onde: "pagina"`) é disparado pelo componente, por
 *   `trackNonCatalogEvent`, com guarda em `Set` de módulo (§2.5).
 * - `robots: noindex, nofollow` vem do layout desta família (§2.4), nunca daqui.
 */
import type { Metadata } from "next";

import { PcCondicoesPagina } from "../_components/PcCondicoesPagina";

const ROTA = "/projeto-do-clube/condicoes";
const TITULO = "Entenda o que está incluído na sua contratação | BestBarbers";
const DESCRICAO =
  "Módulos, assistência, responsabilidades, cobrança, recebimento e contrato do clube de assinatura — os fatos que o time apresenta antes de agendar.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  // Cancela o canonical "/" herdado do layout raiz: esta rota não é a home.
  alternates: { canonical: null },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    siteName: "BestBarbers",
    locale: "pt_BR",
    type: "website",
    url: ROTA,
  },
};

export default function ProjetoDoClubeCondicoesPage() {
  return <PcCondicoesPagina />;
}
