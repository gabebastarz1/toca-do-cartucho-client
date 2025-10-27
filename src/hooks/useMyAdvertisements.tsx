import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { AdvertisementDTO } from "../api/types";
import { useUserProfile } from "./useUserProfile";

interface UseMyAdvertisementsReturn {
  advertisements: AdvertisementDTO[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  refreshAdvertisements: () => Promise<void>;
  deleteAdvertisement: (id: number) => Promise<boolean>;
  updateAdvertisementStatus: (
    id: number,
    status: "Active" | "Inactive"
  ) => Promise<boolean>;
}

export const useMyAdvertisements = (): UseMyAdvertisementsReturn => {
  const [advertisements, setAdvertisements] = useState<AdvertisementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const { userProfile } = useUserProfile();

  const refreshAdvertisements = useCallback(async (): Promise<void> => {
    if (!userProfile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 [useMyAdvertisements] Carregando meus anúncios...");

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      // ✅ Filtrar por SellerIds = ID do usuário logado
      params.append("SellerIds", userProfile.id);

      const response = await api.get(
        `/api/advertisements?${params.toString()}`
      );

      console.log("✅ [useMyAdvertisements] Resposta da API:", response.data);

      if (response.data && Array.isArray(response.data.advertisements)) {
        setAdvertisements(response.data.advertisements || []);
        setTotalCount(response.data.totalNumberOfAdvertisements || 0);
        setPage(response.data.page || 1);
        setPageSize(response.data.pageSize || 12);
        setTotalPages(response.data.totalNumberOfPages || 0);
      } else {
        setAdvertisements([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err: unknown) {
      console.error("❌ [useMyAdvertisements] Erro ao carregar anúncios:", err);
      setError("Erro ao carregar seus anúncios");
      setAdvertisements([]);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, page, pageSize]);

  const deleteAdvertisement = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        console.log("🗑️ [useMyAdvertisements] Deletando anúncio:", id);

        await api.delete(`/api/advertisements/${id}`);

        console.log("✅ [useMyAdvertisements] Anúncio deletado com sucesso");

        // Recarregar lista
        await refreshAdvertisements();

        return true;
      } catch (err: unknown) {
        console.error("❌ [useMyAdvertisements] Erro ao deletar anúncio:", err);
        return false;
      }
    },
    [refreshAdvertisements]
  );

  const updateAdvertisementStatus = useCallback(
    async (id: number, status: "Active" | "Inactive"): Promise<boolean> => {
      try {
        console.log("📝 [useMyAdvertisements] Atualizando status:", {
          id,
          status,
        });

        const payload = {
          status: status,
          title: null,
          description: null,
          availableStock: null,
          preservationStateId: null,
          price: null,
          displayDiscount: null,
          acceptedTradeGameIds: [],
          acceptedTradeCartridgeTypeIds: [],
          acceptedTradePreservationStateIds: [],
          acceptedTradeLanguageSupportIds: [],
          acceptedTradeRegionIds: [],
        };
        console.log("📝 [useMyAdvertisements] Payload enviado:", payload);

        const response = await api.patch(`/api/advertisements/${id}`, payload);

        console.log(
          "✅ [useMyAdvertisements] Status atualizado com sucesso",
          response.data
        );

        // Recarregar lista
        await refreshAdvertisements();

        return true;
      } catch (err: any) {
        console.error(
          "❌ [useMyAdvertisements] Erro ao atualizar status:",
          err
        );
        console.error(
          "❌ [useMyAdvertisements] Resposta da API:",
          err?.response?.data
        );
        console.error(
          "❌ [useMyAdvertisements] Status HTTP:",
          err?.response?.status
        );
        return false;
      }
    },
    [refreshAdvertisements]
  );

  // Carregar anúncios automaticamente quando o userProfile estiver disponível
  useEffect(() => {
    if (userProfile?.id) {
      refreshAdvertisements();
    }
  }, [userProfile?.id, refreshAdvertisements]);

  return {
    advertisements,
    isLoading,
    error,
    totalCount,
    page,
    pageSize,
    totalPages,
    refreshAdvertisements,
    deleteAdvertisement,
    updateAdvertisementStatus,
  };
};
