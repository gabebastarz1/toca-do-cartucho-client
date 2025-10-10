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
  url: string;
  preSignedUrl?: string;
  urlExpiresIn?: number;
  originalFileName: string;
  width: number;
  height: number;
  animated: boolean;
  advertisementId: number;
  createdAt: string;
  updatedAt?: string;
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

export interface UserAddressDTO {
  id: number;
  isPrimary: boolean;
  userId: string;
  address: AddressDTO;
  createdAt: string;
}

export interface AddressDTO {
  id: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  createdAt: string;
}

export interface UserProfileImageDTO {
  id: number;
  originalFileName: string;
  userId: string;
  preSignedUrl: string;
  urlExpiresIn: string;
  createdAt: string;
}

export interface UserDTO {
  id: string;
  nickName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  slug: string;
  phoneNumber?: string;
  cpf?: string;
  createdAt?: string;
  addresses?: UserAddressDTO[]; 
  roles?: RoleDTO[];
  favoriteAdvertisements?: AdvertisementDTO[];
  profileImage?: UserProfileImageDTO;
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

export interface UserForUpdateDTO {
  nickName?: string;
  firstName?: string;
  lastName?: string;
  cpf?: string;
  roles?: string[];
  email?: string;
  phoneNumber?: string;
  addresses?: UserAddressForUpdateDTO[];
}

export interface UserAddressForUpdateDTO {
  address: AddressForCreationDTO;
  isPrimary: boolean;
}

export interface AddressForCreationDTO {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
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
