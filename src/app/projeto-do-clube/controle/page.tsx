/**
 * /projeto-do-clube/controle — A OFERTA ATUAL, SANEADA.
 *
 * Para que ela existe: dar ao André uma base de comparação honesta. De um lado, a
 * abordagem nova («projeto do clube»); do outro, a abordagem atual («o produto»), com
 * o MESMO formulário, o MESMO rastreio e a MESMA qualidade de construção. Se o
 * controle perdesse por ser feio ou por pedir o contato de outro jeito, a leitura não
 * mediria mensagem — mediria construção.
 *
 * NADA aqui foi copiado da /v12. A /v12 foi lida para saber o que ela afirma; o que
 * saiu da oferta atual e por que saiu está registrado em
 * bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/paginas-projeto-clube/
 * CONTROLE-SANEAMENTO-V12.md. Sem esse registro, a comparação fica cega: ninguém
 * saberia se a diferença de conversão veio da mensagem ou das promessas removidas.
 *
 * Server component, estático de propósito: não lê `searchParams`. A peça desta rota é
 * fixa (não há allow-list de L### para a oferta atual) e a atribuição — UTM, `publico`,
 * `fbclid` — é resolvida no cliente pelo `useUtmParams` dentro do `PcFormulario`.
 * Não declarar `searchParams` mantém a rota estática e o LCP mais barato.
 *
 * `robots: noindex, nofollow` vem do `layout.tsx` da família, como manda §2.4 da
 * arquitetura — nunca do page. Se o layout não estiver no ar, esta rota indexa: é o
 * primeiro item de verificação do integrador.
 */

import type { Metadata } from "next";
import { ControlePagina } from "../_components/controle/ControlePagina";

export const metadata: Metadata = {
  title: "O sistema da BestBarbers para a sua barbearia",
  description:
    "App próprio com a sua marca, agendamento online, clube de assinaturas com cobrança no cartão, comissão por profissional e nota fiscal de serviço. A partir de R$299.",
  alternates: { canonical: null, languages: {} },
  openGraph: {
    title: "O sistema da BestBarbers para a sua barbearia",
    description:
      "App próprio com a sua marca, agenda, clube de assinaturas, comissão e nota fiscal no mesmo lugar.",
    images: [],
  },
};

export default function ControleRota() {
  return <ControlePagina />;
}
