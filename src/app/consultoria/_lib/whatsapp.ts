// O número é o mesmo do formulário de hoje: `NUMERO_WHATSAPP_LUCAS` em src/content/lucas-whatsapp.ts
// (confirmado com o chip em 07/Out/26). O código do card vai no fim da mensagem quando existe card.
import { NUMERO_WHATSAPP_LUCAS } from "../../../content/lucas-whatsapp.ts";
import { linkDoWhatsAppLucas, numeroValidoDoLucas } from "../../../lib/lead-nutricao.ts";

/**
 * Link do botão "Abrir o WhatsApp". Com card (envio ligado), sai no formato que o Lucas reconhece,
 * "(cód. <dealId>)". Sem card (envio desligado, hoje), sai só a mensagem. Sem número válido: null,
 * e a tela não mostra o botão.
 */
export function linkDaConsultoria(mensagem: string, dealId: number | null, numero: string = NUMERO_WHATSAPP_LUCAS): string | null {
  const destino = numeroValidoDoLucas(numero);
  if (!destino) return null;
  if (dealId) return linkDoWhatsAppLucas(numero, mensagem, dealId);
  return `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`;
}
