import { AdvertisementFilteringDTO } from '../services/advertisementService';

// Interface para os filtros do frontend
export interface FrontendFilters {
  conditions?: string[];
  preservation?: string[];
  cartridgeType?: string[];
  price?: string[];
  theme?: string[];
  genre?: string[];
  gameMode?: string[];
  audioLanguage?: string[];
  subtitleLanguage?: string[];
  interfaceLanguage?: string[];
  region?: string[];
}


// Mapeamento de estados de preservação do frontend para IDs do backend
const preservationStateMapping: Record<string, number> = {
  "new": 1,      // Assumindo que "Novo" tem ID 1
  "semi-new": 2, // Assumindo que "Seminovo" tem ID 2
  "good": 3,     // Assumindo que "Bom" tem ID 3
  "normal": 4,   // Assumindo que "Normal" tem ID 4
  "damaged": 5   // Assumindo que "Danificado" tem ID 5
};

// Mapeamento de tipos de cartucho do frontend para IDs do backend
const cartridgeTypeMapping: Record<string, number> = {
  "retro": 1,  // Assumindo que "Retro" tem ID 1
  "repro": 2   // Assumindo que "Repro" tem ID 2
};

// Mapeamento de regiões do frontend para IDs do backend
const regionMapping: Record<string, number> = {
  "north-america": 1,
  "europe": 2,
  "japan": 3,
  "brazil": 4,
  "australia": 5,
  "korea": 6
};

// Mapeamento de idiomas do frontend para IDs do backend
const languageMapping: Record<string, number> = {
  "english": 1,
  "portuguese": 2,
  "japanese": 3
};

/**
 * Converte os filtros do frontend para o formato AdvertisementFilteringDTO do backend
 */
export const mapFrontendFiltersToBackend = (
  frontendFilters: FrontendFilters,
  searchQuery?: string
): AdvertisementFilteringDTO => {
  const backendFilters: AdvertisementFilteringDTO = {};

  // Sempre filtrar apenas anúncios ativos
  backendFilters.status = "Active";

  // Adicionar busca por título se houver query de pesquisa
  if (searchQuery && searchQuery.trim()) {
    backendFilters.title = searchQuery.trim();
  }

  // Processar condições de venda
  if (frontendFilters.conditions?.length) {
    const saleConditions = frontendFilters.conditions.filter(condition => 
      condition === "sale-only" || condition === "trade-only" || condition === "sale-trade"
    );
    
    if (saleConditions.length > 0) {
      // Se há múltiplas condições, usar a mais inclusiva
      const hasSaleOnly = saleConditions.includes("sale-only");
      const hasTradeOnly = saleConditions.includes("trade-only");
      const hasSaleTrade = saleConditions.includes("sale-trade");

      if (hasSaleTrade) {
        backendFilters.isSale = true;
        backendFilters.isTrade = true;
      } else if (hasSaleOnly && hasTradeOnly) {
        backendFilters.isSale = true;
        backendFilters.isTrade = true;
      } else if (hasSaleOnly) {
        backendFilters.isSale = true;
        backendFilters.isTrade = false;
      } else if (hasTradeOnly) {
        backendFilters.isSale = false;
        backendFilters.isTrade = true;
      }
    }
  }

  // Processar estados de preservação
  if (frontendFilters.preservation?.length) {
    backendFilters.preservationStateIds = frontendFilters.preservation
      .map(preservation => preservationStateMapping[preservation])
      .filter(id => id !== undefined);
  }

  // Processar tipos de cartucho
  if (frontendFilters.cartridgeType?.length) {
    backendFilters.cartridgeTypeIds = frontendFilters.cartridgeType
      .map(type => cartridgeTypeMapping[type])
      .filter(id => id !== undefined);
  }

  // Processar faixa de preço
  if (frontendFilters.price?.length === 2) {
    const [minPrice, maxPrice] = frontendFilters.price;
    
    // Processar preço mínimo
    if (minPrice && minPrice.trim()) {
      const minValue = parseFloat(minPrice.trim());
      if (!isNaN(minValue) && minValue >= 0) {
        backendFilters.minPrice = minValue;
      }
    }
    
    // Processar preço máximo
    if (maxPrice && maxPrice.trim()) {
      const maxValue = parseFloat(maxPrice.trim());
      if (!isNaN(maxValue) && maxValue >= 0) {
        backendFilters.maxPrice = maxValue;
      }
    }
  }

  // Processar gêneros (IDs serão mapeados quando tivermos os dados reais)
  if (frontendFilters.genre?.length) {
    backendFilters.genreIds = frontendFilters.genre
      .map(genreId => parseInt(genreId))
      .filter(id => !isNaN(id));
  }

  // Processar temas (IDs serão mapeados quando tivermos os dados reais)
  if (frontendFilters.theme?.length) {
    backendFilters.themeIds = frontendFilters.theme
      .map(themeId => parseInt(themeId))
      .filter(id => !isNaN(id));
  }

  // Processar modos de jogo (IDs serão mapeados quando tivermos os dados reais)
  if (frontendFilters.gameMode?.length) {
    backendFilters.gameModeIds = frontendFilters.gameMode
      .map(mode => mode === "singleplayer" ? 1 : 2) // Mapeamento simples
      .filter(id => !isNaN(id));
  }

  // Processar idiomas
  if (frontendFilters.audioLanguage?.length) {
    backendFilters.languageAudioIds = frontendFilters.audioLanguage
      .map(lang => languageMapping[lang])
      .filter(id => id !== undefined);
  }

  if (frontendFilters.subtitleLanguage?.length) {
    backendFilters.languageSubtitleIds = frontendFilters.subtitleLanguage
      .map(lang => languageMapping[lang])
      .filter(id => id !== undefined);
  }

  if (frontendFilters.interfaceLanguage?.length) {
    backendFilters.languageInterfaceIds = frontendFilters.interfaceLanguage
      .map(lang => languageMapping[lang])
      .filter(id => id !== undefined);
  }

  // Processar regiões
  if (frontendFilters.region?.length) {
    // Assumindo que região está relacionada ao gameLocalization
    // Este mapeamento pode precisar ser ajustado baseado na estrutura real do backend
    backendFilters.gameIds = frontendFilters.region
      .map(region => regionMapping[region])
      .filter(id => id !== undefined);
  }

  return backendFilters;
};

/**
 * Limpa filtros vazios ou inválidos
 */
export const cleanBackendFilters = (filters: AdvertisementFilteringDTO): AdvertisementFilteringDTO => {
  const cleaned: AdvertisementFilteringDTO = {};

  // Copiar propriedades específicas com validação
  if (filters.title && filters.title.trim()) {
    cleaned.title = filters.title.trim();
  }
  if (filters.description && filters.description.trim()) {
    cleaned.description = filters.description.trim();
  }
  if (filters.status && filters.status.trim()) {
    cleaned.status = filters.status.trim();
  }
  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice > 0) {
    cleaned.minPrice = filters.minPrice;
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice > 0) {
    cleaned.maxPrice = filters.maxPrice;
  }
  if (filters.isSale !== undefined && filters.isSale !== null) {
    cleaned.isSale = filters.isSale;
  }
  if (filters.isTrade !== undefined && filters.isTrade !== null) {
    cleaned.isTrade = filters.isTrade;
  }
  if (filters.preservationStateIds && filters.preservationStateIds.length > 0) {
    cleaned.preservationStateIds = filters.preservationStateIds;
  }
  if (filters.cartridgeTypeIds && filters.cartridgeTypeIds.length > 0) {
    cleaned.cartridgeTypeIds = filters.cartridgeTypeIds;
  }
  if (filters.sellerIds && filters.sellerIds.length > 0) {
    cleaned.sellerIds = filters.sellerIds;
  }
  if (filters.gameIds && filters.gameIds.length > 0) {
    cleaned.gameIds = filters.gameIds;
  }
  if (filters.genreIds && filters.genreIds.length > 0) {
    cleaned.genreIds = filters.genreIds;
  }
  if (filters.themeIds && filters.themeIds.length > 0) {
    cleaned.themeIds = filters.themeIds;
  }
  if (filters.franchiseIds && filters.franchiseIds.length > 0) {
    cleaned.franchiseIds = filters.franchiseIds;
  }
  if (filters.gameModeIds && filters.gameModeIds.length > 0) {
    cleaned.gameModeIds = filters.gameModeIds;
  }
  if (filters.languageAudioIds && filters.languageAudioIds.length > 0) {
    cleaned.languageAudioIds = filters.languageAudioIds;
  }
  if (filters.languageSubtitleIds && filters.languageSubtitleIds.length > 0) {
    cleaned.languageSubtitleIds = filters.languageSubtitleIds;
  }
  if (filters.languageInterfaceIds && filters.languageInterfaceIds.length > 0) {
    cleaned.languageInterfaceIds = filters.languageInterfaceIds;
  }

  return cleaned;
};
