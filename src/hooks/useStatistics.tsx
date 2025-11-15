import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export interface MostSearchedTerm {
  id: number;
  term: string;
  amount: number;
  lastSearched: string;
  createdAt: string;
}

export interface GameGenre {
  id: number;
  gameId: number;
  game: null;
  genreId: number;
  genre: {
    id: number;
    checksum: string;
    name: string;
    slug: string;
    url: string;
    updatedAt: string;
    createdAt: string;
  };
  createdAt: string;
}

export interface GameTheme {
  id: number;
  gameId: number;
  game: null;
  themeId: number;
  theme: {
    id: number;
    checksum: string;
    name: string;
    slug: string;
    url: string;
    updatedAt: string;
    createdAt: string;
  };
  createdAt: string;
}

export interface MostAdvertisedGame {
  gameId: number;
  gameName: string;
  gameGenres: GameGenre[];
  gameThemes: GameTheme[];
  advertisementCount: number;
}

export interface StatisticsDTO {
  amountOfTermsSearched: number;
  amountOfActiveAdvertisements: number;
  amountOfInactiveAdvertisements: number;
  amountOfUnavailableAdvertisements: number;
  amountOfUsers: number;
  mostSearchedTerms: MostSearchedTerm[];
  mostAdvertisedGames: MostAdvertisedGame[];
}

interface UseStatisticsReturn {
  statistics: StatisticsDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStatistics = (): UseStatisticsReturn => {
  const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/statistics");
      setStatistics(response.data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      setError("Erro ao carregar estatísticas");
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};

