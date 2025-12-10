import { useState, useEffect } from "react";
import { api } from "../services/api";
import { UserDTO } from "../api/types";
import { userProfileCache } from "../services/userProfileCache";
import { authService } from "../services/authService";

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

  const fetchUserProfile = async (force = false) => {
    // Se já tivermos dados no cache e não for forçado, usar o cache
    if (!force && userProfileCache.get()) {
      setUserProfile(userProfileCache.get());
      return;
    }

    // Verificar se há autenticação válida antes de tentar buscar o perfil
    // Isso evita chamadas desnecessárias após o registro quando não há sessão
    const isAuthenticated = authService.isAuthenticated();
    const hasSessionCookie = authService.hasSessionCookie();

    if (!isAuthenticated && !hasSessionCookie) {
      // Não há autenticação válida, não tentar buscar o perfil
      setUserProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/auth/profile");

      const newProfile = response.data;
      setUserProfile(newProfile);
      userProfileCache.set(newProfile); // Salva no cache
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setError("Erro ao carregar dados do usuário");
      setUserProfile(null);
      userProfileCache.clear(); // Limpa o cache em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    // Forçar busca mesmo se houver cache
    await fetchUserProfile(true);
  };

  useEffect(() => {
    // Apenas busca se o cache estiver vazio na montagem inicial
    if (!userProfileCache.get()) {
      fetchUserProfile();
    }

    // Escutar mudanças no cache para atualizar o estado automaticamente
    const unsubscribe = userProfileCache.subscribe((newProfile) => {
      setUserProfile(newProfile);
    });

    // Limpar listener quando o componente for desmontado
    return unsubscribe;
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    refetch,
  };
};
