// Tipos para criação de anúncios baseados no backend
export interface AdvertisementForCreationDTO {
  title: string;
  description?: string;
  availableStock: number;
  preservationStateId: number;
  cartridgeTypeId: number;
  gameLocalizationId?: number;
  languageSupportsIds: number[];
  gameId: number;
  price?: number;
  isTrade: boolean;
  acceptedTradeGameIds?: number[];
  acceptedTradeCartridgeTypeIds?: number[];
  acceptedTradePreservationStateIds?: number[];
  acceptedTradeLanguageSupportIds?: number[];
  acceptedTradeRegionIds?: number[];
  variations: AdvertisementVariationForCreationDTO[];
}

export interface AdvertisementVariationForCreationDTO {
  title: string;
  description?: string;
  availableStock: number;
  preservationStateId: number;
  cartridgeTypeId: number;
  gameLocalizationId?: number;
  languageSupportsIds: number[];
  price?: number;
  isTrade: boolean;
  acceptedTradeGameIds?: number[];
  acceptedTradeCartridgeTypeIds?: number[];
  acceptedTradePreservationStateIds?: number[];
  acceptedTradeLanguageSupportIds?: number[];
  acceptedTradeRegionIds?: number[];
}

// Tipos para criação com formulário (multipart)
export interface AdvertisementForCreationFormDTO {
  advertisement: string; // JSON string do AdvertisementForCreationDTO
  images: File[];
}

// Tipos para resposta da criação
export interface AdvertisementCreationResponse {
  id: number;
  title: string;
  slug: string;
  description?: string;
  availableStock: number;
  status: string;
  images: AdvertisementImageDTO[];
  seller: UserDTO;
  game: GameDTO;
  preservationState: PreservationStateDTO;
  cartridgeType: CartridgeTypeDTO;
  advertisementLanguageSupports: AdvertisementLanguageSupportsDTO[];
  gameLocalization?: GameLocalizationDTO;
  parentAdvertisementId?: number;
  variations: AdvertisementCreationResponse[];
  sale?: AdvertisementSaleDTO;
  trade?: AdvertisementTradeDTO;
  updatedByUserId?: string;
  updatedAt?: string;
  createdAt: string;
}

// Tipos auxiliares
export interface AdvertisementImageDTO {
  id: number;
  imageUrl: string;
  isMain: boolean;
  advertisementId: number;
}

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf?: string;
}

export interface GameDTO {
  id: number;
  name: string;
  slug?: string;
  storyline?: string;
  summary?: string;
  igdbUrl: string;
  totalRating?: number;
  totalRatingCount?: number;
  themes?: GameThemesDTO[];
  genres?: GameGenresDTO[];
  gameGameModes?: GameGameModesDTO[];
  franchises?: GameFranchisesDTO[];
  firstReleaseDate?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface GameThemesDTO {
  themeId: number;
  theme: ThemeDTO;
}

export interface GameGenresDTO {
  genreId: number;
  genre: GenreDTO;
}

export interface GameGameModesDTO {
  gameModesId: number;
  gameMode: GameModeDTO;
}

export interface GameFranchisesDTO {
  franchiseId: number;
  franchise: FranchiseDTO;
}

export interface ThemeDTO {
  id: number;
  name: string;
}

export interface GenreDTO {
  id: number;
  name: string;
}

export interface GameModeDTO {
  id: number;
  name: string;
}

export interface FranchiseDTO {
  id: number;
  name: string;
}

export interface PreservationStateDTO {
  id: number;
  name: string;
}

export interface CartridgeTypeDTO {
  id: number;
  name: string;
}

export interface AdvertisementLanguageSupportsDTO {
  id: number;
  languageSupportId: number;
  languageSupport: LanguageSupportDTO;
}

export interface LanguageSupportDTO {
  id: number;
  language: string;
}

export interface GameLocalizationDTO {
  id: number;
  region: RegionDTO;
}

export interface RegionDTO {
  id: number;
  name: string;
}

export interface AdvertisementSaleDTO {
  id: number;
  price: number;
  previousPrice?: number;
  discountPercentage?: number;
}

export interface AdvertisementTradeDTO {
  id: number;
  acceptedGameIds: number[];
  acceptedCartridgeTypeIds: number[];
  acceptedPreservationStateIds: number[];
  acceptedLanguageSupportIds: number[];
  acceptedRegionIds: number[];
}

// Tipos para formulário frontend
export interface AdvertisementFormData {
  // Informações básicas
  title: string;
  description: string;
  availableStock: number;
  
  // Jogo
  gameId: number;
  gameLocalizationId?: number;
  
  // Estado e tipo
  preservationStateId: number;
  cartridgeTypeId: number;
  
  // Idiomas
  languageSupportsIds: number[];
  
  // Preço e negociação
  price?: number;
  isTrade: boolean;
  
  // Troca (se isTrade = true)
  acceptedTradeGameIds?: number[];
  acceptedTradeCartridgeTypeIds?: number[];
  acceptedTradePreservationStateIds?: number[];
  acceptedTradeLanguageSupportIds?: number[];
  acceptedTradeRegionIds?: number[];
  
  // Variações
  variations: AdvertisementVariationFormData[];
  
  // Imagens
  images: File[];
}

export interface AdvertisementVariationFormData {
  title: string;
  description: string;
  availableStock: number;
  preservationStateId: number;
  cartridgeTypeId: number;
  gameLocalizationId?: number;
  languageSupportsIds: number[];
  price?: number;
  isTrade: boolean;
  acceptedTradeGameIds?: number[];
  acceptedTradeCartridgeTypeIds?: number[];
  acceptedTradePreservationStateIds?: number[];
  acceptedTradeLanguageSupportIds?: number[];
  acceptedTradeRegionIds?: number[];
}
