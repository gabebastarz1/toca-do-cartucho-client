import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api } from "../services/api";
import { GameLocalizationDTO, RegionDTO as ApiRegionDTO } from "../api/types";

// Interfaces para os dados do backend
interface GenreDTO {
  id: number;
  name: string;
  slug: string;
  url: string;
  updatedAt: string;
  createdAt: string;
}

interface ThemeDTO {
  id: number;
  name: string;
  slug: string;
  url: string;
  updatedAt: string;
  createdAt: string;
}

interface GameModeDTO {
  id: number;
  name: string;
  slug: string;
  url: string;
  updatedAt: string;
  createdAt: string;
}

interface LanguageDTO {
  id: number;
  name: string;
  nativeName: string;
  locale: string;
  updatedAt: string;
  createdAt: string;
}

interface RegionDTO {
  id: number;
  category: string;
  identifier: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

// Interfaces para os dados do frontend
export interface Genre {
  id: string;
  name: string;
}

export interface Theme {
  id: string;
  name: string;
}

export interface GameMode {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  locale: string;
}

export interface Region {
  id: string;
  name: string;
  identifier: string;
}

// Interface do contexto
interface CategoryDataContextType {
  genres: Genre[];
  themes: Theme[];
  gameModes: GameMode[];
  languages: Language[];
  regions: Region[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Contexto
const CategoryDataContext = createContext<CategoryDataContextType | undefined>(
  undefined
);

// Função para converter GenreDTO para Genre
const convertGenreDTO = (genreDTO: GenreDTO): Genre => ({
  id: `genre_${genreDTO.id}`,
  name: genreDTO.name,
});

// Função para converter ThemeDTO para Theme
const convertThemeDTO = (themeDTO: ThemeDTO): Theme => ({
  id: `theme_${themeDTO.id}`,
  name: themeDTO.name,
});

// Função para converter GameModeDTO para GameMode
const convertGameModeDTO = (gameModeDTO: GameModeDTO): GameMode => ({
  id: `gamemode_${gameModeDTO.id}`,
  name: gameModeDTO.name,
});

// Função para converter LanguageDTO para Language
const convertLanguageDTO = (languageDTO: LanguageDTO): Language => ({
  id: `language_${languageDTO.id}`,
  name: languageDTO.name,
  nativeName: languageDTO.nativeName,
  locale: languageDTO.locale,
});

// Função para converter RegionDTO para Region
const convertRegionDTO = (regionDTO: RegionDTO): Region => ({
  id: `region_${regionDTO.id}`,
  name: regionDTO.name || regionDTO.identifier || `Região ${regionDTO.id}`,
  identifier: regionDTO.identifier || "",
});

// Props do provider
interface CategoryDataProviderProps {
  children: ReactNode;
}

// Provider principal
export const CategoryDataProvider: React.FC<CategoryDataProviderProps> = ({
  children,
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadData = useCallback(async () => {
    // Se já carregou, não carregar novamente
    if (hasLoaded) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        genresResponse,
        themesResponse,
        gameModesResponse,
        languagesResponse,
        gameLocalizationsResponse,
      ] = await Promise.all([
        api.get("/api/genres"),
        api.get("/api/themes"),
        api.get("/api/gamemodes"),
        api.get("/api/languages"),
        api.get("/api/game-localizations"),
      ]);

      const genresData: GenreDTO[] = genresResponse.data;
      const themesData: ThemeDTO[] = themesResponse.data;
      const gameModesData: GameModeDTO[] = gameModesResponse.data;
      const languagesData: LanguageDTO[] = languagesResponse.data;
      const gameLocalizationsData: GameLocalizationDTO[] =
        gameLocalizationsResponse.data;

      // Extrair regiões únicas das localizações de jogos
      const regionsMap = new Map<number, ApiRegionDTO>();
      gameLocalizationsData.forEach((localization: GameLocalizationDTO) => {
        if (localization.region && !regionsMap.has(localization.region.id)) {
          regionsMap.set(localization.region.id, localization.region);
        }
      });
      // Converter ApiRegionDTO para RegionDTO local (adicionando campos faltantes)
      const regionsData: RegionDTO[] = Array.from(regionsMap.values()).map(
        (region) => ({
          ...region,
          createdAt: region.updatedAt || new Date().toISOString(),
          category: region.category || "",
        })
      );

      // Converter DTOs para interfaces do frontend
      const convertedGenres = genresData.map(convertGenreDTO);
      const convertedThemes = themesData.map(convertThemeDTO);
      const convertedGameModes = gameModesData.map(convertGameModeDTO);
      const convertedLanguages = languagesData.map(convertLanguageDTO);
      const convertedRegions = regionsData.map(convertRegionDTO);

      setGenres(convertedGenres);
      setThemes(convertedThemes);
      setGameModes(convertedGameModes);
      setLanguages(convertedLanguages);
      setRegions(convertedRegions);
      setHasLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar dados de categorias:", error);
      setError("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }, [hasLoaded]);

  const refetch = async () => {
    setHasLoaded(false);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value: CategoryDataContextType = {
    genres,
    themes,
    gameModes,
    languages,
    regions,
    loading,
    error,
    refetch,
  };

  return (
    <CategoryDataContext.Provider value={value}>
      {children}
    </CategoryDataContext.Provider>
  );
};

// Hook para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useCategoryData = (): CategoryDataContextType => {
  const context = useContext(CategoryDataContext);

  if (context === undefined) {
    throw new Error(
      "useCategoryData deve ser usado dentro de um CategoryDataProvider"
    );
  }

  return context;
};

// Hook específico para gêneros
// eslint-disable-next-line react-refresh/only-export-components
export const useGenres = () => {
  const { genres, loading, error, refetch } = useCategoryData();
  return { genres, loading, error, refetch };
};

// Hook específico para temáticas
// eslint-disable-next-line react-refresh/only-export-components
export const useThemes = () => {
  const { themes, loading, error, refetch } = useCategoryData();
  return { themes, loading, error, refetch };
};

// Hook específico para modos de jogo
// eslint-disable-next-line react-refresh/only-export-components
export const useGameModes = () => {
  const { gameModes, loading, error, refetch } = useCategoryData();
  return { gameModes, loading, error, refetch };
};

// Hook específico para idiomas
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguages = () => {
  const { languages, loading, error, refetch } = useCategoryData();
  return { languages, loading, error, refetch };
};

// Hook específico para regiões
// eslint-disable-next-line react-refresh/only-export-components
export const useRegions = () => {
  const { regions, loading, error, refetch } = useCategoryData();
  return { regions, loading, error, refetch };
};

// Hook para categorias básicas (gêneros e temas)
// eslint-disable-next-line react-refresh/only-export-components
export const useCategories = () => {
  const { genres, themes, loading, error, refetch } = useCategoryData();
  return { genres, themes, loading, error, refetch };
};

// Hook para todos os dados
// eslint-disable-next-line react-refresh/only-export-components
export const useAllCategoryData = () => {
  const {
    genres,
    themes,
    gameModes,
    languages,
    regions,
    loading,
    error,
    refetch,
  } = useCategoryData();
  return {
    genres,
    themes,
    gameModes,
    languages,
    regions,
    loading,
    error,
    refetch,
  };
};

export default CategoryDataProvider;
