import { redirect } from "next/navigation";
import { acharCupom, caminhoDoCupom } from "@/lib/cupom-parceiro";

/**
 * Link curto do cupom do parceiro (out/26): bestbarbers.app/cupom/seletto200 → a página do parceiro em modo cupom,
 * com a foto, a origem (comissão) e o cupom. É o link que vai no adesivo dos stories: o próprio endereço já mostra o
 * cupom. Código desconhecido ou vencido (depois de 31/Out) cai na página de parceiros sem desconto.
 */
export const dynamic = "force-dynamic";

export default async function CupomPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const cupom = acharCupom(decodeURIComponent(codigo));
  redirect(cupom ? caminhoDoCupom(cupom) : "/parceiros");
}
