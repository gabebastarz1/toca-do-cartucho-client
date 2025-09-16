// Tipos para dados de referência do backend

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
  description?: string;
  createdAt: string;
}

export interface CartridgeTypeDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface GameLocalizationDTO {
  id: number;
  name?: string;
  gameId: number;
  region: RegionDTO;
  updatedAt?: string;
  createdAt: string;
}

export interface RegionDTO {
  id: number;
  category?: string;
  identifier?: string;
  name?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface LanguageDTO {
  id: number;
  name: string;
  nativeName: string;
  locale: string;
  updatedAt?: string;
  createdAt: string;
}

export interface LanguageSupportDTO {
  id: number;
  gameId: number;
  language: LanguageDTO;
  languageSupportType: LanguageSupportTypeDTO;
  updatedAt?: string;
  createdAt: string;
}

export interface LanguageSupportTypeDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

// Tipos para filtros de busca
export interface GameForFilteringDTO {
  name?: string;
  genreIds?: number[];
  themeIds?: number[];
  gameModeIds?: number[];
  franchiseIds?: number[];
}

export interface LanguageSupportForFilteringDTO {
  gameId?: number;
  languageId?: number;
  languageSupportTypeId?: number;
}

export interface GameLocalizationForFilteringDTO {
  gameId?: number;
  regionId?: number;
}

export interface LanguageForFilteringDTO {
  name?: string;
  locale?: string;
}

// Tipos para opções de select (compatível com CustomSelect)
export interface SelectOption {
  value: string;
  label: string;
}

// Tipos para dados organizados para os formulários
export interface FormReferenceData {
  games: GameDTO[];
  preservationStates: PreservationStateDTO[];
  cartridgeTypes: CartridgeTypeDTO[];
  regions: RegionDTO[];
  languages: LanguageDTO[];
  languageSupportTypes: LanguageSupportTypeDTO[];
}
