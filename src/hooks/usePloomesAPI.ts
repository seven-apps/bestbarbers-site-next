import { useCallback } from 'react';
import { useUtmParams } from './useUtmParams';
import { PLOOMES_CONTACT_FIELDS, PLOOMES_LEGACY_FIELDS } from '@/lib/ploomes-fields';
import { buildLeadAttribution, type LeadAttribution } from '@/lib/lead-attribution';

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

  /**
   * Atribuição do cadastro (origem, descrição da campanha, campos bb_*) resolvida pela
   * fonte única src/lib/lead-attribution.ts — o MESMO payload alimenta o contato novo
   * (aqui) e o card de recadastro (src/lib/recadastro.ts). Exposto porque o form
   * precisa dele para o recadastro sem re-montar nada.
   */
  const buildAttribution = useCallback((data: PloomesContactData): LeadAttribution => {
    const utmParams = getUtmParams();
    const utmMapping = getOriginMapping(utmParams);
    return buildLeadAttribution({
      utmParams,
      originId: customOriginId ?? utmMapping.originId,
      originDesc: customOriginDesc ?? utmMapping.originDesc,
      interestedTool: data.interestedTool,
      leadScore: data.leadScore,
      leadEventId: data.leadEventId,
    });
  }, [getUtmParams, getOriginMapping, customOriginId, customOriginDesc]);

  const createContact = useCallback(async (data: PloomesContactData): Promise<PloomesAPIResponse> => {
    const { originId, originDesc, fields } = buildAttribution(data);

    // Campos estruturados bb_* (criados abr/2026 + mai/2026). FieldKeys ficam em
    // src/lib/ploomes-fields.ts (single source). A automação Ploomes espelha esses
    // campos para o Deal criado a partir do Contact.
    // O FieldKey legacy contact_2D7EF0B1... é mantido como resumo legível para SDR.
    const bbProps: Array<{ FieldKey: string; StringValue: string }> = [];
    for (const [nome, valor] of Object.entries(fields)) {
      const key = PLOOMES_CONTACT_FIELDS[nome as keyof typeof PLOOMES_CONTACT_FIELDS];
      if (key && valor) bbProps.push({ FieldKey: key, StringValue: valor });
    }

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
  }, [buildAttribution]);

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
    buildAttribution,
    submitLead
  };
};
