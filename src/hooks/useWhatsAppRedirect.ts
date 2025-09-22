import { useCallback } from 'react';
import { useUtmParams } from './useUtmParams';

/**
 * Hook para gerenciar redirecionamento para WhatsApp
 */
export const useWhatsAppRedirect = () => {
  const { getUtmParams } = useUtmParams();

  const WHATSAPP_NUMBER = '5531990657164';
  const BASE_MESSAGE = 'Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20aplicativo%20personalizado%20para%20barbearias.';

  const redirectToWhatsApp = useCallback((customMessage?: string) => {
    const { utm_source, utm_inf } = getUtmParams();
    const baseLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${customMessage || BASE_MESSAGE}`;

    // Mapeamento de mensagens personalizadas por fonte
    const messageMap: { [key: string]: string } = {
      'matheus-contador': baseLink + "%0AConheci%20através%20do%20Matheus%20Contador",
      'isaac-arts': baseLink + "%0AConheci%20através%20do%20Isaac%20Arts",
      'infoss': baseLink + "%0AConheci%20através%20da%20Infoss",
      'octos': baseLink + "%0AConheci%20através%20do%20Pedro%20da%20barbearia%20Octos",
      'james-imersao': baseLink + "%0AConheci%20através%20da%20Imersão%20do%20James",
      'rayslander': baseLink + "%0AConheci%20através%20do%20Rayslander%20(Baixinho%20Hair)",
      'Rapha-BF': baseLink + "%0AConheci%20através%20do%20Rapha%20(BF)",
      'FDO': baseLink + "%0AConheci%20através%20do%20curso%20Fora%20de%20Operação%20do%20Rapha",
      'matheus-dezembro': baseLink + "%0AConheci%20através%20do%20Matheus%20Contador",
      'james': baseLink + "%0AConheci%20através%20do%20James",
      'robson-contador': baseLink + "%0AConheci%20através%20do%20Robson%20Contador",
      'site': baseLink + "%0AConheci%20através%20do%20site",
      'insta': baseLink + "%0AConheci%20através%20do%20Instagram",
      'clube-do-sam': baseLink + "%0AConheci%20através%20do%20Clube%20do%20Sam",
      'joao-contador': baseLink + "%0AConheci%20através%20do%20João%20Contador"
    };

    // Verifica UTM inf primeiro (tem prioridade)
    if (utm_inf === "Rapha") {
      window.location.href = baseLink + "%0AConheci%20através%20do%20anúncio%20do%20Rapha";
      return;
    }
    if (utm_inf === "Andre") {
      window.location.href = baseLink + "%0AConheci%20através%20do%20anúncio%20do%20Andre";
      return;
    }

    // Depois verifica UTM source
    const redirectUrl = utm_source ? messageMap[utm_source] : baseLink;
    window.location.href = redirectUrl || baseLink;
  }, [getUtmParams, BASE_MESSAGE, WHATSAPP_NUMBER]);

  const generateWhatsAppLink = useCallback((customMessage?: string): string => {
    const { utm_source, utm_inf } = getUtmParams();
    const baseLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${customMessage || BASE_MESSAGE}`;

    // Mapeamento de mensagens personalizadas por fonte
    const messageMap: { [key: string]: string } = {
      'matheus-contador': baseLink + "%0AConheci%20através%20do%20Matheus%20Contador",
      'isaac-arts': baseLink + "%0AConheci%20através%20do%20Isaac%20Arts",
      'infoss': baseLink + "%0AConheci%20através%20da%20Infoss",
      'octos': baseLink + "%0AConheci%20através%20do%20Pedro%20da%20barbearia%20Octos",
      'james-imersao': baseLink + "%0AConheci%20através%20da%20Imersão%20do%20James",
      'rayslander': baseLink + "%0AConheci%20através%20do%20Rayslander%20(Baixinho%20Hair)",
      'Rapha-BF': baseLink + "%0AConheci%20através%20do%20Rapha%20(BF)",
      'FDO': baseLink + "%0AConheci%20através%20do%20curso%20Fora%20de%20Operação%20do%20Rapha",
      'matheus-dezembro': baseLink + "%0AConheci%20através%20do%20Matheus%20Contador",
      'james': baseLink + "%0AConheci%20através%20do%20James",
      'robson-contador': baseLink + "%0AConheci%20através%20do%20Robson%20Contador",
      'site': baseLink + "%0AConheci%20através%20do%20site",
      'insta': baseLink + "%0AConheci%20através%20do%20Instagram",
      'clube-do-sam': baseLink + "%0AConheci%20através%20do%20Clube%20do%20Sam",
      'joao-contador': baseLink + "%0AConheci%20através%20do%20João%20Contador"
    };

    // Verifica UTM inf primeiro
    if (utm_inf === "Rapha") {
      return baseLink + "%0AConheci%20através%20do%20anúncio%20do%20Rapha";
    }
    if (utm_inf === "Andre") {
      return baseLink + "%0AConheci%20através%20do%20anúncio%20do%20Andre";
    }

    // Depois verifica UTM source
    return utm_source ? messageMap[utm_source] || baseLink : baseLink;
  }, [getUtmParams, BASE_MESSAGE, WHATSAPP_NUMBER]);

  return {
    redirectToWhatsApp,
    generateWhatsAppLink,
    WHATSAPP_NUMBER,
    BASE_MESSAGE
  };
};
