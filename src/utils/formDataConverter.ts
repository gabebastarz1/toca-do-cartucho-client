import { AdvertisementForCreationDTO, AdvertisementVariationForCreationDTO } from '../api/advertisementTypes';

// Tipos para os dados dos formulários frontend
export interface FrontendFormData {
  titulo: string;
  estoque: string;
  descricao: string;
  preco: string;
  jogo: string;
  tipoCartucho: string;
  estadoPreservacao: string;
  regiao: string;
  idiomaAudio: string;
  idiomaLegenda: string;
  idiomaInterface: string;
  condicoes: string;
  imagens: (File | null)[];
  
  // Campos específicos para troca (se aplicável)
  jogosTroca?: string;
  tiposTroca?: string;
  estadosTroca?: string;
  regioesTroca?: string;
  idiomasAudioTroca?: string;
  idiomasLegendaTroca?: string;
  idiomasInterfaceTroca?: string;
}

export interface FrontendVariationData {
  titulo: string;
  tipoCartucho: string;
  estadoPreservacao: string;
  regiao: string;
  idiomaAudio: string;
  idiomaLegenda: string;
  idiomaInterface: string;
  preco: string;
  estoque: string;
  descricao: string;
  imagens: (File | null)[];
  
  // Campos específicos para troca nas variações (se aplicável)
  jogosTroca?: string;
  tiposTroca?: string;
  estadosTroca?: string;
  regioesTroca?: string;
  idiomasAudioTroca?: string;
  idiomasLegendaTroca?: string;
  idiomasInterfaceTroca?: string;
}

// Função para converter string para ID usando dados de referência
function convertStringToId(
  value: string, 
  referenceData: Array<{ id: number; name: string }>
): number | undefined {
  console.log(`Convertendo "${value}" usando dados:`, referenceData);
  
  // Se o valor já é um número (ID), retornar diretamente
  const numericValue = parseInt(value);
  if (!isNaN(numericValue)) {
    console.log(`Valor "${value}" é um ID numérico: ${numericValue}`);
    return numericValue;
  }
  
  // Se não é número, procurar por nome
  const item = referenceData.find(item => item.name === value);
  const result = item?.id;
  console.log(`Resultado da conversão por nome: ${result}`);
  return result;
}

// Função para converter dados do formulário principal
export async function convertFormDataToBackend(
  formData: FrontendFormData,
  variations: FrontendVariationData[] = [],
  referenceData?: {
    preservationStates: Array<{ id: number; name: string }>;
    cartridgeTypes: Array<{ id: number; name: string }>;
    regions: Array<{ id: number; name?: string; identifier?: string }>;
    languages: Array<{ id: number; name: string }>;
  },
  gameLocalizationId?: number,
  languageSupportsIds?: number[],
  getTradeLanguageSupportIds?: (gameId: number, audioLanguage?: string, subtitleLanguage?: string, interfaceLanguage?: string) => Promise<number[]>
): Promise<AdvertisementForCreationDTO> {
  console.log('=== INICIANDO CONVERSÃO DE DADOS ===');
  console.log('FormData recebido:', formData);
  console.log('ReferenceData recebido:', referenceData);
  
  const isTrade = formData.condicoes.includes('Troca');
  console.log('É troca?', isTrade);
  
  // Converter variações (processar de forma assíncrona)
  const backendVariations: AdvertisementVariationForCreationDTO[] = await Promise.all(
    variations.map(async (variation) => {
      // Processar dados de trade para variações (se aplicável)
      const acceptedTradeGameIds = isTrade && variation.jogosTroca ? [parseInt(variation.jogosTroca)] : [];
      const acceptedTradeCartridgeTypeIds = isTrade && variation.tiposTroca ? 
        [referenceData ? convertStringToId(variation.tiposTroca, referenceData.cartridgeTypes) || 0 : parseInt(variation.tiposTroca) || 0] : [];
      const acceptedTradePreservationStateIds = isTrade && variation.estadosTroca ? 
        [referenceData ? convertStringToId(variation.estadosTroca, referenceData.preservationStates) || 0 : parseInt(variation.estadosTroca) || 0] : [];
      
      // Para regiões e idiomas de trade, precisamos buscar os IDs corretos
      const acceptedTradeRegionIds = isTrade && variation.regioesTroca ? [parseInt(variation.regioesTroca)] : [];
      
      // Para idiomas de trade nas variações, precisamos buscar os language_support IDs correspondentes
      let acceptedTradeLanguageSupportIds: number[] = [];
      if (isTrade && getTradeLanguageSupportIds && variation.jogosTroca) {
        try {
          acceptedTradeLanguageSupportIds = await getTradeLanguageSupportIds(
            parseInt(variation.jogosTroca),
            variation.idiomasAudioTroca,
            variation.idiomasLegendaTroca,
            variation.idiomasInterfaceTroca
          );
        } catch (error) {
          console.error("Erro ao buscar language support IDs para trade na variação:", error);
          acceptedTradeLanguageSupportIds = [];
        }
      }

      return {
        title: variation.titulo,
        description: variation.descricao,
        availableStock: parseInt(variation.estoque) || 1,
        preservationStateId: referenceData ? 
          convertStringToId(variation.estadoPreservacao, referenceData.preservationStates) || 0 : 
          parseInt(variation.estadoPreservacao) || 0,
        cartridgeTypeId: referenceData ? 
          convertStringToId(variation.tipoCartucho, referenceData.cartridgeTypes) || 0 : 
          parseInt(variation.tipoCartucho) || 0,
        gameLocalizationId: gameLocalizationId,
        languageSupportsIds: languageSupportsIds || [],
        price: variation.preco ? parseFloat(variation.preco.replace(',', '.')) : undefined,
        isTrade: isTrade,
        acceptedTradeGameIds: acceptedTradeGameIds,
        acceptedTradeCartridgeTypeIds: acceptedTradeCartridgeTypeIds,
        acceptedTradePreservationStateIds: acceptedTradePreservationStateIds,
        acceptedTradeLanguageSupportIds: acceptedTradeLanguageSupportIds,
        acceptedTradeRegionIds: acceptedTradeRegionIds,
      };
    })
  );

  // Processar dados de trade para o formulário principal
  const acceptedTradeGameIds = isTrade && formData.jogosTroca ? [parseInt(formData.jogosTroca)] : [];
  const acceptedTradeCartridgeTypeIds = isTrade && formData.tiposTroca ? 
    [referenceData ? convertStringToId(formData.tiposTroca, referenceData.cartridgeTypes) || 0 : parseInt(formData.tiposTroca) || 0] : [];
  const acceptedTradePreservationStateIds = isTrade && formData.estadosTroca ? 
    [referenceData ? convertStringToId(formData.estadosTroca, referenceData.preservationStates) || 0 : parseInt(formData.estadosTroca) || 0] : [];
  
  // Para regiões e idiomas de trade do formulário principal
  const acceptedTradeRegionIds = isTrade && formData.regioesTroca ? [parseInt(formData.regioesTroca)] : [];
  
  // Para idiomas de trade, precisamos buscar os language_support IDs correspondentes
  let acceptedTradeLanguageSupportIds: number[] = [];
  if (isTrade && getTradeLanguageSupportIds && formData.jogosTroca) {
    try {
      acceptedTradeLanguageSupportIds = await getTradeLanguageSupportIds(
        parseInt(formData.jogosTroca),
        formData.idiomasAudioTroca,
        formData.idiomasLegendaTroca,
        formData.idiomasInterfaceTroca
      );
    } catch (error) {
      console.error("Erro ao buscar language support IDs para trade:", error);
      acceptedTradeLanguageSupportIds = [];
    }
  }

  // Construir dados principais
  const backendData: AdvertisementForCreationDTO = {
    title: formData.titulo,
    description: formData.descricao,
    availableStock: parseInt(formData.estoque) || 1,
    preservationStateId: referenceData ? 
      convertStringToId(formData.estadoPreservacao, referenceData.preservationStates) || 0 : 
      parseInt(formData.estadoPreservacao) || 0,
    cartridgeTypeId: referenceData ? 
      convertStringToId(formData.tipoCartucho, referenceData.cartridgeTypes) || 0 : 
      parseInt(formData.tipoCartucho) || 0,
    gameLocalizationId: gameLocalizationId,
    languageSupportsIds: languageSupportsIds || [],
    gameId: parseInt(formData.jogo) || 0,
    price: formData.preco ? parseFloat(formData.preco.replace(',', '.')) : undefined,
    isTrade: isTrade,
    acceptedTradeGameIds: acceptedTradeGameIds,
    acceptedTradeCartridgeTypeIds: acceptedTradeCartridgeTypeIds,
    acceptedTradePreservationStateIds: acceptedTradePreservationStateIds,
    acceptedTradeLanguageSupportIds: acceptedTradeLanguageSupportIds,
    acceptedTradeRegionIds: acceptedTradeRegionIds,
    variations: backendVariations,
  };

  console.log('=== DADOS CONVERTIDOS ===');
  console.log('Backend Data:', backendData);
  console.log('=========================');

  return backendData;
}

// Função para extrair imagens válidas do array
export function extractValidImages(images: (File | null)[]): File[] {
  return images.filter((image): image is File => image !== null);
}

// Função para validar dados antes do envio
export function validateFormData(formData: FrontendFormData): string[] {
  const errors: string[] = [];

  if (!formData.titulo.trim()) {
    errors.push('Título é obrigatório');
  }

  if (!formData.jogo) {
    errors.push('Jogo é obrigatório');
  }

  if (!formData.tipoCartucho) {
    errors.push('Tipo de cartucho é obrigatório');
  }

  if (!formData.estadoPreservacao) {
    errors.push('Estado de conservação é obrigatório');
  }

  if (!formData.preco && !formData.condicoes.includes('Troca')) {
    errors.push('É necessário definir um preço ou permitir troca');
  }

  if (parseInt(formData.estoque) < 1) {
    errors.push('Estoque deve ser pelo menos 1');
  }

  return errors;
}

// Função para validar variações
export function validateVariations(variations: FrontendVariationData[]): string[] {
  const errors: string[] = [];

  variations.forEach((variation, index) => {
    if (!variation.titulo.trim()) {
      errors.push(`Variação ${index + 1}: Título é obrigatório`);
    }

    if (!variation.tipoCartucho) {
      errors.push(`Variação ${index + 1}: Tipo de cartucho é obrigatório`);
    }

    if (!variation.estadoPreservacao) {
      errors.push(`Variação ${index + 1}: Estado de conservação é obrigatório`);
    }

    if (parseInt(variation.estoque) < 1) {
      errors.push(`Variação ${index + 1}: Estoque deve ser pelo menos 1`);
    }
  });

  return errors;
}
