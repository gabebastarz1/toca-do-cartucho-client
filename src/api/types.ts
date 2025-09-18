// Tipos personalizados para o projeto TocaDoCartucho
// Baseados na estrutura do backend

export interface AdvertisementDTO {
  id: number;
  title: string;
  description?: string;
  availableStock: number;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  updatedByUserId?: string;
  parentAdvertisementId?: number;
  
  // Relacionamentos
  game?: GameDTO;
  cartridgeType?: CartridgeTypeDTO;
  preservationState?: PreservationStateDTO;
  gameLocalization?: GameLocalizationDTO;
  seller?: UserDTO;
  images?: AdvertisementImageDTO[];
  advertisementLanguageSupports?: LanguageSupportDTO[];
  sale?: SaleDTO;
  trade?: TradeDTO;
  variations?: AdvertisementDTO[];
}

export interface AdvertisementImageDTO {
  id: number;
  imageUrl: string;
  advertisementId: number;
}

export interface SaleDTO {
  id: number;
  price: number;
  previousPrice?: number;
  discountPercentage?: string;
  updatedAt: string;
}

export interface GameDTO {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  firstReleaseDate?: string;
  igdbUrl?: string;
  totalRating?: number;
  totalRatingCount?: number;
  createdAt: string;
  updatedAt: string;
  franchises?: FranchiseDTO[];
  genres?: GenreDTO[];
  themes?: ThemeDTO[];
  gameGameModes?: GameModeDTO[];
}

export interface CartridgeTypeDTO {
  id: number;
  name: string;
  description?: string;
}

export interface PreservationStateDTO {
  id: number;
  name: string;
  description?: string;
}

export interface GameLocalizationDTO {
  id: number;
  name: string;
  gameId: number;
  region: RegionDTO;
  createdAt: string;
  updatedAt: string;
}

export interface RegionDTO {
  id: number;
  category: string;
  identifier: string;
  name: string;
  updatedAt: string;
}

export interface GenreDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ThemeDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface TradeDTO {
  id: number;
  price?: number;
  updatedAt: string;
}

export interface FranchiseDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface GameModeDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface RoleDTO {
  id: number;
  name: string;
  description?: string;
}

export interface LanguageSupportDTO {
  id: number;
  language: string;
  description?: string;
}

export interface UserDTO {
  id: string;
  nickName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  slug: string;
  roles?: RoleDTO[];
  favoriteAdvertisements?: AdvertisementDTO[];
}

// Tipos personalizados para evitar conflitos
export interface CustomLoginRequest {
  email: string;
  password: string;
}

export interface CustomRegisterRequest {
  email: string;
  password: string;
  nickName: string;
}

export interface CustomUserForUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  cpf?: string;
}

export interface CustomInfoRequest {
  oldPassword: string;
  newPassword: string;
}
