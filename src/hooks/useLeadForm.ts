import { useState, useCallback } from 'react';
import { usePhoneMask } from './usePhoneMask';
import { usePloomesAPI, type PloomesContactData } from './usePloomesAPI';
import { useWhatsAppRedirect } from './useWhatsAppRedirect';
import { useMetaPixel } from './useMetaPixel';

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
}

/**
 * Hook principal para formulários de lead com integração completa
 * Combina máscara de telefone, envio para Ploomes e redirecionamento WhatsApp
 */
export const useLeadForm = (options: UseLeadFormOptions = {}) => {
  const { 
    onSuccess, 
    onError, 
    redirectToWhatsApp = true 
  } = options;

  const [formData, setFormData] = useState<FormData>({
    barbershopName: '',
    ownerName: '',
    whatsapp: '',
    monthlyRevenue: '',
    employeeCount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { applyPhoneMask, isValidPhone } = usePhoneMask();
  const { submitLead } = usePloomesAPI();
  const { redirectToWhatsApp: redirect } = useWhatsAppRedirect();
  const { trackLead, trackCompleteRegistration } = useMetaPixel();

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
    if (!formData.ownerName.trim()) {
      return 'Nome do dono é obrigatório';
    }
    if (!formData.whatsapp.trim()) {
      return 'WhatsApp é obrigatório';
    }
    if (!isValidPhone(formData.whatsapp)) {
      return 'WhatsApp deve ter formato válido';
    }
    if (!formData.monthlyRevenue.trim()) {
      return 'Faturamento mensal é obrigatório';
    }
    if (!formData.employeeCount.trim()) {
      return 'Número de colaboradores é obrigatório';
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
      // Converte FormData para PloomesContactData
      const ploomesData: PloomesContactData = {
        barbershopName: formData.barbershopName,
        ownerName: formData.ownerName,
        whatsapp: formData.whatsapp,
        monthlyRevenue: formData.monthlyRevenue,
        employeeCount: formData.employeeCount
      };

      // Dispara evento de Lead no Meta Pixel
      trackLead({
        content_name: 'BestBarbers Lead Form Submission',
        content_category: 'lead_generation',
        barbershop_name: formData.barbershopName,
        monthly_revenue: formData.monthlyRevenue,
        employee_count: formData.employeeCount
      });

      // Envia dados para o Ploomes CRM
      await submitLead(ploomesData);

      // Dispara evento de CompleteRegistration no Meta Pixel após sucesso
      trackCompleteRegistration({
        content_name: 'BestBarbers Registration Complete',
        content_category: 'lead_generation',
        barbershop_name: formData.barbershopName
      });
      
      // Chama callback de sucesso se fornecido
      onSuccess?.();
      
      // Redireciona para WhatsApp se habilitado
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
    trackCompleteRegistration
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
    submitError,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm,
    isValidPhone: () => isValidPhone(formData.whatsapp)
  };
};
