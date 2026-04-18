import { useCallback } from 'react';
import { useUtmParams } from './useUtmParams';

export interface PloomesContactData {
  barbershopName: string;
  ownerName?: string;
  whatsapp: string;
  monthlyRevenue?: string;
  employeeCount: string;
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
    const has8Segs = fase || campanha || publico || adName || creative || angulo;
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

    // Campos estruturados bb_* (criados abr/2026 via scripts/ploomes-setup-fields.ts).
    // Paralelos ao FieldKey contact_2D7EF0B1-... (legacy string "V8 | W4 | ..."), que é mantido por
    // compatibilidade + fallback. Backend prioriza bb_campaign_id para matching; string só se faltar.
    const BB_FIELDS = {
      bb_campaign_id:    'contact_A48D77F6-CD14-4A9D-BB80-C46EDAD491E8',
      bb_campaign_name:  'contact_F5A3EEB7-8A11-41A1-959B-1C20F0A822DF',
      bb_adset_id:       'contact_29CF9F80-9777-476D-85F1-2030A09F5F26',
      bb_ad_id:          'contact_D73D2261-53D5-4025-9DF1-9BC1A8331FD6',
      bb_lp_version:     'contact_F1E05DF5-3638-44FA-9730-EF071A6F3B0F',
      bb_wave:           'contact_DF967EC9-3A62-4CA6-B74D-7A5FF9E162D3',
      bb_audience_type:  'contact_24A72DD1-E221-4E8B-9EA1-E355D67D5477',
    } as const;

    const bbProps: Array<{ FieldKey: string; StringValue: string }> = [];
    const pushIf = (key: string, val: string) => { if (val) bbProps.push({ FieldKey: key, StringValue: val }); };
    pushIf(BB_FIELDS.bb_campaign_id,    param('campaign_id') || param('campanha_id') || '');
    pushIf(BB_FIELDS.bb_campaign_name,  campanha);
    pushIf(BB_FIELDS.bb_adset_id,       param('adset_id') || publico);
    pushIf(BB_FIELDS.bb_ad_id,          adName);
    pushIf(BB_FIELDS.bb_lp_version,     lpVersion);
    pushIf(BB_FIELDS.bb_wave,           fase);
    pushIf(BB_FIELDS.bb_audience_type,  audiencia);

    const ploomesData = {
      Name: data.barbershopName,
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
          FieldKey: "contact_DA6F2406-FE50-4EFC-BBB5-A3463435B427",
          StringValue: data.ownerName || data.barbershopName
        },
        {
          FieldKey: "contact_2D7EF0B1-E99E-414A-A7DA-4106F05DD4BB",
          StringValue: originDesc || ''
        },
        {
          FieldKey: "contact_51143832-6126-4F8F-9453-D6EEFFE2A352",
          StringValue: data.employeeCount
        },
        ...(data.monthlyRevenue ? [{
          FieldKey: "contact_0748BA26-23E6-41CA-8C7A-A3568B28AC75",
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
      const digits = phone.replace(/\D/g, '');
      // Telefones no Ploomes têm formatação (ex: "(31) 97226-8877").
      // contains() faz match literal, então "972268877" NÃO encontra por causa do traço.
      // Solução: buscar por 2 chunks que são sempre contíguos em qualquer formato:
      //   - últimos 4 dígitos (sempre após o traço)
      //   - 5 dígitos anteriores (sempre antes do traço, para celular BR)
      const last4 = digits.slice(-4);
      const firstChunk = digits.slice(-9, -4);

      const filter = encodeURIComponent(
        firstChunk.length >= 4
          ? `Phones/any(p: contains(p/PhoneNumber, '${last4}') and contains(p/PhoneNumber, '${firstChunk}'))`
          : `Phones/any(p: contains(p/PhoneNumber, '${last4}'))`
      );
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
    submitLead
  };
};
