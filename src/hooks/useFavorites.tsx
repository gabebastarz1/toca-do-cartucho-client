import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { AdvertisementDTO } from "../api/types";

interface UseFavoritesReturn {
  favorites: AdvertisementDTO[];
  isLoading: boolean;
  error: string | null;
  addToFavorites: (advertisementId: number) => Promise<boolean>;
  removeFromFavorites: (advertisementId: number) => Promise<boolean>;
  toggleFavorite: (advertisementId: number) => Promise<boolean>;
  isFavorite: (advertisementId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<AdvertisementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Função para recarregar lista de favoritos
  const refreshFavorites = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 [useFavorites] Recarregando favoritos...");

      const response = await api.get(
        "/api/accounts/profile/advertisements/favorites"
      );

      console.log("✅ [useFavorites] Resposta completa da API:", response);
      console.log("✅ [useFavorites] response.data:", response.data);

      // ✅ A API retorna um objeto com a propriedade 'advertisements'
      const favoriteAds = response.data?.advertisements || response.data;

      console.log("✅ [useFavorites] Tipo de favoriteAds:", typeof favoriteAds);
      console.log("✅ [useFavorites] É array?:", Array.isArray(favoriteAds));
      console.log("✅ [useFavorites] Favoritos carregados:", favoriteAds);

      // ✅ Garantir que sempre seja um array
      const favoritesArray = Array.isArray(favoriteAds) ? favoriteAds : [];
      console.log(
        "✅ [useFavorites] Total de favoritos:",
        favoritesArray.length
      );
      setFavorites(favoritesArray);
    } catch (err: unknown) {
      console.error("❌ [useFavorites] Erro ao recarregar favoritos:", err);
      setError("Erro ao carregar favoritos");
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Função para adicionar aos favoritos
  const addToFavorites = useCallback(
    async (advertisementId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "❤️ [useFavorites] Adicionando aos favoritos:",
          advertisementId
        );

        const response = await api.post(
          "/api/accounts/profile/advertisements/favorites",
          {
            advertisementId: advertisementId,
          }
        );

        console.log(
          "✅ [useFavorites] Adicionado aos favoritos:",
          response.data
        );

        // ✅ Recarregar lista de favoritos
        await refreshFavorites();

        return true;
      } catch (err: unknown) {
        console.error(
          "❌ [useFavorites] Erro ao adicionar aos favoritos:",
          err
        );
        setError("Erro ao adicionar aos favoritos");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshFavorites]
  );

  // ✅ Função para remover dos favoritos
  const removeFromFavorites = useCallback(
    async (advertisementId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "💔 [useFavorites] Removendo dos favoritos:",
          advertisementId
        );

        await api.delete(
          `/api/accounts/profile/advertisements/${advertisementId}/favorites`
        );

        console.log("✅ [useFavorites] Removido dos favoritos");

        // ✅ Recarregar lista de favoritos
        await refreshFavorites();

        return true;
      } catch (err: unknown) {
        console.error("❌ [useFavorites] Erro ao remover dos favoritos:", err);
        setError("Erro ao remover dos favoritos");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshFavorites]
  );

  // ✅ Função para verificar se é favorito
  const isFavorite = useCallback(
    (advertisementId: number): boolean => {
      return favorites.some((fav) => fav.id === advertisementId);
    },
    [favorites]
  );

  // ✅ Função para alternar favorito
  const toggleFavorite = useCallback(
    async (advertisementId: number): Promise<boolean> => {
      const isCurrentlyFavorite = isFavorite(advertisementId);

      console.log("🔄 [useFavorites] Alternando favorito:", {
        advertisementId,
        isCurrentlyFavorite,
        action: isCurrentlyFavorite ? "remover" : "adicionar",
      });

      if (isCurrentlyFavorite) {
        return await removeFromFavorites(advertisementId);
      } else {
        return await addToFavorites(advertisementId);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  // ✅ Carregar favoritos automaticamente ao montar o componente
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  return {
    favorites,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
  };
};
