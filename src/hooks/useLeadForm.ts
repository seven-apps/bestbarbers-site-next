import { useState, useCallback, useRef } from 'react';
import { usePhoneMask } from './usePhoneMask';
import { usePloomesAPI, type PloomesContactData } from './usePloomesAPI';
import { useWhatsAppRedirect } from './useWhatsAppRedirect';
import { useMetaPixel } from './useMetaPixel';
import { useUtmParams } from './useUtmParams';

export interface FormData {
  barbershopName: string;
  ownerName: string;
  email: string;
  whatsapp: string;
  monthlyRevenue: string;
  employeeCount: string;
  interestedTool: string;
}

export interface UseLeadFormOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectToWhatsApp?: boolean;
  /** ID de origem customizado para o Ploomes - sobrescreve o mapeamento de UTM */
  originId?: number;
  /** Descrição de origem customizada para o Ploomes - sobrescreve o mapeamento de UTM */
  originDesc?: string;
  /** Source identifier para BBAI API (atribuição em relatórios). Default: 'lp_v5' (retrocompat). */
  source?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

/**
 * Hook principal para formulários de lead com integração completa
 * Combina máscara de telefone, envio para Ploomes e redirecionamento WhatsApp
 */
export const useLeadForm = (options: UseLeadFormOptions = {}) => {
  const {
    onSuccess,
    onError,
    redirectToWhatsApp = false,
    originId,
    originDesc,
    source = 'lp_v5',
  } = options;

  const [formData, setFormData] = useState<FormData>({
    barbershopName: '',
    ownerName: '',
    email: '',
    whatsapp: '',
    monthlyRevenue: '',
    employeeCount: '',
    interestedTool: ''
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
  // Apenas trackLead — trackCompleteRegistration foi removido em 910a080 (gerava
  // duplicação Meta vs Ploomes 50% inflado). Meta otimiza por "Lead" sozinho.
  const { trackLead } = useMetaPixel();
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
    if (!formData.ownerName.trim()) {
      return 'Nome do dono é obrigatório';
    }
    if (!formData.email.trim()) {
      return 'E-mail é obrigatório';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'E-mail deve ser válido';
    }
    if (!formData.whatsapp.trim()) {
      return 'WhatsApp é obrigatório';
    }
    if (!isValidPhone(formData.whatsapp)) {
      return 'WhatsApp deve ter formato válido';
    }
    if (!formData.employeeCount?.trim()) {
      return 'Número de colaboradores é obrigatório';
    }
    if (!formData.interestedTool?.trim()) {
      return 'Interesse é obrigatório';
    }
    return null;
  }, [formData, isValidPhone]);

  const handleSubmit = useCallback(async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    // Bloqueia submit duplo imediatamente
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Coleta de todos os campos e parâmetros
      const utmParams = getUtmParams();
      const phoneDigits = formData.whatsapp.replace(/\D/g, '');
      const initials = formData.ownerName.trim().split(/\s+/).map(n => n[0]).join('').toLowerCase();
      const leadEventId = `${Date.now()}-${initials}`;

      // 2. Cálculo de Lead Scoring (0-100+)
      let leadScore = 0;
      
      // Faturamento (Até -100 ou +40)
      if (formData.monthlyRevenue === 'Até R$ 2.000') {
        leadScore -= 100; // Desqualificado
      } else if (formData.monthlyRevenue === 'R$ 2.000 a R$ 10.000') {
        leadScore += 20;
      } else if (formData.monthlyRevenue === 'De R$ 10.000 a R$ 30.000') {
        leadScore += 40;
      } else if (formData.monthlyRevenue === 'Acima de R$ 30.000') {
        leadScore += 40;
      }

      // Interesse (10 ou 40)
      if (formData.interestedTool === 'Agenda e Controle Financeiro') {
        leadScore += 10;
      } else if (formData.interestedTool === 'Meu Próprio App + Clube de Assinaturas e emissão de NFs') {
        leadScore += 40;
      }

      // Colaboradores (0, 10 ou 20)
      if (formData.employeeCount === 'Sou apenas eu') {
        leadScore += 0;
      } else if (formData.employeeCount === '2 a 4 colaboradores') {
        leadScore += 10;
      } else if (formData.employeeCount === '5 ou mais colaboradores') {
        leadScore += 20;
      }

      // 3. DISPARO DATALAYER (Executado uma única vez após validação e coleta)
      if (typeof window !== 'undefined') {
        const nameParts = (formData.ownerName || '').trim().split(/\s+/);
        const firstName = nameParts[0]?.toLowerCase() || '';
        const lastName = nameParts.slice(1).join(' ').toLowerCase() || '';
        const phoneWithPlus = `+55${phoneDigits}`;
        const phoneWithoutPlus = `55${phoneDigits}`;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'form_submit', // Nome padrão solicitado anteriormente
          event_type: 'form_init', // Tag adicional para satisfazer a nomenclatura citada
          event_id: leadEventId,
          user_data: {
            email: formData.email.toLowerCase().trim(),
            phone: phoneWithPlus,
            phone_meta: phoneWithoutPlus,
            first_name: firstName,
            last_name: lastName,
          },
          custom_parameters: {
            barbershop_name: formData.barbershopName,
            monthly_revenue: formData.monthlyRevenue,
            employee_count: formData.employeeCount,
            interested_tool: formData.interestedTool,
            lead_score: leadScore,
            lp_version: source,
          },
          utm_params: {
            source: utmParams.utm_source,
            medium: utmParams.utm_medium,
            campaign: utmParams.utm_campaign,
            content: utmParams.utm_content,
            term: utmParams.utm_term,
          }
        });
      }

      // 4. Integrações Externas (CRM e APIs)
      const ploomesData: PloomesContactData = {
        barbershopName: formData.barbershopName,
        ownerName: formData.ownerName || undefined,
        email: formData.email.toLowerCase().trim() || undefined,
        whatsapp: formData.whatsapp,
        monthlyRevenue: formData.monthlyRevenue || undefined,
        employeeCount: formData.employeeCount,
        interestedTool: formData.interestedTool,
        leadScore,
        leadEventId,
      };
      await submitLead(ploomesData);

      // 5. Meta Pixel + CAPI direta (Leads Qualificados: score ≥ 30)
      // CAPI direta → bbai.bestbarbers.app (bestbarbers-ai dashboard). Fire-and-forget.
      // Meta deduplica via event_id → Pixel + Stape + CAPI direta = 1 evento contado.
      if (leadScore >= 30) {
        const pixelData = {
          content_name: 'BestBarbers Lead Form Submission',
          content_category: 'lead_generation',
          barbershop_name: formData.barbershopName,
          employee_count: formData.employeeCount,
          lead_score: leadScore,
          ...(utmParams.utm_content && { content_id: utmParams.utm_content }),
        };
        await trackLead(pixelData, leadEventId);

        const capiUrl = process.env.NEXT_PUBLIC_BBAI_DASHBOARD_URL;
        if (capiUrl) {
          const nameParts = formData.ownerName.trim().split(/\s+/);
          fetch(`${capiUrl}/api/meta-capi/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventName: 'Lead',
              eventId: leadEventId,
              userData: {
                phone: phoneDigits,
                email: formData.email.toLowerCase().trim(),
                firstName: nameParts[0]?.toLowerCase() || undefined,
                lastName: nameParts.slice(1).join(' ').toLowerCase() || undefined,
                country: 'br',
              },
              eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
            }),
          }).catch(() => {});
        }
      }

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
    onSuccess,
    onError,
    redirectToWhatsApp,
    redirect,
    trackLead,
    getUtmParams,
    submitLead,
    source,
  ]);

  const resetForm = useCallback(() => {
    setFormData({
      barbershopName: '',
      ownerName: '',
      email: '',
      whatsapp: '',
      monthlyRevenue: '',
      employeeCount: '',
      interestedTool: ''
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
    isValidPhone: () => isValidPhone(formData.whatsapp),
  };
};
