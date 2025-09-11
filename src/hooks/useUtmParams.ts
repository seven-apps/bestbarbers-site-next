import { useCallback, useMemo } from 'react';

export interface UtmParams {
  utm_source: string | null;
  utm_desc: string | null;
  utm_inf: string | null;
}

export interface OriginMapping {
  originId: number | null;
  originDesc: string | null;
  clickupId: number | null;
}

/**
 * Hook para gerenciar parâmetros UTM e mapeamento de origens
 */
export const useUtmParams = () => {
  // Mapeamento de source para origin IDs
  const originMap = useMemo(() => ({
    'matheus-contador': 120000463,
    'isaac-arts': 120000462,
    'octos': 40214626,
    'infoss': 40215699,
    'hellen-braganca': 40214766,
    'joao-seletto': 40214765,
    'matheus-dezembro': 40213475,
    'james-imersao': 40213288,
    'rayslander': 40213234,
    'Rapha-BF': 40213160,
    'FDO': 40213108,
    'james': 40212359,
    'robson-contador': 40211158,
    'site': 40210426,
    'insta': 40210374,
    'joao-contador': 40210187,
    'clube-do-sam': 40210171,
    'ads': 40210173
  }), []);

  // Mapeamento de source para ClickUp IDs
  const clickupMap = useMemo(() => ({
    'octos': 18,
    'infoss': 15,
    'hellen-braganca': 13,
    'joao-seletto': 12,
    'matheus-dezembro': 8,
    'james-imersao': 5,
    'rayslander': 9,
    'Rapha-BF': 3,
    'FDO': 4,
    'james': 6,
    'robson-contador': 7,
    'site': 2,
    'insta': 1,
    'joao-contador': 10,
    'clube-do-sam': 11,
    'ads': 0,
    'rapha': 3
  }), []);

  // Mapeamento de descrições personalizadas
  const descMap = useMemo(() => ({
    'matheus-contador': 'LP - Matheus Contador',
    'isaac-arts': 'LP - Isaac Arts',
    'octos': 'LP - Pedro Octos',
    'robson-contador': 'Robson Rafael - Contador',
    'joao-contador': 'João Souza - Contador',
    'clube-do-sam': 'Samuel - Clube do Sam'
  }), []);

  const getUtmParams = useCallback((): UtmParams => {
    if (typeof window === 'undefined') {
      return {
        utm_source: null,
        utm_desc: null,
        utm_inf: null
      };
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('source'),
      utm_desc: urlParams.get('desc'),
      utm_inf: urlParams.get('inf')
    };
  }, []);

  const getOriginMapping = useCallback((utmParams: UtmParams): OriginMapping => {
    const { utm_source, utm_desc } = utmParams;
    
    const originId = utm_source ? originMap[utm_source as keyof typeof originMap] || null : null;
    const clickupId = utm_source ? clickupMap[utm_source as keyof typeof clickupMap] || null : null;
    const originDesc = utm_source ? descMap[utm_source as keyof typeof descMap] || utm_desc : utm_desc;

    return {
      originId,
      originDesc,
      clickupId
    };
  }, [originMap, clickupMap, descMap]);

  return {
    getUtmParams,
    getOriginMapping,
    originMap,
    clickupMap,
    descMap
  };
};
