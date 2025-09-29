import { useState, useEffect } from "react";
import { api } from "../services/api";
import { UserDTO } from "../api/types";

interface UseUserProfileReturn {
  userProfile: UserDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/users/profile-info");
      setUserProfile(response.data);
    } catch (err) {
      console.error("Erro ao buscar perfil do usuário:", err);
      setError("Erro ao carregar dados do usuário");
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    refetch,
  };
};
