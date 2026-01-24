import { useCallback } from 'react';
import { useUtmParams } from './useUtmParams';

export interface PloomesContactData {
  barbershopName: string;
  ownerName: string;
  whatsapp: string;
  monthlyRevenue: string;
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
    const originDesc = customOriginDesc ?? utmMapping.originDesc;

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
          StringValue: data.ownerName
        },
        {
          FieldKey: "contact_2D7EF0B1-E99E-414A-A7DA-4106F05DD4BB",
          StringValue: originDesc || ''
        },
        {
          FieldKey: "contact_51143832-6126-4F8F-9453-D6EEFFE2A352",
          StringValue: data.employeeCount
        },
        {
          FieldKey: "contact_0748BA26-23E6-41CA-8C7A-A3568B28AC75",
          StringValue: data.monthlyRevenue
        }
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
        {
          FieldKey: "deal_1AE384B9-A46A-4935-B751-67FEB42B0054",
          StringValue: data.monthlyRevenue
        },
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
    submitLead
  };
};
