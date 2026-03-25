import { useState, useCallback } from 'react';
import { usePhoneMask } from './usePhoneMask';
import { usePloomesAPI, type PloomesContactData } from './usePloomesAPI';
import { useWhatsAppRedirect } from './useWhatsAppRedirect';
import { useMetaPixel } from './useMetaPixel';
import { useUtmParams } from './useUtmParams';

export interface FormData {
  barbershopName: string;
  whatsapp: string;
  employeeCount: string;
}

export interface UseLeadFormOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectToWhatsApp?: boolean;
  /** ID de origem customizado para o Ploomes - sobrescreve o mapeamento de UTM */
  originId?: number;
  /** Descrição de origem customizada para o Ploomes - sobrescreve o mapeamento de UTM */
  originDesc?: string;
}

/**
 * Hook principal para formulários de lead com integração completa
 * Combina máscara de telefone, envio para Ploomes e redirecionamento WhatsApp
 */
export const useLeadForm = (options: UseLeadFormOptions = {}) => {
  const { 
    onSuccess, 
    onError, 
    redirectToWhatsApp = true,
    originId,
    originDesc
  } = options;

  const [formData, setFormData] = useState<FormData>({
    barbershopName: '',
    whatsapp: '',
    employeeCount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { applyPhoneMask, isValidPhone } = usePhoneMask();
  const { submitLead } = usePloomesAPI({ originId, originDesc });
  const { redirectToWhatsApp: redirect } = useWhatsAppRedirect();
  const { trackLead, trackCompleteRegistration } = useMetaPixel();
  const { getUtmParams } = useUtmParams();

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    // Aplica máscara apenas no campo whatsapp
    if (name === 'whatsapp') {
      const maskedValue = applyPhoneMask(value);
      setFormData(prev => ({ ...prev, [name]: maskedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpa erro anterior se houver
    if (submitError) {
      setSubmitError(null);
    }
  }, [applyPhoneMask, submitError]);

  const validateForm = useCallback((): string | null => {
    if (!formData.barbershopName.trim()) {
      return 'Nome da barbearia é obrigatório';
    }
    if (!formData.whatsapp.trim()) {
      return 'WhatsApp é obrigatório';
    }
    if (!isValidPhone(formData.whatsapp)) {
      return 'WhatsApp deve ter formato válido';
    }
    if (!formData.employeeCount.trim()) {
      return 'Número de cadeiras é obrigatório';
    }
    return null;
  }, [formData, isValidPhone]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Dedup check: verifica se lead já existe antes de enviar
      const aiApiUrl = process.env.NEXT_PUBLIC_BBAI_API_URL;
      if (aiApiUrl) {
        try {
          const phoneDigits = formData.whatsapp.replace(/\D/g, '');
          const checkRes = await fetch(`${aiApiUrl}/api/leads/check?phone=${phoneDigits}`);
          const checkData = await checkRes.json();
          if (checkData?.data?.exists) {
            setSubmitError('Você já tem um diagnóstico agendado! Entraremos em contato em breve.');
            return;
          }
        } catch {
          // Non-blocking: se dedup falhar, segue com submit normal
        }
      }

      // Converte FormData para PloomesContactData
      const ploomesData: PloomesContactData = {
        barbershopName: formData.barbershopName,
        whatsapp: formData.whatsapp,
        employeeCount: formData.employeeCount
      };

      // Lê UTM params para incluir grupo do anúncio nos eventos
      const utmParams = getUtmParams();

      // Envia dados para o Ploomes CRM PRIMEIRO — só dispara pixel se o contato for criado
      await submitLead(ploomesData);

      // Envia lead para BestBarbers AI (CAPI + SDR priority + revenue attribution)
      // Non-blocking: não trava o fluxo se falhar
      if (aiApiUrl) {
        const phoneDigits = formData.whatsapp.replace(/\D/g, '');
        fetch(`${aiApiUrl}/api/leads/simple`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.barbershopName,
            phone: phoneDigits,
            chairs: formData.employeeCount,
            source: 'lp_v5',
            utm_source: utmParams.utm_source || undefined,
            utm_medium: utmParams.utm_medium || undefined,
            utm_campaign: utmParams.utm_campaign || undefined,
            utm_content: utmParams.utm_content || undefined,
            utm_term: utmParams.utm_term || undefined,
          }),
        }).catch(() => { /* non-blocking */ });
      }

      // Dispara eventos de Lead + CompleteRegistration no Meta Pixel APÓS sucesso do Ploomes
      // Isso garante que Meta e Ploomes fiquem sincronizados (sem leads fantasma)
      const pixelData = {
        content_name: 'BestBarbers Lead Form Submission',
        content_category: 'lead_generation',
        barbershop_name: formData.barbershopName,
        employee_count: formData.employeeCount,
        ...(utmParams.utm_content && { content_id: utmParams.utm_content }),
      };

      const leadPixelPromise = trackLead(pixelData);
      const regPixelPromise = trackCompleteRegistration({
        content_name: 'BestBarbers Registration Complete',
        content_category: 'lead_generation',
        barbershop_name: formData.barbershopName,
        ...(utmParams.utm_content && { content_id: utmParams.utm_content }),
      });

      // Aguarda confirmação de que AMBOS os pixel events foram enviados ao Facebook
      // antes de redirecionar (window.location.href cancela requests pendentes)
      await Promise.all([leadPixelPromise, regPixelPromise]);

      // Chama callback de sucesso se fornecido
      onSuccess?.();

      // Redireciona para WhatsApp
      if (redirectToWhatsApp) {
        redirect();
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    validateForm,
    submitLead,
    onSuccess,
    onError,
    redirectToWhatsApp,
    redirect,
    trackLead,
    trackCompleteRegistration,
    getUtmParams
  ]);

  const resetForm = useCallback(() => {
    setFormData({
      barbershopName: '',
      whatsapp: '',
      employeeCount: ''
    });
    setSubmitError(null);
  }, []);

  return {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm,
    isValidPhone: () => isValidPhone(formData.whatsapp)
  };
};
