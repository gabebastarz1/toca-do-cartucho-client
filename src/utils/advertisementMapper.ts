import { AdvertisementDTO } from '../api/types';

// Interface do produto usado no frontend
export interface Product {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  originalPrice?: number;
  currentPrice: number;
  discount?: number;
  displayDiscount?: boolean;
  condition: "new" | "semi-new" | "good" | "normal" | "damaged";
  type: "retro" | "repro";
  location: string;
  genre: string;
  theme: string;
  saleType: "sale" | "trade" | "sale-trade";
  gameMode: string[];
  audioLanguage: string;
  subtitleLanguage: string;
  interfaceLanguage: string;
  region: string;
  sellerId?: string;
  parentAdvertisementId?: number; // Apenas o ID (primitivo) para evitar loop infinito
}

// Tipo para suportar tanto AdvertisementDTO quanto AdvertisementPaginatedDTO
type AdvertisementLike = AdvertisementDTO & {
  Sale?: any;
  IsTrade?: boolean;
  isTrade?: boolean;
  Game?: any; // Suporte para capitalização diferente no backend
  Trade?: any;
};

// Mapeamento de regiões
const regionMapping: Record<string, string> = {
  "North America": "north-america",
  "Europe": "europe", 
  "Japan": "japan",
  "Brazil": "brazil",
  "Australia": "australia",
  "Korea": "korea"
};

// Mapeamento de idiomas
const languageMapping: Record<string, string> = {
  "English": "english",
  "Portuguese": "portuguese",
  "Japanese": "japanese"
};

/**
 * Converte um AdvertisementDTO para o formato Product do frontend.
 * * ⚠️ IMPORTANTE: Esta função converte apenas dados primitivos ou planos.
 * Ela NÃO mapeia recursivamente objetos como 'variations' ou 'parentAdvertisement'
 * para evitar erros de "Maximum call stack size exceeded" (Loop Infinito).
 */
export const mapAdvertisementToProduct = (advertisement: AdvertisementLike): Product => {
  if (!advertisement) {
    throw new Error("Tentativa de mapear anúncio nulo ou indefinido.");
  }

  // Normalização de dados (CamelCase vs PascalCase do Backend)
  const sale = (advertisement as any).Sale ?? advertisement.sale;
  const trade = (advertisement as any).Trade ?? advertisement.trade;
  
  // Lógica complexa para determinar se é troca (IsTrade, isTrade ou objeto trade existente)
  const isTradeBool = (advertisement as any).IsTrade ?? (advertisement as any).isTrade;
  const hasTradeObject = trade !== null && trade !== undefined;
  const hasTrade = isTradeBool === true || hasTradeObject;

  // Verifica se existe venda válida (objeto existe E tem preço)
  const hasSale = sale !== null && sale !== undefined && (sale.price !== null && sale.price !== undefined);
  
  // Determina o tipo de transação
  let saleType: "sale" | "trade" | "sale-trade" = "sale";
  if (hasSale && hasTrade) {
    saleType = "sale-trade";
  } else if (hasTrade) {
    saleType = "trade";
  } else if (hasSale) {
    saleType = "sale";
  }

  // Tipo de cartucho (Retro vs Repro)
  const type = advertisement.cartridgeType?.name?.toLowerCase()?.includes('repro') ? "repro" : "retro";

  // Mapeamento de estado de preservação
  function mapPreservationState(stateName?: string): "new" | "semi-new" | "good" | "normal" | "damaged" {
    if (!stateName) return "normal";
    const state = stateName.toLowerCase();
    if (state.includes('novo') && !state.includes('seminovo')) return "new";
    if (state.includes('seminovo')) return "semi-new";
    if (state.includes('bom')) return "good";
    if (state.includes('normal')) return "normal";
    if (state.includes('danificado')) return "damaged";
    return "normal";
  }
  const condition = mapPreservationState(advertisement.preservationState?.name);

  // Mapeamento de Região e Idiomas
  const regionName = advertisement.gameLocalization?.region?.name;
  const region = regionName ? (regionMapping[regionName] || "north-america") : "north-america";
  
  // Idiomas (Hardcoded por enquanto conforme original, mas preparado para dinâmica)
  const audioLanguage = "English";
  const subtitleLanguage = "English";
  const interfaceLanguage = "English";

  const mappedAudioLanguage = languageMapping[audioLanguage] || "english";
  const mappedSubtitleLanguage = languageMapping[subtitleLanguage] || "english";
  const mappedInterfaceLanguage = languageMapping[interfaceLanguage] || "english";

  // Dados do Jogo (Game)
  const game = (advertisement as any).Game ?? advertisement.game;
  const gameGenres = game?.genres || [];
  const gameThemes = game?.themes || [];
  
  const genre = gameGenres.length > 0 && gameGenres[0].gameGenre?.name 
    ? gameGenres[0].gameGenre.name.toLowerCase() 
    : (gameGenres.length > 0 && gameGenres[0].name ? gameGenres[0].name.toLowerCase() : "action");
  
  const theme = gameThemes.length > 0 && gameThemes[0].gameTheme?.name
    ? gameThemes[0].gameTheme.name.toLowerCase() 
    : (gameThemes.length > 0 && gameThemes[0].name ? gameThemes[0].name.toLowerCase() : "fantasia");

  const gameModes = game?.gameGameModes || [];
  const gameMode = gameModes.length > 1 ? ["singleplayer", "multiplayer"] : ["singleplayer"];

  // Dados Financeiros
  const currentPrice = sale?.price || 0;
  const previousPrice = sale?.previousPrice;
  const discountPercentage = sale?.discountPercentage;
  const displayDiscount = sale?.displayDiscount;
  
  const originalPrice = previousPrice && previousPrice > 0 ? previousPrice : undefined;
  
  const discount = discountPercentage && originalPrice 
    ? typeof discountPercentage === 'string' 
      ? parseInt(discountPercentage.replace('%', '')) 
      : typeof discountPercentage === 'number'
        ? discountPercentage
        : undefined
    : undefined;

  // Localização do Vendedor
  const getSellerLocation = () => {
    if (advertisement.seller?.addresses?.length) {
      const primaryAddress = advertisement.seller.addresses.find(addr => addr.isPrimary) || advertisement.seller.addresses[0];
      if (primaryAddress?.address) {
        const { city, state } = primaryAddress.address;
        return `${city}, ${state}`;
      }
    }
    return "Brasil";
  };

  // Imagem Principal
  const getImageUrl = (): string => {
    if (advertisement.images?.length) {
      const firstImage = advertisement.images[0];
      // Prioriza preSignedUrl, fallback para url
      return firstImage?.preSignedUrl || firstImage?.url || "";
    }
    return "";
  };

  return {
    id: advertisement.id.toString(),
    title: advertisement.title,
    image: getImageUrl(), // Agora retorna string garantida
    rating: 0,
    reviewCount: 0,
    originalPrice,
    currentPrice,
    discount,
    displayDiscount,
    condition,
    type,
    location: getSellerLocation(),
    genre,
    theme,
    saleType,
    gameMode,
    audioLanguage: mappedAudioLanguage,
    subtitleLanguage: mappedSubtitleLanguage,
    interfaceLanguage: mappedInterfaceLanguage,
    region,
    sellerId: advertisement.seller?.id,
    
    // ✅ CORREÇÃO CRÍTICA:
    // Mapeamos APENAS o ID. Não tente acessar advertisement.parentAdvertisement (objeto)
    // aqui, pois isso causaria o loop infinito se o backend enviar dados circulares.
    parentAdvertisementId: advertisement.parentAdvertisementId, 
  };
};

/**
 * Converte múltiplos AdvertisementDTOs para Products
 */
export const mapAdvertisementsToProducts = (advertisements: AdvertisementLike[]): Product[] => {
  if (!Array.isArray(advertisements)) return [];
  return advertisements.map(mapAdvertisementToProduct);
};