import { useState, useEffect } from "react";
import { api } from "../services/api";
import { UserDTO } from "../api/types";
import { userProfileCache } from "../services/userProfileCache";

interface UseUserProfileReturn {
  userProfile: UserDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserDTO | null>(() =>
    userProfileCache.get()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    // Se já tivermos dados no cache, não é necessário buscar novamente no primeiro carregamento
    if (userProfileCache.get()) {
      setUserProfile(userProfileCache.get());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      
      const response = await api.get("/api/accounts/profile");

      setUserProfile(response.data);
      userProfileCache.set(response.data); // Salva no cache
    } catch (err) {
      console.error(
        
        err
      );
      setError("Erro ao carregar dados do usuário");
      setUserProfile(null);
      userProfileCache.clear(); // Limpa o cache em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    userProfileCache.clear(); // Limpa o cache para forçar a busca
    await fetchUserProfile();
  };

  useEffect(() => {
    // Apenas busca se o cache estiver vazio na montagem inicial
    if (!userProfileCache.get()) {
      fetchUserProfile();
    }
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    refetch,
  };
};
