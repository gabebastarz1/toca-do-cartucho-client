import { useState, useEffect, useCallback } from "react";
import { referenceDataService } from "../services/referenceDataService";
import {
  GameDTO,
  PreservationStateDTO,
  CartridgeTypeDTO,
  RegionDTO,
  LanguageDTO,
  LanguageSupportDTO,
  LanguageSupportTypeDTO,
  GameLocalizationDTO,
  FormReferenceData,
  SelectOption,
} from "../api/referenceDataTypes";

interface UseReferenceDataOptions {
  autoLoad?: boolean;
  onError?: (error: Error) => void;
}

interface UseReferenceDataReturn {
  // Dados
  games: GameDTO[];
  preservationStates: PreservationStateDTO[];
  cartridgeTypes: CartridgeTypeDTO[];
  regions: RegionDTO[];
  languages: LanguageDTO[];
  languageSupportTypes: LanguageSupportTypeDTO[];

  // Estados
  loading: boolean;
  error: string | null;

  // Funções de carregamento
  loadAllData: () => Promise<void>;
  loadGames: () => Promise<void>;
  loadPreservationStates: () => Promise<void>;
  loadCartridgeTypes: () => Promise<void>;
  loadRegions: () => Promise<void>;
  loadLanguages: () => Promise<void>;
  loadLanguageSupportTypes: () => Promise<void>;

  // Funções de busca
  searchGames: (query: string) => Promise<GameDTO[]>;
  getGameLocalizations: (gameId: number) => Promise<GameLocalizationDTO[]>;
  getLanguageSupports: (gameId: number) => Promise<LanguageSupportDTO[]>;

  // Funções de conversão para selects
  getGameOptions: () => SelectOption[];
  getPreservationStateOptions: () => SelectOption[];
  getCartridgeTypeOptions: () => SelectOption[];
  getRegionOptions: () => SelectOption[];
  getLanguageOptions: () => SelectOption[];
  getLanguageSupportTypeOptions: () => SelectOption[];

  // Funções auxiliares
  getGameById: (id: number) => GameDTO | undefined;
  getPreservationStateById: (id: number) => PreservationStateDTO | undefined;
  getCartridgeTypeById: (id: number) => CartridgeTypeDTO | undefined;
  getRegionById: (id: number) => RegionDTO | undefined;
  getLanguageById: (id: number) => LanguageDTO | undefined;
  getLanguageSupportTypeById: (
    id: number
  ) => LanguageSupportTypeDTO | undefined;
}

export const useReferenceData = (
  options: UseReferenceDataOptions = {}
): UseReferenceDataReturn => {
  const { autoLoad = true, onError } = options;

  // Estados dos dados
  const [games, setGames] = useState<GameDTO[]>([]);
  const [preservationStates, setPreservationStates] = useState<
    PreservationStateDTO[]
  >([]);
  const [cartridgeTypes, setCartridgeTypes] = useState<CartridgeTypeDTO[]>([]);
  const [regions, setRegions] = useState<RegionDTO[]>([]);
  const [languages, setLanguages] = useState<LanguageDTO[]>([]);
  const [languageSupportTypes, setLanguageSupportTypes] = useState<
    LanguageSupportTypeDTO[]
  >([]);

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para tratar erros
  const handleError = useCallback(
    (err: any, operation: string) => {
      const errorMessage =
        err instanceof Error ? err.message : `Erro ao ${operation}`;
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    },
    [onError]
  );

  // Carregar todos os dados
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await referenceDataService.getAllReferenceData();

      setGames(data.games);
      setPreservationStates(data.preservationStates);
      setCartridgeTypes(data.cartridgeTypes);
      setRegions(data.regions);
      setLanguages(data.languages);
      setLanguageSupportTypes(data.languageSupportTypes);
    } catch (err) {
      handleError(err, "carregar dados de referência");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Carregar dados individuais
  const loadGames = useCallback(async () => {
    try {
      const data = await referenceDataService.getGames();
      setGames(data);
    } catch (err) {
      handleError(err, "carregar jogos");
    }
  }, [handleError]);

  const loadPreservationStates = useCallback(async () => {
    try {
      const data = await referenceDataService.getPreservationStates();
      setPreservationStates(data);
    } catch (err) {
      handleError(err, "carregar estados de conservação");
    }
  }, [handleError]);

  const loadCartridgeTypes = useCallback(async () => {
    try {
      const data = await referenceDataService.getCartridgeTypes();
      setCartridgeTypes(data);
    } catch (err) {
      handleError(err, "carregar tipos de cartucho");
    }
  }, [handleError]);

  const loadRegions = useCallback(async () => {
    try {
      const data = await referenceDataService.getRegions();
      setRegions(data);
    } catch (err) {
      handleError(err, "carregar regiões");
    }
  }, [handleError]);

  const loadLanguages = useCallback(async () => {
    try {
      const data = await referenceDataService.getLanguages();
      setLanguages(data);
    } catch (err) {
      handleError(err, "carregar idiomas");
    }
  }, [handleError]);

  const loadLanguageSupportTypes = useCallback(async () => {
    try {
      const data = await referenceDataService.getLanguageSupportTypes();
      setLanguageSupportTypes(data);
    } catch (err) {
      handleError(err, "carregar tipos de suporte de idioma");
    }
  }, [handleError]);

  // Funções de busca
  const searchGames = useCallback(
    async (query: string): Promise<GameDTO[]> => {
      try {
        return await referenceDataService.searchGames(query);
      } catch (err) {
        handleError(err, "buscar jogos");
        return [];
      }
    },
    [handleError]
  );

  const getGameLocalizations = useCallback(
    async (gameId: number): Promise<GameLocalizationDTO[]> => {
      try {
        return await referenceDataService.getGameLocalizationsByGameId(gameId);
      } catch (err) {
        handleError(err, "carregar localizações do jogo");
        return [];
      }
    },
    [handleError]
  );

  const getLanguageSupports = useCallback(
    async (gameId: number): Promise<LanguageSupportDTO[]> => {
      try {
        return await referenceDataService.getLanguageSupportsByGameId(gameId);
      } catch (err) {
        handleError(err, "carregar suportes de idioma do jogo");
        return [];
      }
    },
    [handleError]
  );

  // Funções de conversão para selects (retornando strings para compatibilidade com CustomSelect)
  const getGameOptions = useCallback((): SelectOption[] => {
    return games
      .map((game) => ({
        value: game.id.toString(),
        label: game.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [games]);

  const getPreservationStateOptions = useCallback((): SelectOption[] => {
    return preservationStates
      .map((state) => ({
        value: state.id.toString(),
        label: state.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [preservationStates]);

  const getCartridgeTypeOptions = useCallback((): SelectOption[] => {
    return cartridgeTypes
      .map((type) => ({
        value: type.id.toString(),
        label: type.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [cartridgeTypes]);

  const getRegionOptions = useCallback((): SelectOption[] => {
    return regions
      .map((region) => ({
        value: region.id.toString(),
        label: region.name || region.identifier || `Região ${region.id}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [regions]);

  const getLanguageOptions = useCallback((): SelectOption[] => {
    return languages
      .map((language) => ({
        value: language.id.toString(),
        label: language.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [languages]);

  const getLanguageSupportTypeOptions = useCallback((): SelectOption[] => {
    return languageSupportTypes
      .map((type) => ({
        value: type.id.toString(),
        label: type.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [languageSupportTypes]);

  // Funções auxiliares para buscar por ID
  const getGameById = useCallback(
    (id: number): GameDTO | undefined => {
      return games.find((game) => game.id === id);
    },
    [games]
  );

  const getPreservationStateById = useCallback(
    (id: number): PreservationStateDTO | undefined => {
      return preservationStates.find((state) => state.id === id);
    },
    [preservationStates]
  );

  const getCartridgeTypeById = useCallback(
    (id: number): CartridgeTypeDTO | undefined => {
      return cartridgeTypes.find((type) => type.id === id);
    },
    [cartridgeTypes]
  );

  const getRegionById = useCallback(
    (id: number): RegionDTO | undefined => {
      return regions.find((region) => region.id === id);
    },
    [regions]
  );

  const getLanguageById = useCallback(
    (id: number): LanguageDTO | undefined => {
      return languages.find((language) => language.id === id);
    },
    [languages]
  );

  const getLanguageSupportTypeById = useCallback(
    (id: number): LanguageSupportTypeDTO | undefined => {
      return languageSupportTypes.find((type) => type.id === id);
    },
    [languageSupportTypes]
  );

  // Carregar dados automaticamente ao montar o componente
  useEffect(() => {
    if (autoLoad) {
      const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await referenceDataService.getAllReferenceData();

          setGames(data.games);
          setPreservationStates(data.preservationStates);
          setCartridgeTypes(data.cartridgeTypes);
          setRegions(data.regions);
          setLanguages(data.languages);
          setLanguageSupportTypes(data.languageSupportTypes);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Erro ao carregar dados de referência";
          setError(errorMessage);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [autoLoad, onError]);

  return {
    // Dados
    games,
    preservationStates,
    cartridgeTypes,
    regions,
    languages,
    languageSupportTypes,

    // Estados
    loading,
    error,

    // Funções de carregamento
    loadAllData,
    loadGames,
    loadPreservationStates,
    loadCartridgeTypes,
    loadRegions,
    loadLanguages,
    loadLanguageSupportTypes,

    // Funções de busca
    searchGames,
    getGameLocalizations,
    getLanguageSupports,

    // Funções de conversão para selects
    getGameOptions,
    getPreservationStateOptions,
    getCartridgeTypeOptions,
    getRegionOptions,
    getLanguageOptions,
    getLanguageSupportTypeOptions,

    // Funções auxiliares
    getGameById,
    getPreservationStateById,
    getCartridgeTypeById,
    getRegionById,
    getLanguageById,
    getLanguageSupportTypeById,
  };
};
