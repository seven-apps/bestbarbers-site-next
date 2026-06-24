import { useCallback } from 'react';
import { useUtmParams } from './useUtmParams';
import { PLOOMES_CONTACT_FIELDS, PLOOMES_LEGACY_FIELDS } from '@/lib/ploomes-fields';

export interface PloomesContactData {
  barbershopName: string;
  ownerName?: string;
  email?: string;
  whatsapp: string;
  monthlyRevenue?: string;
  employeeCount: string;
  interestedTool?: string;
  leadScore?: number;
  /** Meta CAPI / Pixel event ID compartilhado entre browser e server (deduplicação) */
  leadEventId?: string;
}

export interface PloomesAPIResponse {
  value: Array<{
    Id: number;
    [key: string]: string | number | boolean | null | undefined;
  }>;
}

export interface UsePloomesAPIOptions {
  /** ID de origem customizado - se fornecido, sobrescreve o mapeamento de UTM */
  originId?: number;
  /** Descrição de origem customizada - se fornecido, sobrescreve o mapeamento de UTM */
  originDesc?: string;
}

/** Resultado do dedup com decisão de reativação (lead reaquecido). */
export interface PloomesPhoneStatus {
  /** Já existe contato com este telefone no Ploomes. */
  exists: boolean;
  /**
   * Pode recadastrar como NOVO lead mesmo já existindo: o contato foi dado como
   * PERDIDO no pipe de Qualificação e NÃO tem nenhum ciclo aberto lá — ou seja,
   * esfriou e voltou por uma campanha (reaquecimento). Ver checkPhoneStatus.
   */
  canReregister: boolean;
}

/** Pipe "APP - Qualificação" no Ploomes (won = reunião). É o único pipe consultado
 *  para decidir reativação: perdido aqui = lead que esfriou e pode voltar. */
const QUALIFICACAO_PIPELINE_ID = 40043772;
/** Deal.StatusId no Ploomes (confirmado via API): 1 = aberto, 2 = ganho, 3 = perdido. */
const DEAL_STATUS = { OPEN: 1, WON: 2, LOST: 3 } as const;

/**
 * Monta o predicado OData para casar um telefone no Ploomes apesar da formatação
 * (ex: "(31) 97226-8877"). contains() faz match literal, então "972268877" NÃO
 * acha por causa do traço. Solução: 2 chunks sempre contíguos em qualquer formato —
 * últimos 4 dígitos (após o traço) + 5 dígitos anteriores (antes do traço, celular BR).
 */
function buildPhonePredicate(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const firstChunk = digits.slice(-9, -4);
  return firstChunk.length >= 4
    ? `contains(p/PhoneNumber, '${last4}') and contains(p/PhoneNumber, '${firstChunk}')`
    : `contains(p/PhoneNumber, '${last4}')`;
}

/**
 * Hook para integração com a API do Ploomes CRM
 * @param options - Opções para customizar o originId e originDesc
 */
export const usePloomesAPI = (options: UsePloomesAPIOptions = {}) => {
  const { originId: customOriginId, originDesc: customOriginDesc } = options;
  const { getUtmParams, getOriginMapping } = useUtmParams();

  const PLOOMES_API_KEY = 'B59785E2FC60B0D69BFE51222FE4516699B00F0F97420BBA48E25F648510FB55245A64F7CDB0C89E438AC6C0C56D973F73F99DB7FEF93422E040A2B8816B323B';
  const PLOOMES_BASE_URL = 'https://api2.ploomes.com';

  const createContact = useCallback(async (data: PloomesContactData): Promise<PloomesAPIResponse> => {
    const utmParams = getUtmParams();
    const utmMapping = getOriginMapping(utmParams);

    // Usa valores customizados se fornecidos, senão usa o mapeamento de UTM
    const originId = customOriginId ?? utmMapping.originId;
    const baseOriginDesc = customOriginDesc ?? utmMapping.originDesc;

    // Parâmetros do Meta url_tags (Wave 4 8-segments format).
    // Detalhes do parser backend em src/dashboard/routes/lead-machine-crm.ts:66-157
    // Formato: "V8 | W4 | <campanha> | <publico> | <ad_name> | <creative> | <angulo> | <audiencia>"
    const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const param = (k: string) => search?.get(k)?.trim() || '';

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const lpVersion = pathname.match(/\/(v\d+)/)?.[1]?.toUpperCase() || 'LP';

    const fase = param('fase') || '';
    const campanha = param('campanha') || '';
    const publico = param('publico') || param('adset') || '';
    const adName = param('ad') || param('ad_id') || param('adname') || '';
    const creative = param('creative') || utmParams.utm_content || '';
    const angulo = param('angulo') || '';
    const audiencia = param('audiencia') || publico || '';

    // Se temos sinal do Meta url_tags Wave 4+, usa formato 8-segments.
    // Usa param('creative') diretamente (não o fallback utm_content) para não
    // acionar 8-segs em LPs legacy que só têm utm_content com ID de criativo.
    const has8Segs = fase || campanha || publico || adName || param('creative') || angulo;
    let originDesc: string | null;
    
    if (has8Segs) {
      originDesc = [
        lpVersion,
        fase || 'W?',
        campanha || 'n/d',
        publico || 'n/d',
        adName || 'n/d',
        creative || 'n/d',
        angulo || 'n/d',
        audiencia || 'n/d',
      ].join(' | ');
    } else {
      // Fallback legacy: "LP V8 - Lead Machine | consolidado-abr26 | du-01"
      let originDescBuilder = baseOriginDesc || '';
      if (campanha) originDescBuilder += ` | ${campanha}`;
      if (utmParams.utm_content) originDescBuilder += ` | ${utmParams.utm_content}`;
      originDesc = originDescBuilder || null;
    }

    // Adiciona Score e Interesse ao início da descrição para visibilidade do SDR
    if (originDesc) {
      if (data.interestedTool) {
        originDesc = `[Interesse: ${data.interestedTool}] ${originDesc}`;
      }
      if (data.leadScore !== undefined) {
        originDesc = `[SCORE: ${data.leadScore}] ${originDesc}`;
      }
    }

    // Campos estruturados bb_* (criados abr/2026 + mai/2026 via scripts/ploomes-setup-fields.ts).
    // FieldKeys ficam em src/lib/ploomes-fields.ts (single source). A automação Ploomes
    // espelha esses campos para o Deal correspondente.
    // O FieldKey legacy contact_2D7EF0B1... é mantido como resumo legível para SDR.
    const bbProps: Array<{ FieldKey: string; StringValue: string }> = [];
    const pushIf = (key: string, val: string | null | undefined) => {
      if (val) bbProps.push({ FieldKey: key, StringValue: val });
    };

    // Wave 1 — Meta ad params (url_tags Wave 4)
    pushIf(PLOOMES_CONTACT_FIELDS.bb_campaign_id,    param('campaign_id') || param('campanha_id'));
    pushIf(PLOOMES_CONTACT_FIELDS.bb_campaign_name,  campanha);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_adset_id,       param('adset_id') || publico);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_ad_id,          adName);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_lp_version,     lpVersion);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_wave,           fase);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_audience_type,  audiencia);

    // Wave 2 — UTMs clássicos + click IDs
    pushIf(PLOOMES_CONTACT_FIELDS.bb_utm_source,     utmParams.utm_source);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_utm_medium,     utmParams.utm_medium);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_utm_campaign,   utmParams.utm_campaign);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_utm_content,    utmParams.utm_content);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_utm_term,       utmParams.utm_term);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_fbclid,         utmParams.fbclid);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_gclid,          utmParams.gclid);
    pushIf(PLOOMES_CONTACT_FIELDS.bb_lead_event_id,  data.leadEventId);

    const ploomesData = {
      Name: data.barbershopName,
      // Campo nativo Email do Contact no Ploomes (mesmo nível de Name)
      ...(data.email ? { Email: data.email } : {}),
      OriginId: originId,
      Phones: [
        {
          PhoneNumber: data.whatsapp,
          TypeId: 2,
          CountryId: 0
        }
      ],
      OtherProperties: [
        {
          FieldKey: PLOOMES_LEGACY_FIELDS.ownerName,
          StringValue: data.ownerName || data.barbershopName
        },
        {
          FieldKey: PLOOMES_LEGACY_FIELDS.campaignDescStr,
          StringValue: originDesc || ''
        },
        {
          FieldKey: PLOOMES_LEGACY_FIELDS.employeeCount,
          StringValue: data.employeeCount
        },
        ...(data.monthlyRevenue ? [{
          FieldKey: PLOOMES_LEGACY_FIELDS.monthlyRevenue,
          StringValue: data.monthlyRevenue
        }] : []),
        ...bbProps,
      ]
    };

    const response = await fetch(`${PLOOMES_BASE_URL}/Contacts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user-key': PLOOMES_API_KEY
      },
      body: JSON.stringify(ploomesData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar contato no Ploomes: ${response.status} - ${errorText}`);
    }

    return response.json();
  }, [getUtmParams, getOriginMapping, customOriginId, customOriginDesc]);

  const createDeal = useCallback(async (
    contactId: number, 
    data: PloomesContactData
  ): Promise<{ Id: number; [key: string]: string | number | boolean | null | undefined }> => {
    const utmParams = getUtmParams();
    const utmMapping = getOriginMapping(utmParams);
    
    // Usa valor customizado se fornecido, senão usa o mapeamento de UTM
    const originId = customOriginId ?? utmMapping.originId;

    const dealData = {
      Title: data.barbershopName,
      PipelineId: 40043772,
      ContactId: contactId,
      OriginId: originId,
      OtherProperties: [
        ...(data.monthlyRevenue ? [{
          FieldKey: "deal_1AE384B9-A46A-4935-B751-67FEB42B0054",
          StringValue: data.monthlyRevenue
        }] : []),
        {
          FieldKey: "deal_A48BFA65-1923-469D-8B33-51C759A06F04",
          StringValue: data.employeeCount
        }
      ]
    };

    const response = await fetch(`${PLOOMES_BASE_URL}/Deals`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user-key': PLOOMES_API_KEY
      },
      body: JSON.stringify(dealData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar deal no Ploomes: ${response.status} - ${errorText}`);
    }

    return response.json();
  }, [getUtmParams, getOriginMapping, customOriginId]);

  const checkPhoneExists = useCallback(async (phone: string): Promise<boolean> => {
    try {
      const filter = encodeURIComponent(`Phones/any(p: ${buildPhonePredicate(phone)})`);
      const url = `${PLOOMES_BASE_URL}/Contacts?$filter=${filter}&$top=1&$select=Id,Name`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'user-key': PLOOMES_API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) return false;
      const data = await response.json();
      return (data.value?.length || 0) > 0;
    } catch {
      return false;
    }
  }, []);

  /**
   * Dedup com decisão de reativação. Além de saber se o telefone existe, decide se
   * o lead pode ser recadastrado como NOVO porque esfriou: perdido (StatusId=3) no
   * pipe de Qualificação e SEM nenhum ciclo aberto (StatusId=1) lá — assim não
   * duplicamos um lead que o SDR ainda está tocando. Considera deals de TODOS os
   * contatos com aquele telefone (cobre duplicatas de reativações anteriores: o deal
   * recém-criado fica aberto e volta a bloquear até esfriar de novo).
   *
   * Faz 2 chamadas em paralelo: Contacts (autoridade de `exists`) + Deals da
   * Qualificação por telefone (autoridade de `canReregister`). Falha aberto: mantém
   * só o que foi confirmado; se nada confirmou, `exists=false` (nunca trava lead novo).
   */
  const checkPhoneStatus = useCallback(async (phone: string): Promise<PloomesPhoneStatus> => {
    const pred = buildPhonePredicate(phone);
    const contactsUrl = `${PLOOMES_BASE_URL}/Contacts?$filter=${encodeURIComponent(`Phones/any(p: ${pred})`)}&$top=1&$select=Id`;
    const dealsUrl = `${PLOOMES_BASE_URL}/Deals?$filter=${encodeURIComponent(`Contact/Phones/any(p: ${pred}) and PipelineId eq ${QUALIFICACAO_PIPELINE_ID}`)}&$top=50&$select=StatusId`;

    let exists = false;
    let canReregister = false;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const headers = { Accept: 'application/json', 'user-key': PLOOMES_API_KEY };

    try {
      const [contactsRes, dealsRes] = await Promise.allSettled([
        fetch(contactsUrl, { headers, signal: controller.signal }),
        fetch(dealsUrl, { headers, signal: controller.signal }),
      ]);

      if (contactsRes.status === 'fulfilled' && contactsRes.value.ok) {
        try {
          const data = await contactsRes.value.json();
          exists = (data.value?.length || 0) > 0;
        } catch { /* ignora parse */ }
      }

      if (dealsRes.status === 'fulfilled' && dealsRes.value.ok) {
        try {
          const data = await dealsRes.value.json();
          const deals: Array<{ StatusId: number }> = data.value || [];
          if (deals.length > 0) exists = true; // deal implica contato existente
          const hasOpen = deals.some((d) => d.StatusId === DEAL_STATUS.OPEN);
          const hasLost = deals.some((d) => d.StatusId === DEAL_STATUS.LOST);
          canReregister = !hasOpen && hasLost;
        } catch { /* ignora parse */ }
      }
    } catch {
      /* falha aberto */
    } finally {
      clearTimeout(timeout);
    }

    return { exists, canReregister };
  }, []);

  const submitLead = useCallback(async (data: PloomesContactData): Promise<void> => {
    try {
      // Cria o contato no Ploomes
      const contactResponse = await createContact(data);
      
      // Nota: Conforme comentário no código original, a criação do deal
      // não está sendo executada pois foi ativada a automação no Ploomes
      // para criar sozinho. Mantendo a função disponível caso necessário.
      
      console.log('Contato criado com sucesso no Ploomes:', contactResponse);
    } catch (error) {
      console.error('Erro ao enviar lead para Ploomes:', error);
      throw error;
    }
  }, [createContact]);

  return {
    createContact,
    createDeal,
    checkPhoneExists,
    checkPhoneStatus,
    submitLead
  };
};
