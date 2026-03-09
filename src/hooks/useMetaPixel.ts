import { useCallback } from 'react';

const PIXEL_ID = '1100195158903491';

// Tipos para os eventos do Meta Pixel
export interface MetaPixelEventData {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  barbershop_name?: string;
  monthly_revenue?: string;
  employee_count?: string;
  [key: string]: string | number | boolean | undefined;
}

// Declaração global para o fbq (inclui options com eventID para dedup)
declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      data?: MetaPixelEventData,
      options?: { eventID?: string }
    ) => void;
  }
}

/** Gera ID único para deduplicação de eventos */
const generateEventId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Dispara um image pixel diretamente para o endpoint do Facebook.
 * Funciona como fallback confiável — sobrevive a navegação e não depende do SDK.
 * Retorna uma Promise que resolve quando o Facebook recebe o evento.
 */
const sendImagePixel = (
  eventName: string,
  eventId: string,
  data?: MetaPixelEventData
): Promise<void> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve();
      return;
    }

    const img = new Image(1, 1);
    const timeout = setTimeout(resolve, 2000);

    img.onload = img.onerror = () => {
      clearTimeout(timeout);
      resolve();
    };

    const params = new URLSearchParams({
      id: PIXEL_ID,
      ev: eventName,
      eid: eventId,
      dl: window.location.href,
      rl: document.referrer || '',
      ts: String(Date.now()),
      noscript: '1',
    });

    if (data) {
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) {
          params.append(`cd[${key}]`, String(val));
        }
      }
    }

    img.src = `https://www.facebook.com/tr/?${params.toString()}`;
  });

/**
 * Hook para integração com Meta Pixel (Facebook Pixel)
 * Gerencia eventos de conversão e tracking.
 *
 * Usa duplo disparo (fbq SDK + image pixel) com eventID para deduplicação,
 * garantindo que o evento chegue ao Facebook mesmo que:
 * - o SDK ainda não tenha carregado (fila perdida no redirect)
 * - o SDK esteja bloqueado por ad-blocker
 * - a página navegue (redirect WhatsApp) antes do beacon completar
 */
export const useMetaPixel = () => {

  /**
   * Dispara evento de Lead (formulário preenchido)
   * Retorna Promise que resolve quando o image pixel confirma recebimento.
   */
  const trackLead = useCallback((data?: MetaPixelEventData): Promise<void> => {
    const eventId = generateEventId();
    const mergedData: MetaPixelEventData = {
      content_name: 'BestBarbers Lead Form',
      content_category: 'lead_generation',
      ...data,
    };

    // Disparo via SDK (envia dados ricos: cookies, user-agent etc.)
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'Lead', mergedData, { eventID: eventId });
        console.log('Meta Pixel: Lead event tracked via fbq', mergedData);
      } catch (error) {
        console.error('Erro ao rastrear evento Lead do Meta Pixel:', error);
      }
    } else {
      console.warn('Meta Pixel: fbq indisponível, usando apenas image pixel');
    }

    // Disparo via image pixel (fallback confiável, mesmo eventID para dedup)
    return sendImagePixel('Lead', eventId, mergedData);
  }, []);

  /**
   * Dispara evento de CompleteRegistration (cadastro completo)
   * Retorna Promise que resolve quando o image pixel confirma recebimento.
   */
  const trackCompleteRegistration = useCallback((data?: MetaPixelEventData): Promise<void> => {
    const eventId = generateEventId();
    const mergedData: MetaPixelEventData = {
      content_name: 'BestBarbers Registration',
      content_category: 'lead_generation',
      ...data,
    };

    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'CompleteRegistration', mergedData, { eventID: eventId });
        console.log('Meta Pixel: CompleteRegistration event tracked via fbq', mergedData);
      } catch (error) {
        console.error('Erro ao rastrear evento CompleteRegistration do Meta Pixel:', error);
      }
    } else {
      console.warn('Meta Pixel: fbq indisponível, usando apenas image pixel');
    }

    return sendImagePixel('CompleteRegistration', eventId, mergedData);
  }, []);

  /**
   * Dispara evento customizado
   */
  const trackCustomEvent = useCallback((eventName: string, data?: MetaPixelEventData): Promise<void> => {
    const eventId = generateEventId();

    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', eventName, data, { eventID: eventId });
        console.log(`Meta Pixel: ${eventName} event tracked`, data);
      } catch (error) {
        console.error(`Erro ao rastrear evento ${eventName} do Meta Pixel:`, error);
      }
    }

    return sendImagePixel(eventName, eventId, data);
  }, []);

  /**
   * Verifica se o Meta Pixel está disponível
   */
  const isPixelAvailable = useCallback((): boolean => {
    return typeof window !== 'undefined' && !!window.fbq;
  }, []);

  return {
    trackLead,
    trackCompleteRegistration,
    trackCustomEvent,
    isPixelAvailable
  };
};
