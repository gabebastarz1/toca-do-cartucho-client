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
  sellerId?: string; // ✅ NOVO: ID do vendedor para buscar ratings
  parentAdvertisementId?: number; // ✅ NOVO: ID do anúncio pai para variações
}

// Mapeamentos removidos - agora extraímos essas informações diretamente do título

// Mapeamento de regiões do backend para frontend
const regionMapping: Record<string, string> = {
  "North America": "north-america",
  "Europe": "europe", 
  "Japan": "japan",
  "Brazil": "brazil",
  "Australia": "australia",
  "Korea": "korea"
};

// Mapeamento de idiomas do backend para frontend
const languageMapping: Record<string, string> = {
  "English": "english",
  "Portuguese": "portuguese",
  "Japanese": "japanese"
};

/**
 * Converte um AdvertisementDTO do backend para o formato Product usado no frontend
 */
export const mapAdvertisementToProduct = (advertisement: AdvertisementDTO): Product => {
  // Determinar o tipo de venda baseado nos dados reais
  let saleType: "sale" | "trade" | "sale-trade" = "sale";
  if (advertisement.sale && advertisement.trade) {
    saleType = "sale-trade";
  } else if (advertisement.trade) {
    saleType = "trade";
  } else if (advertisement.sale) {
    saleType = "sale";
  }

  // Usar dados reais do backend em vez de extrair do título
  const type = advertisement.cartridgeType?.name?.toLowerCase()?.includes('repro') ? "repro" : "retro";
  const condition = mapPreservationState(advertisement.preservationState?.name);
  
  // Função para mapear estado de preservação
  function mapPreservationState(stateName?: string): "new" | "semi-new" | "good" | "normal" | "damaged" {
    if (!stateName) return "normal";
    const state = stateName.toLowerCase();
    if (state.includes('novo')) return "new";
    if (state.includes('seminovo')) return "semi-new";
    if (state.includes('bom')) return "good";
    if (state.includes('normal')) return "normal";
    if (state.includes('danificado')) return "damaged";
    return "normal";
  }


  // Mapear região usando dados reais do backend
  const region = advertisement.gameLocalization?.region?.name ? 
    regionMapping[advertisement.gameLocalization.region.name] || "north-america" : 
    "north-america";
  
  // Usar dados de idioma do backend (por enquanto usar padrões já que advertisementLanguageSupports está vazio)
  const audioLanguage = "English";
  const subtitleLanguage = "English";
  const interfaceLanguage = "English";

  // Mapear idiomas para formato do frontend
  const mappedAudioLanguage = languageMapping[audioLanguage] || "english";
  const mappedSubtitleLanguage = languageMapping[subtitleLanguage] || "english";
  const mappedInterfaceLanguage = languageMapping[interfaceLanguage] || "english";

  // Usar dados reais do jogo para gênero e tema
  const gameGenres = advertisement.game?.genres || [];
  const gameThemes = advertisement.game?.themes || [];
  
  // Pegar o primeiro gênero disponível ou usar padrão
  const genre = gameGenres.length > 0 && gameGenres[0].name ? 
    gameGenres[0].name.toLowerCase() : "action";
  
  // Pegar o primeiro tema disponível ou usar padrão
  const theme = gameThemes.length > 0 && gameThemes[0].name ? 
    gameThemes[0].name.toLowerCase() : "fantasia";
  
  // Determinar modo de jogo baseado nos dados do jogo
  const gameModes = advertisement.game?.gameGameModes || [];
  const gameMode = gameModes.length > 1 ? ["singleplayer", "multiplayer"] : ["singleplayer"];

  // Extrair dados de preço do objeto sale
  const saleData = advertisement.sale;
  const currentPrice = saleData?.price || 0;
  const previousPrice = saleData?.previousPrice;
  const discountPercentage = saleData?.discountPercentage;
  
  // Só mostrar preço original se ele existir e for maior que 0
  const originalPrice = previousPrice && previousPrice > 0 ? previousPrice : undefined;
  
  // Converter desconto de string para número (remover % e converter)
  const discount = discountPercentage && originalPrice ? parseInt(discountPercentage.replace('%', '')) : undefined;

  // ✅ Usar ratings do vendedor em vez do jogo
  // Por enquanto, usar valores padrão até que os ratings sejam carregados
  const rating = 0; // Será atualizado pelo componente ProductCard usando useSellerRatings
  const reviewCount = 0; // Será atualizado pelo componente ProductCard usando useSellerRatings

  // ✅ NOVO: Extrair cidade e estado do endereço primário do seller
  const getSellerLocation = () => {
    if (advertisement.seller?.addresses && advertisement.seller.addresses.length > 0) {
      // Encontrar o endereço primário
      const primaryAddress = advertisement.seller.addresses.find(addr => addr.isPrimary) || 
                             advertisement.seller.addresses[0];
      
      if (primaryAddress?.address) {
        const { city, state } = primaryAddress.address;
        return `${city}, ${state}`;
      }
    }
    
    // Fallback para localização genérica
    return "Brasil";
  };

  const sellerLocation = getSellerLocation();

  // ✅ Debug: Log da localização do seller
  console.log(`=== SELLER LOCATION DEBUG ===`);
  console.log(`Advertisement ${advertisement.id}:`);
  console.log(`Seller:`, advertisement.seller?.nickName || "N/A");
  console.log(`Addresses count:`, advertisement.seller?.addresses?.length || 0);
  console.log(`Primary address:`, advertisement.seller?.addresses?.find(addr => addr.isPrimary)?.address);
  console.log(`Final location:`, sellerLocation);
  console.log(`=============================`);

  // Usar a primeira imagem disponível ou placeholder
  const getImageUrl = () => {
    //console.log(`Advertisement ${advertisement.id} images:`, advertisement.images); // Debug log
    
    if (advertisement.images && advertisement.images.length > 0) {
      const firstImage = advertisement.images[0];
      // Usar preSignedUrl se disponível, senão usar url
      const imageUrl = firstImage?.preSignedUrl || firstImage?.url;
      if (imageUrl) {
        //(`Using image for ad ${advertisement.id}:`, imageUrl); // Debug log
        return imageUrl;
      }
    }
    //console.log(`No image found for ad ${advertisement.id}, using fallback`); // Debug log
    return "/logo.svg"; // Fallback para logo
  };

  return {
    id: advertisement.id.toString(),
    title: advertisement.title,
    image: getImageUrl(),
    rating: rating,
    reviewCount: reviewCount,
    originalPrice: originalPrice,
    currentPrice: currentPrice,
    discount: discount,
    condition: condition,
    type: type,
    location: sellerLocation, // ✅ NOVO: Cidade e estado do seller
    genre: genre,
    theme: theme,
    saleType: saleType,
    gameMode: gameMode,
    audioLanguage: mappedAudioLanguage,
    subtitleLanguage: mappedSubtitleLanguage,
    interfaceLanguage: mappedInterfaceLanguage,
    region: region,
    sellerId: advertisement.seller?.id, // ✅ NOVO: ID do vendedor
    parentAdvertisementId: advertisement.parentAdvertisementId, // ✅ NOVO: ID do anúncio pai
  };
};

/**
 * Converte múltiplos AdvertisementDTOs para Products
 */
export const mapAdvertisementsToProducts = (advertisements: AdvertisementDTO[]): Product[] => {
  return advertisements.map(mapAdvertisementToProduct);
};
