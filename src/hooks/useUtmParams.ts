import { useCallback, useMemo } from "react";

export interface UtmParams {
  utm_source: string | null;
  utm_desc: string | null;
  utm_inf: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  // fbclid de tracking (URL || cookie _fbc) — usar para Pixel/CAPI (match/dedup).
  fbclidFresh: string | null;
  // fbclid SÓ da visita/sessão atual (URL ou snapshot fresco) — usar para ATRIBUIÇÃO
  // de origem. NUNCA do cookie _fbc persistido (que dura ~90d e marcaria visitas
  // diretas/orgânicas de quem clicou num ad um dia como "tráfego pago").
  gclid: string | null;
}

export const SS_KEY = 'bb_utm_snapshot';

const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
};

// _fbc cookie format: "fb.1.<timestamp>.<fbclid>"
const fbclidFromCookie = (): string | null => {
  const fbc = readCookie('_fbc');
  if (!fbc) return null;
  const parts = fbc.split('.');
  return parts.length >= 4 ? parts.slice(3).join('.') : null;
};

// _gcl_aw cookie format: "GCL.<timestamp>.<gclid>"
const gclidFromCookie = (): string | null => {
  const gcl = readCookie('_gcl_aw');
  if (!gcl) return null;
  const parts = gcl.split('.');
  return parts.length >= 3 ? parts.slice(2).join('.') : null;
};

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
      "david-champs": 120001224,
      gladstone: 120001225,
      youtube: 120001337,
      billy: 120001376,
      gilberto: 120001428,
      "gilberto-barber-pro": 120001429,
      jorgin: 120001454,
      ottoni: 120003647,
      "rafael-guapo": 120003783,
      // Spotify → /podcast?desc=<temporada>.<episodio>. SEM entrada no descMap:
      // a descrição (temporada + episódio) vem dinâmica via utm_desc (PodcastAttribution).
      podcast: 120001484,
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
      "david-champs": "LP - David Champs - Programa de parceria",
      gladstone: "LP - Gladstone - Programa de indicações",
      billy: "LP - Billy Tribos - Programa de parcerias",
      gilberto: "LP - Gilberto - Programa de parcerias",
      "gilberto-barber-pro": "LP - Gilberto - Evento Barber PRO",
      jorgin: "LP - Jorgin - Programa de parcerias",
      "joao-seletto": "LP - João Seletto - Programa de parcerias",
      ottoni: "LP - Ottoni - Programa de indicações",
      "rafael-guapo": "LP - Rafael Guapo - Parceria",
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
        fbclid: null,
        fbclidFresh: null,
        gclid: null,
      };
    }

    const urlParams = new URLSearchParams(window.location.search);

    // UTM padrão (Meta Ads: ?utm_source=meta&utm_medium=paid&utm_campaign=lead-machine&utm_content=grupo-a)
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmContent = urlParams.get("utm_content");
    const utmTerm = urlParams.get("utm_term");

    // Click IDs — Meta adiciona fbclid em todo click de ad; Google Ads adiciona gclid.
    // FRESH = só da URL desta visita (clicou no ad AGORA). Cookies (_fbc/_gcl_aw) são
    // fallback APENAS para tracking (Pixel/CAPI), NUNCA para atribuição de origem —
    // o _fbc persiste ~90d e contaminaria visitas diretas como "tráfego pago".
    const fbclidUrl = urlParams.get("fbclid");
    const gclidUrl = urlParams.get("gclid");
    const fbclid = fbclidUrl || fbclidFromCookie();
    const gclid = gclidUrl || gclidFromCookie();

    // Param legado de parceiros (?source=mileno) — compatibilidade mantida
    const legacySource = urlParams.get("source");

    const params: UtmParams = {
      utm_source: utmSource || legacySource,
      utm_desc: urlParams.get("desc"),
      utm_inf: urlParams.get("inf"),
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      fbclid,
      fbclidFresh: fbclidUrl,
      gclid,
    };

    // Persistir snapshot na primeira visita com sinais de ad — preserva params
    // através de navegação interna (LP V11 → outra rota → volta).
    // hasSignal usa os click IDs FRESCOS (URL), não os de cookie — senão o snapshot
    // nasceria contaminado por _fbc/_gcl_aw de visitas antigas.
    try {
      const hasSignal = !!(utmSource || legacySource || fbclidUrl || gclidUrl || utmCampaign);
      const stored = sessionStorage.getItem(SS_KEY);
      if (hasSignal && !stored) {
        sessionStorage.setItem(SS_KEY, JSON.stringify(params));
      } else if (!hasSignal && stored) {
        // URL "limpa" + snapshot existente → restaurar
        const restored = JSON.parse(stored) as Partial<UtmParams>;
        return {
          utm_source: params.utm_source ?? restored.utm_source ?? null,
          utm_desc: params.utm_desc ?? restored.utm_desc ?? null,
          utm_inf: params.utm_inf ?? restored.utm_inf ?? null,
          utm_medium: params.utm_medium ?? restored.utm_medium ?? null,
          utm_campaign: params.utm_campaign ?? restored.utm_campaign ?? null,
          utm_content: params.utm_content ?? restored.utm_content ?? null,
          utm_term: params.utm_term ?? restored.utm_term ?? null,
          fbclid: params.fbclid ?? restored.fbclid ?? null,
          fbclidFresh: params.fbclidFresh ?? restored.fbclidFresh ?? null,
          gclid: params.gclid ?? restored.gclid ?? null,
        };
      }
    } catch {
      // sessionStorage indisponível (privacy mode etc) — segue sem persistir
    }

    return params;
  }, []);

  const getOriginMapping = useCallback(
    (utmParams: UtmParams): OriginMapping => {
      const { utm_source, utm_desc, utm_medium, fbclidFresh } = utmParams;

      // utm_source=meta usa o mesmo originId de "ads" (40210173).
      // Campanhas com url_tags utm_source={{site_source_name}} (LP V12+) emitem
      // "fb", "ig", "msg" ou "an" — todos são tráfego pago Meta.
      const META_SOURCE_ALIASES = ["meta", "fb", "ig", "msg", "an", "facebook", "instagram"];
      let sourceKey: string | null =
        utm_source && META_SOURCE_ALIASES.includes(utm_source.toLowerCase())
          ? "ads"
          : utm_source;

      // Fallback: URLs Wave 4+ não usam utm_source mas sim params estruturados
      // (fase=W4, campanha=, ad_id=, publico=). Se qualquer sinal Meta Ads presente,
      // tratar como "ads" (originId 40210173 — Tráfego Pago).
      // Roda também quando utm_source existe mas não está no originMap — um source
      // desconhecido não pode bloquear a atribuição de tráfego pago.
      // fbclidFresh (URL/sessão atual) é incluído pois Meta adiciona em clicks de ad.
      // ATENÇÃO: usar fbclidFresh, NUNCA o fbclid de cookie — o _fbc persiste ~90d e
      // marcaria visitas diretas/orgânicas como tráfego pago (contaminava a origem).
      if ((!sourceKey || !(sourceKey in originMap)) && typeof window !== "undefined") {
        const search = new URLSearchParams(window.location.search);
        const hasMetaSignal =
          search.has("ad_id") ||
          search.has("ad") ||
          search.has("fase") ||
          search.has("campanha") ||
          search.has("publico") ||
          search.has("audiencia") ||
          search.has("adset") ||
          search.has("adname") ||
          search.has("creative") ||
          search.has("angulo") ||
          !!fbclidFresh ||
          utm_medium === "paid";
        if (hasMetaSignal) sourceKey = "ads";
      }

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
