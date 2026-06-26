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
  /**
   * Exige seleção de faturamento médio no submit. Opt-in porque nem todo form
   * tem o campo monthlyRevenue (MultiStepForm, V5, V7). V12 passa true.
   */
  requireMonthlyRevenue?: boolean;
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
    requireMonthlyRevenue = false,
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
  // Cache do resultado do dedup pra evitar duplo round-trip no submit.
  // canReregister=true → lead reaquecido (perdido na Qualificação) → recadastra como novo.
  const dedupCacheRef = useRef<{ phone: string; exists: boolean; canReregister: boolean } | null>(null);

  const { applyPhoneMask, isValidPhone } = usePhoneMask();
  const { submitLead, checkPhoneStatus } = usePloomesAPI({ originId, originDesc });
  const { redirectToWhatsApp: redirect } = useWhatsAppRedirect();
  // trackLead em todo submit válido (gate aberto — Operação 400) + trackQualifiedLead
  // adicional quando score >= 30 (preserva leitura de CPQL). trackCompleteRegistration
  // foi removido em 910a080 (gerava duplicação Meta vs Ploomes 50% inflado).
  const { trackLead, trackQualifiedLead } = useMetaPixel();
  const { getUtmParams } = useUtmParams();

  // Resolve dedup + reativação. O Ploomes é a AUTORIDADE: decide se o telefone é
  // duplicata ativa (bloqueia) ou lead reaquecido — perdido na Qualificação e sem
  // ciclo aberto → recadastra como novo lead. Só se o Ploomes não conhece o telefone
  // é que a API do produto (BBAI) entra como rede extra (pega quem já é base).
  const resolveDedup = useCallback(async (rawPhone: string): Promise<{ exists: boolean; canReregister: boolean }> => {
    const status = await checkPhoneStatus(rawPhone);
    if (status.canReregister) return { exists: true, canReregister: true };
    if (status.exists) return { exists: true, canReregister: false };

    const aiApiUrl = process.env.NEXT_PUBLIC_BBAI_API_URL;
    if (aiApiUrl) {
      try {
        const res = await fetch(`${aiApiUrl}/api/leads/check?phone=${rawPhone.replace(/\D/g, '')}`);
        const data = await res.json();
        if (data?.data?.exists) return { exists: true, canReregister: false };
      } catch { /* ignora — segue como não encontrado */ }
    }
    return { exists: false, canReregister: false };
  }, [checkPhoneStatus]);

  // Dedup non-blocking — roda quando whatsapp atinge 11+ digitos
  const runBackgroundDedup = useCallback(async (rawPhone: string) => {
    const phoneDigits = rawPhone.replace(/\D/g, '');
    if (phoneDigits.length < 11) return;
    if (dedupCacheRef.current?.phone === phoneDigits) return;

    setIsDedupChecking(true);
    try {
      const result = await resolveDedup(rawPhone);
      dedupCacheRef.current = { phone: phoneDigits, ...result };
    } catch {
      dedupCacheRef.current = { phone: phoneDigits, exists: false, canReregister: false };
    } finally {
      setIsDedupChecking(false);
    }
  }, [resolveDedup]);

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
    // E-mail tornou-se opcional (OP400 15/Jun): se preenchido, valida o formato;
    // se vazio, segue (canal de contato é o WhatsApp). Reduz fricção visita→lead.
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return 'E-mail deve ser válido';
      }
    }
    if (!formData.whatsapp.trim()) {
      return 'WhatsApp é obrigatório';
    }
    if (!isValidPhone(formData.whatsapp)) {
      return 'WhatsApp deve ter formato válido';
    }
    if (requireMonthlyRevenue && !formData.monthlyRevenue?.trim()) {
      return 'Faturamento médio é obrigatório';
    }
    if (!formData.employeeCount?.trim()) {
      return 'Número de colaboradores é obrigatório';
    }
    if (!formData.interestedTool?.trim()) {
      return 'Interesse é obrigatório';
    }
    return null;
  }, [formData, isValidPhone, requireMonthlyRevenue]);

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

      // 1.1. BLOQUEIO ANTI-DUPLICATA (com exceção de reativação) — usa o resultado do
      // background dedup se já checou este telefone; senão consulta na hora (cobre quem
      // cola o número e clica antes do background terminar). Falha aberto (exists=false)
      // em erro/timeout, então nunca trava um lead legítimo. Bloqueia só se já existe E
      // NÃO é um lead reaquecido — perdido na Qualificação volta a entrar como novo lead.
      const cachedDedup = dedupCacheRef.current;
      const dedup = cachedDedup?.phone === phoneDigits
        ? cachedDedup
        : await resolveDedup(formData.whatsapp);
      if (dedup.exists && !dedup.canReregister) {
        setSubmitError('Já estamos em contato com este WhatsApp! Em breve um especialista te chama.');
        setIsSubmitting(false);
        return;
      }

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

      // 5. Meta Pixel + CAPI direta — GATE POR CAMPANHA (Operação 400, rev. 16/Jun/26):
      // ESCALA (OP400-ESCALA-*) otimiza por 'Lead' qualidade → só dispara score >= 30.
      // Demais campanhas/LPs (VALIDACAO, orgânico) → 'Lead' cru em todo submit.
      // 'QualifiedLead' (trackCustom) dispara sempre que score >= 30 (leitura de CPQL).
      // CAPI direta → bbai.bestbarbers.app (bestbarbers-ai dashboard). Fire-and-forget.
      // Meta deduplica via event_id → Pixel + Stape + CAPI direta = 1 evento contado.
      const capiUrl = process.env.NEXT_PUBLIC_BBAI_DASHBOARD_URL;
      // _fbp/_fbc são os cookies que a Meta usa para parear o evento do navegador com
      // o do servidor (CAPI). Sem eles a dedup depende só do event_id e pode contar 2×.
      const readCk = (n: string): string | undefined =>
        typeof document !== 'undefined'
          ? document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'))?.[1]
          : undefined;
      const fbp = readCk('_fbp');
      const fbc = readCk('_fbc');
      const sendCapiEvent = (eventName: 'Lead' | 'QualifiedLead', eventId: string): void => {
        if (!capiUrl) return;
        const nameParts = formData.ownerName.trim().split(/\s+/);
        fetch(`${capiUrl}/api/meta-capi/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName,
            eventId,
            userData: {
              phone: phoneDigits,
              email: formData.email.toLowerCase().trim(),
              firstName: nameParts[0]?.toLowerCase() || undefined,
              lastName: nameParts.slice(1).join(' ').toLowerCase() || undefined,
              country: 'br',
              fbp,
              fbc,
            },
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          }),
        }).catch(() => {});
      };

      const pixelData = {
        content_name: 'BestBarbers Lead Form Submission',
        content_category: 'lead_generation',
        barbershop_name: formData.barbershopName,
        employee_count: formData.employeeCount,
        lead_score: leadScore,
        ...(utmParams.utm_content && { content_id: utmParams.utm_content }),
      };

      // Nas campanhas de ESCALA da Operação 400, a Meta passou a otimizar pelo evento
      // padrão 'Lead' (melhor modelado que custom conversion). Para não treinar o
      // algoritmo com volume não-qualificado, o 'Lead' dessas campanhas só dispara
      // quando score >= 30. Nas demais campanhas/LPs (VALIDACAO, orgânico, etc.) o
      // 'Lead' segue disparando em TODO submit (Lead cru) — preserva a semântica delas.
      const isEscalaQualidade = /OP400-ESCALA/i.test(utmParams.utm_campaign || '');
      const leadQualifica = leadScore >= 30;

      const pixelPromises: Promise<void>[] = [];
      if (!isEscalaQualidade || leadQualifica) {
        pixelPromises.push(trackLead(pixelData, leadEventId));
        sendCapiEvent('Lead', leadEventId);
      }

      if (leadQualifica) {
        // Mesmo eventId com sufixo '-q' → dedup independente do Lead (Pixel + CAPI)
        pixelPromises.push(trackQualifiedLead(pixelData, `${leadEventId}-q`));
        sendCapiEvent('QualifiedLead', `${leadEventId}-q`);
      }

      await Promise.all(pixelPromises);

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
    trackQualifiedLead,
    getUtmParams,
    submitLead,
    resolveDedup,
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
