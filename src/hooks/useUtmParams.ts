import { useCallback, useMemo } from "react";

export interface UtmParams {
  utm_source: string | null;
  utm_desc: string | null;
  utm_inf: string | null;
}

export interface OriginMapping {
  originId: number | null;
  originDesc: string | null;
}

/**
 * Hook para gerenciar parâmetros UTM e mapeamento de origens
 */
export const useUtmParams = () => {
  // Mapeamento de source para origin IDs
  const originMap = useMemo(
    () => ({
      "matheus-contador": 120000463,
      "isaac-arts": 120000462,
      octos: 40214626,
      infoss: 40215699,
      "hellen-braganca": 40214766,
      "joao-seletto": 40214765,
      "matheus-dezembro": 40213475,
      "james-imersao": 40213288,
      rayslander: 40213234,
      "Rapha-BF": 40213160,
      FDO: 40213108,
      james: 40212359,
      "robson-contador": 40211158,
      site: 40210426,
      insta: 40210374,
      "joao-contador": 40210187,
      "clube-do-sam": 40210171,
      ads: 40210173,
      "gabriel-gordovisk": 120000841,
      santiago: 120000842,
      rapha: 40211075,
      "maurilio-sr-bigode": 120000869,
      "edson-lapa": 120000870,
      mileno: 120000940,
      "henrique-daniels": 120000378,
      kaleo: 120000944,
      "araujo-salviano": 120001037,
      "bruno-estevao": 120001038,
      "igor-bezerra": 120001060,
    }),
    []
  );

  // Mapeamento de descrições personalizadas
  const descMap = useMemo(
    () => ({
      "matheus-contador": "LP - Matheus Contador",
      "isaac-arts": "LP - Isaac Arts",
      octos: "LP - Pedro Octos",
      "robson-contador": "Robson Rafael - Contador",
      "joao-contador": "João Souza - Contador",
      "clube-do-sam": "Samuel - Clube do Sam",
      "gabriel-gordovisk": "LP Gabriel Gordovisk - Programa de indicações",
      santiago: "LP Santiago - Programa de indicações",
      james: "LP James - Programa de indicações",
      rapha: "LP - Link através de postagens do Rapha",
      "maurilio-sr-bigode": "LP - Maurilio Sr. Bigode - Programa de indicações",
      "edson-lapa": "LP - Edson Lapa (Club Barbearia) - Programa de indicações",
      mileno: "LP Mileno - Parceria",
      "henrique-daniels": "LP Henrique Daniels - Programa de indicações",
      kaleo: "LP Kaleo - Programa de indicações",
      "araujo-salviano": "LP - Araújo Salviano - Programa de indicações",
      "bruno-estevao": "LP - Bruno Estêvão - Programa de indicações",
      "igor-bezerra": "LP - Igor Bezerra - Programa de indicações",
    }),
    []
  );

  const getUtmParams = useCallback((): UtmParams => {
    if (typeof window === "undefined") {
      return {
        utm_source: null,
        utm_desc: null,
        utm_inf: null,
      };
    }

    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get("source"),
      utm_desc: urlParams.get("desc"),
      utm_inf: urlParams.get("inf"),
    };
  }, []);

  const getOriginMapping = useCallback(
    (utmParams: UtmParams): OriginMapping => {
      const { utm_source, utm_desc } = utmParams;

      const originId = utm_source
        ? originMap[utm_source as keyof typeof originMap] || null
        : null;

      const originDesc = utm_source
        ? descMap[utm_source as keyof typeof descMap] || utm_desc
        : utm_desc;

      return {
        originId,
        originDesc,
      };
    },
    [originMap, descMap]
  );

  return {
    getUtmParams,
    getOriginMapping,
    originMap,
    descMap,
  };
};
