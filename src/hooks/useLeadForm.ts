import { useState, useCallback, useRef } from 'react';
import { usePhoneMask } from './usePhoneMask';
import { usePloomesAPI, type PloomesContactData } from './usePloomesAPI';
import { useWhatsAppRedirect } from './useWhatsAppRedirect';
import { useMetaPixel } from './useMetaPixel';
import { useUtmParams } from './useUtmParams';

export interface FormData {
  barbershopName: string;
  ownerName: string;
  whatsapp: string;
  monthlyRevenue: string;
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
    ownerName: '',
    whatsapp: '',
    monthlyRevenue: '',
    employeeCount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDedupChecking, setIsDedupChecking] = useState(false);
  // Cache do resultado do dedup pra evitar duplo round-trip no submit
  const dedupCacheRef = useRef<{ phone: string; exists: boolean } | null>(null);

  const { applyPhoneMask, isValidPhone } = usePhoneMask();
  const { submitLead, checkPhoneExists } = usePloomesAPI({ originId, originDesc });
  const { redirectToWhatsApp: redirect } = useWhatsAppRedirect();
  const { trackLead, trackCompleteRegistration } = useMetaPixel();
  const { getUtmParams } = useUtmParams();

  // Dedup non-blocking — roda quando whatsapp atinge 11+ digitos
  const runBackgroundDedup = useCallback(async (rawPhone: string) => {
    const phoneDigits = rawPhone.replace(/\D/g, '');
    if (phoneDigits.length < 11) return;
    if (dedupCacheRef.current?.phone === phoneDigits) return;

    setIsDedupChecking(true);
    try {
      const aiApiUrl = process.env.NEXT_PUBLIC_BBAI_API_URL;
      if (aiApiUrl) {
        try {
          const res = await fetch(`${aiApiUrl}/api/leads/check?phone=${phoneDigits}`);
          const data = await res.json();
          if (data?.data?.exists) {
            dedupCacheRef.current = { phone: phoneDigits, exists: true };
            return;
          }
        } catch { /* fallback Ploomes */ }
      }
      try {
        const exists = await checkPhoneExists(rawPhone);
        dedupCacheRef.current = { phone: phoneDigits, exists };
      } catch {
        dedupCacheRef.current = { phone: phoneDigits, exists: false };
      }
    } finally {
      setIsDedupChecking(false);
    }
  }, [checkPhoneExists]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Aplica máscara apenas no campo whatsapp
    if (name === 'whatsapp') {
      const maskedValue = applyPhoneMask(value);
      setFormData(prev => ({ ...prev, [name]: maskedValue }));
      // Dispara dedup em background quando o telefone fica completo
      void runBackgroundDedup(maskedValue);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpa erro anterior se houver
    if (submitError) {
      setSubmitError(null);
    }
  }, [applyPhoneMask, submitError, runBackgroundDedup]);

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

    // Bloqueia submit duplo enquanto dedup background ainda nao terminou
    if (isDedupChecking) {
      setSubmitError('Validando seus dados, aguarde um instante...');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const aiApiUrl = process.env.NEXT_PUBLIC_BBAI_API_URL;
      const phoneDigitsCurrent = formData.whatsapp.replace(/\D/g, '');

      // Reusa cache do dedup background; se nao bate, faz check sincrono
      const cached = dedupCacheRef.current;
      const cacheValid = cached && cached.phone === phoneDigitsCurrent;

      if (cacheValid && cached.exists) {
        setSubmitError('Você já tem um diagnóstico agendado! Entraremos em contato em breve.');
        setIsSubmitting(false);
        return;
      }

      if (!cacheValid) {
        // Dedup check sincrono — sem cache valido (telefone editado tarde)
        if (aiApiUrl) {
          try {
            const checkRes = await fetch(`${aiApiUrl}/api/leads/check?phone=${phoneDigitsCurrent}`);
            const checkData = await checkRes.json();
            if (checkData?.data?.exists) {
              setSubmitError('Você já tem um diagnóstico agendado! Entraremos em contato em breve.');
              setIsSubmitting(false);
              return;
            }
          } catch {
            // Non-blocking: se dedup falhar, segue com submit normal
          }
        }
        try {
          const existsInPloomes = await checkPhoneExists(formData.whatsapp);
          if (existsInPloomes) {
            setSubmitError('Você já tem um diagnóstico agendado! Entraremos em contato em breve.');
            setIsSubmitting(false);
            return;
          }
        } catch {
          // Non-blocking: se Ploomes check falhar, segue com submit normal
        }
      }

      // Converte FormData para PloomesContactData
      const ploomesData: PloomesContactData = {
        barbershopName: formData.barbershopName,
        ownerName: formData.ownerName || undefined,
        whatsapp: formData.whatsapp,
        monthlyRevenue: formData.monthlyRevenue || undefined,
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

      // Marca como enviado com sucesso (mantém botão desabilitado durante redirect)
      setSubmitted(true);

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
    isDedupChecking,
    checkPhoneExists,
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
      ownerName: '',
      whatsapp: '',
      monthlyRevenue: '',
      employeeCount: ''
    });
    setSubmitError(null);
  }, []);

  return {
    formData,
    isSubmitting,
    submitted,
    submitError,
    isDedupChecking,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm,
    isValidPhone: () => isValidPhone(formData.whatsapp)
  };
};
