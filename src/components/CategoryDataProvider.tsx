import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// Interfaces para os dados
export interface Genre {
  id: string;
  name: string;
}

export interface Theme {
  id: string;
  name: string;
}

// Interface do contexto
interface CategoryDataContextType {
  genres: Genre[];
  themes: Theme[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Contexto
const CategoryDataContext = createContext<CategoryDataContextType | undefined>(
  undefined
);

// Dados mockados como fallback
const mockGenres: Genre[] = [
  { id: "action", name: "Action" },
  { id: "comedy", name: "Comedy" },
  { id: "drama", name: "Drama" },
  { id: "educational", name: "Educational" },
  { id: "fantasy", name: "Fantasy" },
  { id: "historical", name: "Historical" },
  { id: "horror", name: "Horror" },
  { id: "kids", name: "Kids" },
  { id: "mystery", name: "Mystery" },
  { id: "romance", name: "Romance" },
  { id: "science-fiction", name: "Science fiction" },
  { id: "thriller", name: "Thriller" },
  { id: "warfare", name: "Warfare" },
];

const mockThemes: Theme[] = [
  { id: "fantasia", name: "Fantasia" },
  { id: "futurista", name: "Futurista" },
  { id: "historico", name: "Histórico" },
  { id: "medieval", name: "Medieval" },
  { id: "espacial", name: "Espacial" },
];

// Configuração da API
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  endpoints: {
    genres: "/genres",
    themes: "/themes",
  },
};

// Função para buscar dados da API
const fetchFromAPI = async <T,>(endpoint: string): Promise<T[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Erro ao buscar dados de ${endpoint}:`, error);
    throw error;
  }
};

// Props do provider
interface CategoryDataProviderProps {
  children: ReactNode;
  useMockData?: boolean; // Flag para forçar uso de dados mockados
}

// Provider principal
export const CategoryDataProvider: React.FC<CategoryDataProviderProps> = ({
  children,
  useMockData = false,
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Usar dados mockados
        setGenres(mockGenres);
        setThemes(mockThemes);
      } else {
        // Tentar buscar da API
        try {
          const [genresData, themesData] = await Promise.all([
            fetchFromAPI<Genre>(API_CONFIG.endpoints.genres),
            fetchFromAPI<Theme>(API_CONFIG.endpoints.themes),
          ]);

          // Se a API retornou dados válidos, usar eles
          if (genresData.length > 0) {
            setGenres(genresData);
          } else {
            setGenres(mockGenres);
          }

          if (themesData.length > 0) {
            setThemes(themesData);
          } else {
            setThemes(mockThemes);
          }
        } catch (apiError) {
          // Se a API falhar, usar dados mockados como fallback
          console.warn("API não disponível, usando dados mockados:", apiError);
          setGenres(mockGenres);
          setThemes(mockThemes);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados de categorias:", error);
      setError("Erro ao carregar categorias");
      // Em caso de erro, usar dados mockados como fallback
      setGenres(mockGenres);
      setThemes(mockThemes);
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  const refetch = async () => {
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value: CategoryDataContextType = {
    genres,
    themes,
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
export const useGenres = () => {
  const { genres, loading, error, refetch } = useCategoryData();
  return { genres, loading, error, refetch };
};

// Hook específico para temáticas
export const useThemes = () => {
  const { themes, loading, error, refetch } = useCategoryData();
  return { themes, loading, error, refetch };
};

// Hook para ambos
export const useCategories = () => {
  const { genres, themes, loading, error, refetch } = useCategoryData();
  return { genres, themes, loading, error, refetch };
};

export default CategoryDataProvider;
