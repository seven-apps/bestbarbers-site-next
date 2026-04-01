import { useCallback, useMemo } from "react";

export interface UtmParams {
  utm_source: string | null;
  utm_desc: string | null;
  utm_inf: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
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
      "kaique-alves": 120001128,
      "thais-dantunes": 40215957,
    }),
    []
  );

  // Mapeamento de descrições personalizadas
  const descMap = useMemo(
    () => ({
      ads: "LP - Lead Machine",
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
      "kaique-alves": "LP - Kaique Alves - Programa de indicações",
      "thais-dantunes": "LP - Thais D'Antunes - Programa de indicações",
    }),
    []
  );

  const getUtmParams = useCallback((): UtmParams => {
    if (typeof window === "undefined") {
      return {
        utm_source: null,
        utm_desc: null,
        utm_inf: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
      };
    }

    const urlParams = new URLSearchParams(window.location.search);

    // UTM padrão (Meta Ads: ?utm_source=meta&utm_medium=paid&utm_campaign=lead-machine&utm_content=grupo-a)
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmContent = urlParams.get("utm_content");
    const utmTerm = urlParams.get("utm_term");

    // Param legado de parceiros (?source=mileno) — compatibilidade mantida
    const legacySource = urlParams.get("source");

    return {
      utm_source: utmSource || legacySource,
      utm_desc: urlParams.get("desc"),
      utm_inf: urlParams.get("inf"),
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
    };
  }, []);

  const getOriginMapping = useCallback(
    (utmParams: UtmParams): OriginMapping => {
      const { utm_source, utm_desc } = utmParams;

      // utm_source=meta usa o mesmo originId de "ads" (40210173)
      const sourceKey = utm_source === "meta" ? "ads" : utm_source;

      const originId = sourceKey
        ? originMap[sourceKey as keyof typeof originMap] || null
        : null;

      let originDesc = sourceKey
        ? descMap[sourceKey as keyof typeof descMap] || utm_desc
        : utm_desc;

      // Detectar versão da LP pelo pathname e incluir na descrição
      if (typeof window !== "undefined" && sourceKey === "ads" && originDesc) {
        const path = window.location.pathname;
        const lpMatch = path.match(/\/v(\d+)/);
        if (lpMatch) {
          originDesc = originDesc.replace("LP -", `LP V${lpMatch[1]} -`);
        }
      }

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
