import { useCallback } from 'react';

/**
 * Hook para aplicar máscara de telefone brasileiro
 * Formato: (99) 99999-9999
 */
export const usePhoneMask = () => {
  const applyPhoneMask = useCallback((value: string): string => {
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara (99) 99999-9999
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    return value;
  }, []);

  const removeMask = useCallback((value: string): string => {
    return value.replace(/\D/g, '');
  }, []);

  const isValidPhone = useCallback((value: string): boolean => {
    const cleaned = removeMask(value);
    return cleaned.length === 10 || cleaned.length === 11;
  }, [removeMask]);

  return {
    applyPhoneMask,
    removeMask,
    isValidPhone
  };
};
