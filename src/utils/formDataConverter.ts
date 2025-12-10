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
  
  // Campos específicos para troca (se aplicável) - podem ser arrays ou strings para compatibilidade
  jogosTroca?: string | string[];
  tiposTroca?: string | string[];
  estadosTroca?: string | string[];
  regioesTroca?: string | string[];
  idiomasAudioTroca?: string | string[];
  idiomasLegendaTroca?: string | string[];
  idiomasInterfaceTroca?: string | string[];
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
  getTradeLanguageSupportIds?: (gameId: number, audioLanguage?: string, subtitleLanguage?: string, interfaceLanguage?: string) => Promise<number[]>,
  getVariationGameLocalizationId?: (gameId: number, regionValue: string, referenceData?: { regions: Array<{ id: number; name?: string; identifier?: string }> }) => Promise<number | undefined>,
  getVariationLanguageSupportsIds?: (gameId: number, audioLanguage?: string, subtitleLanguage?: string, interfaceLanguage?: string) => Promise<number[]>
): Promise<AdvertisementForCreationDTO> {
  console.log('=== INICIANDO CONVERSÃO DE DADOS ===');
  console.log('FormData recebido:', formData);
  console.log('ReferenceData recebido:', referenceData);
  
  const isTrade = formData.condicoes.includes('Troca');
  console.log('É troca?', isTrade);
  
  // Converter variações (processar de forma assíncrona)
  const backendVariations: AdvertisementVariationForCreationDTO[] = await Promise.all(
    variations.map(async (variation) => {
      // ✅ Calcular gameLocalizationId e languageSupportsIds específicos para cada variação
      // As variações usam o mesmo jogo do anúncio principal, mas podem ter região e idiomas diferentes
      const variationGameLocalizationId = getVariationGameLocalizationId
        ? await getVariationGameLocalizationId(
            parseInt(formData.jogo), // Variações sempre usam o mesmo jogo do anúncio principal
            variation.regiao || formData.regiao, // Usar região da variação, ou do principal se não houver
            referenceData
          )
        : gameLocalizationId; // Fallback para o do anúncio principal se a função não for fornecida

      const variationLanguageSupportsIds = getVariationLanguageSupportsIds
        ? await getVariationLanguageSupportsIds(
            parseInt(formData.jogo), // Variações sempre usam o mesmo jogo do anúncio principal
            variation.idiomaAudio || formData.idiomaAudio,
            variation.idiomaLegenda || formData.idiomaLegenda,
            variation.idiomaInterface || formData.idiomaInterface
          )
        : languageSupportsIds || []; // Fallback para os do anúncio principal se a função não for fornecida

      // Processar dados de trade para variações (se aplicável)
      const acceptedTradeGameIds = isTrade && variation.jogosTroca ? [parseInt(variation.jogosTroca)] : [];
      const acceptedTradeCartridgeTypeIds = isTrade && variation.tiposTroca ? 
        [referenceData ? convertStringToId(variation.tiposTroca, referenceData.cartridgeTypes) || 0 : parseInt(variation.tiposTroca) || 0] : [];
      const acceptedTradePreservationStateIds = isTrade && variation.estadosTroca ? 
        [referenceData ? convertStringToId(variation.estadosTroca, referenceData.preservationStates) || 0 : parseInt(variation.estadosTroca) || 0] : [];
      
      // Para regiões e idiomas de trade, precisamos buscar os IDs corretos
      // ✅ Filtrar valores null, undefined, NaN e strings vazias
      let acceptedTradeRegionIds: number[] = [];
      if (isTrade && variation.regioesTroca) {
        const regionIds = Array.isArray(variation.regioesTroca) 
          ? variation.regioesTroca 
          : [variation.regioesTroca];
        acceptedTradeRegionIds = regionIds
          .filter(id => id !== null && id !== undefined && id !== '') // Filtrar null/undefined/strings vazias primeiro
          .map(id => typeof id === 'string' ? parseInt(id) : id)
          .filter(id => !isNaN(id) && id > 0) as number[]; // Filtrar NaN e valores <= 0
      }
      
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
        description: variation.descricao || undefined,
        availableStock: parseInt(variation.estoque) || 1,
        preservationStateId: referenceData ? 
          convertStringToId(variation.estadoPreservacao, referenceData.preservationStates) || 0 : 
          parseInt(variation.estadoPreservacao) || 0,
        cartridgeTypeId: referenceData ? 
          convertStringToId(variation.tipoCartucho, referenceData.cartridgeTypes) || 0 : 
          parseInt(variation.tipoCartucho) || 0,
        gameLocalizationId: variationGameLocalizationId || undefined,
        languageSupportsIds: variationLanguageSupportsIds || [],
        price: variation.preco ? parseFloat(variation.preco.replace(',', '.')) : undefined,
        isTrade: isTrade,
        // ✅ Enviar null para arrays de trade quando não há trade, ou arrays vazios quando há trade mas sem dados
        // ✅ Garantir que arrays não contenham null ou valores inválidos
        acceptedTradeGameIds: isTrade ? (acceptedTradeGameIds.length > 0 ? acceptedTradeGameIds.filter(id => id !== null && id !== undefined && !isNaN(id)) : []) : undefined,
        acceptedTradeCartridgeTypeIds: isTrade ? (acceptedTradeCartridgeTypeIds.length > 0 ? acceptedTradeCartridgeTypeIds.filter(id => id !== null && id !== undefined && !isNaN(id)) : []) : undefined,
        acceptedTradePreservationStateIds: isTrade ? (acceptedTradePreservationStateIds.length > 0 ? acceptedTradePreservationStateIds.filter(id => id !== null && id !== undefined && !isNaN(id)) : []) : undefined,
        acceptedTradeLanguageSupportIds: isTrade ? (acceptedTradeLanguageSupportIds.length > 0 ? acceptedTradeLanguageSupportIds.filter(id => id !== null && id !== undefined && !isNaN(id)) : []) : undefined,
        acceptedTradeRegionIds: isTrade ? (acceptedTradeRegionIds.length > 0 ? acceptedTradeRegionIds.filter(id => id !== null && id !== undefined && !isNaN(id)) : []) : undefined,
      };
    })
  );

  // Processar dados de trade para o formulário principal
  // Verificar se os valores são arrays ou strings e processar adequadamente
  const jogosTrocaArray = Array.isArray(formData.jogosTroca) ? formData.jogosTroca : (formData.jogosTroca ? [formData.jogosTroca] : []);
  const tiposTrocaArray = Array.isArray(formData.tiposTroca) ? formData.tiposTroca : (formData.tiposTroca ? [formData.tiposTroca] : []);
  const estadosTrocaArray = Array.isArray(formData.estadosTroca) ? formData.estadosTroca : (formData.estadosTroca ? [formData.estadosTroca] : []);
  const regioesTrocaArray = Array.isArray(formData.regioesTroca) ? formData.regioesTroca : (formData.regioesTroca ? [formData.regioesTroca] : []);
  const idiomasAudioTrocaArray = Array.isArray(formData.idiomasAudioTroca) ? formData.idiomasAudioTroca : (formData.idiomasAudioTroca ? [formData.idiomasAudioTroca] : []);
  const idiomasLegendaTrocaArray = Array.isArray(formData.idiomasLegendaTroca) ? formData.idiomasLegendaTroca : (formData.idiomasLegendaTroca ? [formData.idiomasLegendaTroca] : []);
  const idiomasInterfaceTrocaArray = Array.isArray(formData.idiomasInterfaceTroca) ? formData.idiomasInterfaceTroca : (formData.idiomasInterfaceTroca ? [formData.idiomasInterfaceTroca] : []);

  const acceptedTradeGameIds = isTrade && jogosTrocaArray.length > 0 
    ? jogosTrocaArray.map(id => parseInt(id)).filter(id => !isNaN(id))
    : [];
  
  const acceptedTradeCartridgeTypeIds = isTrade && tiposTrocaArray.length > 0
    ? tiposTrocaArray.map(id => referenceData ? convertStringToId(id, referenceData.cartridgeTypes) || 0 : parseInt(id) || 0).filter(id => id !== 0)
    : [];
  
  const acceptedTradePreservationStateIds = isTrade && estadosTrocaArray.length > 0
    ? estadosTrocaArray.map(id => referenceData ? convertStringToId(id, referenceData.preservationStates) || 0 : parseInt(id) || 0).filter(id => id !== 0)
    : [];
  
  // Para regiões e idiomas de trade do formulário principal
  const acceptedTradeRegionIds = isTrade && regioesTrocaArray.length > 0
    ? regioesTrocaArray.map(id => parseInt(id)).filter(id => !isNaN(id))
    : [];
  
  // Para idiomas de trade, precisamos buscar os language_support IDs correspondentes
  // Usar o primeiro jogo selecionado para buscar os language supports
  let acceptedTradeLanguageSupportIds: number[] = [];
  if (isTrade && getTradeLanguageSupportIds && jogosTrocaArray.length > 0) {
    try {
      // Para múltiplos jogos, buscar language supports para cada um
      const allLanguageSupportIds: number[] = [];
      for (const jogoId of jogosTrocaArray) {
        const languageSupportIds = await getTradeLanguageSupportIds(
          parseInt(jogoId),
          idiomasAudioTrocaArray.join(','),
          idiomasLegendaTrocaArray.join(','),
          idiomasInterfaceTrocaArray.join(',')
        );
        allLanguageSupportIds.push(...languageSupportIds);
      }
      // Remover duplicatas
      acceptedTradeLanguageSupportIds = [...new Set(allLanguageSupportIds)];
    } catch (error) {
      console.error("Erro ao buscar language support IDs para trade:", error);
      acceptedTradeLanguageSupportIds = [];
    }
  }

  // Construir dados principais
  const backendData: AdvertisementForCreationDTO = {
    title: formData.titulo,
    description: formData.descricao || undefined,
    availableStock: parseInt(formData.estoque) || 1,
    preservationStateId: referenceData ? 
      convertStringToId(formData.estadoPreservacao, referenceData.preservationStates) || 0 : 
      parseInt(formData.estadoPreservacao) || 0,
    cartridgeTypeId: referenceData ? 
      convertStringToId(formData.tipoCartucho, referenceData.cartridgeTypes) || 0 : 
      parseInt(formData.tipoCartucho) || 0,
    gameLocalizationId: gameLocalizationId || undefined,
    languageSupportsIds: languageSupportsIds || [],
    gameId: parseInt(formData.jogo) || 0,
    price: formData.preco ? parseFloat(formData.preco.replace(',', '.')) : undefined,
    isTrade: isTrade,
        // ✅ Enviar null para arrays de trade quando não há trade, ou arrays vazios quando há trade mas sem dados
        // ✅ Garantir que arrays não contenham null ou valores inválidos - filtrar antes de usar
        acceptedTradeGameIds: isTrade ? (acceptedTradeGameIds.length > 0 ? acceptedTradeGameIds.filter(id => id !== null && id !== undefined && !isNaN(id) && id > 0) : []) : undefined,
        acceptedTradeCartridgeTypeIds: isTrade ? (acceptedTradeCartridgeTypeIds.length > 0 ? acceptedTradeCartridgeTypeIds.filter(id => id !== null && id !== undefined && !isNaN(id) && id > 0) : []) : undefined,
        acceptedTradePreservationStateIds: isTrade ? (acceptedTradePreservationStateIds.length > 0 ? acceptedTradePreservationStateIds.filter(id => id !== null && id !== undefined && !isNaN(id) && id > 0) : []) : undefined,
        acceptedTradeLanguageSupportIds: isTrade ? (acceptedTradeLanguageSupportIds.length > 0 ? acceptedTradeLanguageSupportIds.filter(id => id !== null && id !== undefined && !isNaN(id) && id > 0) : []) : undefined,
        acceptedTradeRegionIds: isTrade ? (acceptedTradeRegionIds.length > 0 ? acceptedTradeRegionIds.filter(id => id !== null && id !== undefined && !isNaN(id) && id > 0) : []) : undefined,
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
