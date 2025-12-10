import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "../services/api";
import { AdvertisementDTO } from "../api/types";

// Cache compartilhado para favoritos (similar ao userProfileCache)
let cachedFavorites: AdvertisementDTO[] | null = null;
let isLoadingCache = false;
let loadingPromise: Promise<AdvertisementDTO[]> | null = null;

// Sistema de eventos para notificar componentes quando os favoritos são atualizados
type FavoritesUpdateListener = (favorites: AdvertisementDTO[]) => void;
const listeners: Set<FavoritesUpdateListener> = new Set();

const notifyListeners = (favorites: AdvertisementDTO[]) => {
  listeners.forEach((listener) => listener(favorites));
};

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
  const [favorites, setFavorites] = useState<AdvertisementDTO[]>(
    () => cachedFavorites || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // ✅ Função para recarregar lista de favoritos (com cache compartilhado)
  const refreshFavorites = useCallback(async (force = false): Promise<void> => {
    // Se já está carregando, aguardar a requisição em andamento
    if (loadingPromise && !force) {
      try {
        const result = await loadingPromise;
        if (isMountedRef.current) {
          setFavorites(result);
        }
        return;
      } catch {
        // Se falhar, continuar com nova requisição
      }
    }

    // Se já temos cache e não foi forçado, usar cache
    if (!force && cachedFavorites !== null && !isLoadingCache) {
      if (isMountedRef.current) {
        setFavorites(cachedFavorites);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    isLoadingCache = true;

    // Criar promise compartilhada
    loadingPromise = (async () => {
      try {
        const response = await api.get(
          "/api/auth/profile/advertisements/favorites"
        );

        const data = response.data;
        const favoriteAds =
          data?.Advertisements || data?.advertisements || data;
        const favoritesArray = Array.isArray(favoriteAds) ? favoriteAds : [];

        

        // Atualizar cache compartilhado
        cachedFavorites = favoritesArray;

        // Notificar todos os listeners
        notifyListeners(favoritesArray);

        return favoritesArray;
      } catch (err: unknown) {
        cachedFavorites = null;
        throw err;
      } finally {
        isLoadingCache = false;
        loadingPromise = null;
      }
    })();

    try {
      const result = await loadingPromise;
      if (isMountedRef.current) {
        setFavorites(result);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar favoritos"
        );
        setFavorites([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // ✅ Função para adicionar aos favoritos (atualiza estado local sem refetch)
  const addToFavorites = useCallback(
    async (advertisementId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await api.post("/api/auth/profile/advertisements/favorites", {
          advertisementId: advertisementId,
        });

        // Atualizar estado local otimisticamente
        // Buscar o anúncio completo para adicionar à lista
        if (isMountedRef.current) {
          // Limpar cache para forçar refresh
          cachedFavorites = null;
          // Fazer refresh para atualizar a lista com o novo favorito
          await refreshFavorites(true);
        }

        return true;
      } catch (err: unknown) {
        console.error(err);
        if (isMountedRef.current) {
          setError("Erro ao adicionar aos favoritos");
        }
        return false;
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [refreshFavorites]
  );

  // ✅ Função para remover dos favoritos (atualiza estado local sem refetch)
  const removeFromFavorites = useCallback(
    async (advertisementId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await api.delete(
          `/api/auth/profile/advertisements/${advertisementId}/favorites`
        );

        // Atualizar estado local otimisticamente
        if (isMountedRef.current) {
          setFavorites((prev) =>
            prev.filter((fav) => fav.id !== advertisementId)
          );
          // Atualizar cache compartilhado
          if (cachedFavorites) {
            cachedFavorites = cachedFavorites.filter(
              (fav) => fav.id !== advertisementId
            );
            notifyListeners(cachedFavorites);
          }
        }

        return true;
      } catch (err: unknown) {
        console.error(err);
        if (isMountedRef.current) {
          setError("Erro ao remover dos favoritos");
        }
        return false;
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
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

      if (isCurrentlyFavorite) {
        return await removeFromFavorites(advertisementId);
      } else {
        // Ao adicionar, apenas limpar cache - refresh será feito quando necessário
        // Isso evita requisição extra imediata
        const success = await addToFavorites(advertisementId);
        return success;
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  // ✅ Escutar mudanças no cache compartilhado
  useEffect(() => {
    const listener: FavoritesUpdateListener = (
      newFavorites: AdvertisementDTO[]
    ) => {
      if (isMountedRef.current) {
        setFavorites(newFavorites);
      }
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
      isMountedRef.current = false;
    };
  }, []);

  // ✅ Carregar favoritos apenas se o usuário estiver autenticado
  useEffect(() => {
    isMountedRef.current = true;

    // Verificar se há token ou cookie de autenticação
    const hasToken = localStorage.getItem("authToken");
    const hasUser = localStorage.getItem("user");
    
    // Verificar se há cookie de sessão
    const hasCookie = document.cookie.split(';').some(cookie => {
      const trimmedCookie = cookie.trim();
      return (
        (trimmedCookie.startsWith('Identity.Application=') ||
         trimmedCookie.startsWith('.AspNetCore.Identity.Application=')) &&
        trimmedCookie.split('=')[1] &&
        trimmedCookie.split('=')[1] !== ''
      );
    });

    // Só carregar favoritos se o usuário estiver autenticado
    if (hasToken || hasUser || hasCookie) {
      // Se já temos cache, usar imediatamente
      if (cachedFavorites !== null) {
        setFavorites(cachedFavorites);
      } else {
        // Caso contrário, carregar
        refreshFavorites().catch((error) => {
          // Se der erro 401, significa que o usuário não está autenticado
          // Não fazer nada, apenas não carregar favoritos
          if (error?.response?.status !== 401) {
            console.error("Erro ao carregar favoritos:", error);
          }
        });
      }
    }

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

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
