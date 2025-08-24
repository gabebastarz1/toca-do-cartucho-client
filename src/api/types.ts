// Tipos personalizados para o projeto TocaDoCartucho
// Baseados na estrutura do backend

export interface AdvertisementDTO {
  id: number;
  title: string;
  description?: string;
  availableStock: number;
  price?: number;
  isTrade: boolean;
  createdAt: string;
  updatedAt: string;
  status: string;
  
  // Relacionamentos
  game?: GameDTO;
  cartridgeType?: CartridgeTypeDTO;
  preservationState?: PreservationStateDTO;
  gameLocalization?: GameLocalizationDTO;
  seller?: UserDTO;
  images?: AdvertisementImageDTO[];
  languageSupports?: LanguageSupportDTO[];
}

export interface AdvertisementImageDTO {
  id: number;
  imageUrl: string;
  advertisementId: number;
}

export interface GameDTO {
  id: number;
  name: string;
  description?: string;
  franchise?: string;
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
  region: string;
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
  cpf?: string;
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
