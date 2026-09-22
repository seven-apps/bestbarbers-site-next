import { useCallback, useMemo } from "react";

export interface UtmParams {
  utm_source: string | null;
  utm_desc: string | null;
  utm_inf: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  // Nome do CONJUNTO na Meta — o url_tags de toda campanha manda publico={{adset.name}}.
  // É a chave que o gate de score do useLeadForm usa para saber QUAL célula está falando.
  // Fica aqui e não como corte numérico na URL (?score_min=60) por decisão do André: o
  // parâmetro numérico é editável por quem visita e viaja em link compartilhado; o nome do
  // conjunto é só uma etiqueta, e a régua que ela destrava mora no código.
  publico: string | null;
  // MESMO conjunto, outra pergunta: `publico` responde "qual célula está falando AGORA?"
  // (só a URL viva, para o gate de score — ver a razão em `restaurarSnapshot`);
  // `publicoSessao` responde "de qual conjunto esta pessoa veio nesta sessão?" e SOBREVIVE
  // ao snapshot. Existe porque a ATRIBUIÇÃO tem o problema oposto ao do gate: quem clica no
  // ad, navega para dentro do site e só então preenche o formulário chegava ao Ploomes sem
  // conjunto nenhum (bb_adset_id vazio, `n/d` na Descrição da Campanha), e sem conjunto no
  // card não há como ler o A/B pelo CRM — só pelo Ads Manager. Campo separado, e não
  // restauração do `publico`, justamente para o gate continuar cego ao snapshot.
  //
  // OPCIONAL por uma razão datada, não por design: `PodcastAttribution.tsx` também MONTA um
  // UtmParams e grava o snapshot (SS_KEY), e ele é de outro dono — torná-lo obrigatório
  // quebraria a compilação de lá. Nada se perde: `restaurarSnapshot` lê `publico` do
  // snapshot como fallback, então o conjunto de quem chega pelo podcast continua chegando
  // ao card. Vira obrigatório no dia em que aquele arquivo passar a preencher os dois.
  publicoSessao?: string | null;
  // Atribuição EXPLÍCITA por originId do Ploomes na própria URL (?origin=120003825).
  // Emitida pelo gerador de links do dashboard (OS), que lê as origens do Ploomes AO VIVO
  // — então origem nova no CRM já atribui sem depender de uma entrada no originMap abaixo
  // (+ deploy). `origin` = o número da origem; `odesc` = nome legível p/ a Descrição da
  // Campanha (opcional). Ganha do originMap e do fallback Meta. Ver getOriginMapping.
  origin: string | null;
  odesc: string | null;
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
 * Restaura o snapshot de UTM sobre a URL viva. PURA e exportada porque é aqui que moram as
 * duas exceções do arquivo (`publico` e `publicoSessao`), e exceção que só existe em
 * comentário volta como regressão silenciosa — com teste, ela volta como teste vermelho.
 *
 * Regra geral: o que a URL desta visita traz GANHA; o snapshot só preenche o que falta.
 */
export function restaurarSnapshot(vivo: UtmParams, guardado: Partial<UtmParams>): UtmParams {
  return {
    utm_source: vivo.utm_source ?? guardado.utm_source ?? null,
    utm_desc: vivo.utm_desc ?? guardado.utm_desc ?? null,
    utm_inf: vivo.utm_inf ?? guardado.utm_inf ?? null,
    utm_medium: vivo.utm_medium ?? guardado.utm_medium ?? null,
    utm_campaign: vivo.utm_campaign ?? guardado.utm_campaign ?? null,
    utm_content: vivo.utm_content ?? guardado.utm_content ?? null,
    utm_term: vivo.utm_term ?? guardado.utm_term ?? null,
    // `publico` NÃO é restaurado do snapshot — de propósito, e é a única exceção aqui.
    // O snapshot é first-touch: quem clica no ad da célula com corte e depois no ad do
    // CONTROLE (mesma arte, mesmo broad — a frequência cruzada entre os dois é esperada,
    // não hipotética) navegaria com o `publico` da PRIMEIRA célula preso na sessão. O
    // gate de score seria aplicado à célula errada, suprimindo 'Lead' do controle e
    // roubando sinal de conversão de quem serve de régua para a experiência.
    // Sem restore, o gate só age com o conjunto vindo da URL ao vivo: erra para o lado
    // seguro (Lead cru, como sempre foi) e nunca para o lado que contamina o controle.
    // (19/Set/26: a linha que dizia "bônus: lê da mesma fonte que buildLeadAttribution" saiu
    // porque deixou de ser verdade — a atribuição passou a ter o fallback de `publicoSessao`
    // logo abaixo. O gate continua lendo só a URL viva; era só o bônus que mudou.)
    publico: vivo.publico,
    // `publicoSessao` É restaurado — é o campo que existe para isso. Ele não alimenta gate
    // nenhum: só ATRIBUIÇÃO (bb_adset_id no card), onde saber de qual conjunto a pessoa veio
    // vale mais do que o risco de first-touch, porque nada é suprimido a partir dele.
    // O `?? guardado.publico` no fim NÃO é só retrocompatibilidade: cobre dois produtores
    // vivos de snapshot que gravam só o nome antigo — a sessão de quem já estava navegando
    // na hora do deploy, e o `PodcastAttribution.tsx` (que monta o snapshot da entrada paga
    // do /podcast e é de outro dono). Mesmo valor, nome antigo; sem esta linha, o conjunto
    // desses dois caminhos morreria no meio do A/B sem ninguém perceber.
    publicoSessao: vivo.publicoSessao ?? guardado.publicoSessao ?? guardado.publico ?? null,
    origin: vivo.origin ?? guardado.origin ?? null,
    odesc: vivo.odesc ?? guardado.odesc ?? null,
    fbclid: vivo.fbclid ?? guardado.fbclid ?? null,
    fbclidFresh: vivo.fbclidFresh ?? guardado.fbclidFresh ?? null,
    gclid: vivo.gclid ?? guardado.gclid ?? null,
  };
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
      "mauro-elegance": 120003786,
      "gabriel-reis": 120003825,
      "jefferson-aux": 120004060,
      "vittor-pallace": 120004061,
      "lucas-start": 120004062,
      // Spotify → /podcast?desc=<temporada>.<episodio>. SEM entrada no descMap:
      // a descrição (temporada + episódio) vem dinâmica via utm_desc (PodcastAttribution).
      podcast: 120001484,
      // Link da bio do Instagram: /bio → /?source=instabio (next.config.ts). Separa o clique
      // na bio do "Instagram - Orgânico" (40210374), que fica só para a DM cadastrada pelo SDR.
      instabio: 120004089,
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
      "mauro-elegance":
        "LP - Mauro Oliveira (Elegance Barbearia) - Programa de indicações",
      "gabriel-reis":
        "LP - Gabriel Reis (Reis Barbearia) - Programa de indicações",
      "jefferson-aux":
        "LP - Jefferson Xavier (AUX Barbearia) - Programa de indicações",
      "vittor-pallace":
        "LP - Vittor Manoel (Pallace Barbearia) - Programa de indicações",
      "lucas-start":
        "LP - Lucas Alexandre (Start Barbearia) - Programa de indicações",
      instabio: "Instagram - Link da bio",
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
        publico: null,
        publicoSessao: null,
        origin: null,
        odesc: null,
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
    const publicoParam = urlParams.get("publico");

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

    // Atribuição explícita por originId na URL (?origin=120003825&odesc=...) — gerada pelo
    // dashboard lendo o Ploomes ao vivo. `origin` dispensa o originMap para a origem casar.
    const originParam = urlParams.get("origin");
    const odescParam = urlParams.get("odesc");

    const params: UtmParams = {
      utm_source: utmSource || legacySource,
      utm_desc: urlParams.get("desc"),
      utm_inf: urlParams.get("inf"),
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      publico: publicoParam,
      // Nasce igual ao `publico` — a URL viva é a mesma fonte. Os dois só divergem depois,
      // na restauração do snapshot (ver `restaurarSnapshot`).
      publicoSessao: publicoParam,
      origin: originParam,
      odesc: odescParam,
      fbclid,
      fbclidFresh: fbclidUrl,
      gclid,
    };

    // Persistir snapshot na primeira visita com sinais de ad — preserva params
    // através de navegação interna (LP V11 → outra rota → volta).
    // hasSignal usa os click IDs FRESCOS (URL), não os de cookie — senão o snapshot
    // nasceria contaminado por _fbc/_gcl_aw de visitas antigas.
    try {
      // utm_content entra no sinal: o link por porta (`utm_content=p2-regua` no e-mail,
      // no story, no YouTube) pode vir SEM source/campaign e precisa sobreviver à navegação
      // interna até o form — senão bb_utm_content chega vazio ao Ploomes (plano §2).
      const hasSignal = !!(utmSource || legacySource || originParam || fbclidUrl || gclidUrl || utmCampaign || publicoParam || utmContent);
      const stored = sessionStorage.getItem(SS_KEY);
      if (hasSignal && !stored) {
        sessionStorage.setItem(SS_KEY, JSON.stringify(params));
      } else if (!hasSignal && stored) {
        // URL "limpa" + snapshot existente → restaurar. A regra (e as duas exceções de
        // conjunto) mora em `restaurarSnapshot`, pura e testada.
        return restaurarSnapshot(params, JSON.parse(stored) as Partial<UtmParams>);
      }
    } catch {
      // sessionStorage indisponível (privacy mode etc) — segue sem persistir
    }

    return params;
  }, []);

  const getOriginMapping = useCallback(
    (utmParams: UtmParams): OriginMapping => {
      const { utm_source, utm_desc, utm_medium, fbclidFresh, origin, odesc } = utmParams;

      // PRIORIDADE MÁXIMA: originId explícito na URL (?origin=120003825). O gerador de
      // links do dashboard (OS) lê as origens do Ploomes AO VIVO e cola o número no link,
      // então uma origem NOVA no CRM já atribui sem depender do originMap abaixo + deploy.
      // Ganha do originMap E do fallback Meta: o link carrega a intenção explícita de
      // creditar aquela origem. Só aceita dígitos (defesa contra ?origin= lixo/injeção).
      // Descrição: odesc (nome legível vindo do link) > descMap do source > utm_desc.
      if (origin && /^\d+$/.test(origin)) {
        const descFromMap = utm_source
          ? descMap[utm_source as keyof typeof descMap]
          : undefined;
        return {
          originId: Number(origin),
          originDesc: odesc || descFromMap || utm_desc || null,
        };
      }

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
