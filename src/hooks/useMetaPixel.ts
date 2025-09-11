import { useCallback } from 'react';

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

// Declaração global para o fbq
declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: MetaPixelEventData) => void;
  }
}

/**
 * Hook para integração com Meta Pixel (Facebook Pixel)
 * Gerencia eventos de conversão e tracking
 */
export const useMetaPixel = () => {
  
  /**
   * Dispara evento de Lead (formulário preenchido)
   */
  const trackLead = useCallback((data?: MetaPixelEventData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'Lead', {
          content_name: 'BestBarbers Lead Form',
          content_category: 'lead_generation',
          ...data
        });
        console.log('Meta Pixel: Lead event tracked', data);
      } catch (error) {
        console.error('Erro ao rastrear evento Lead do Meta Pixel:', error);
      }
    }
  }, []);

  /**
   * Dispara evento de CompleteRegistration (cadastro completo)
   */
  const trackCompleteRegistration = useCallback((data?: MetaPixelEventData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'BestBarbers Registration',
          content_category: 'lead_generation',
          ...data
        });
        console.log('Meta Pixel: CompleteRegistration event tracked', data);
      } catch (error) {
        console.error('Erro ao rastrear evento CompleteRegistration do Meta Pixel:', error);
      }
    }
  }, []);

  /**
   * Dispara evento customizado
   */
  const trackCustomEvent = useCallback((eventName: string, data?: MetaPixelEventData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', eventName, data);
        console.log(`Meta Pixel: ${eventName} event tracked`, data);
      } catch (error) {
        console.error(`Erro ao rastrear evento ${eventName} do Meta Pixel:`, error);
      }
    }
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
