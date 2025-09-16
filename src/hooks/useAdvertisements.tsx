import { useState, useEffect, useCallback } from "react";
import {
  advertisementService,
  AdvertisementFilteringDTO,
  AdvertisementForPaginationDTO,
  AdvertisementOrdering,
} from "../services/advertisementService";
import { AdvertisementDTO } from "../api/types";

interface UseAdvertisementsOptions {
  initialFilters?: AdvertisementFilteringDTO;
  initialPagination?: AdvertisementForPaginationDTO;
  initialOrdering?: AdvertisementOrdering;
  autoFetch?: boolean;
}

interface UseAdvertisementsReturn {
  advertisements: AdvertisementDTO[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: AdvertisementFilteringDTO;
  pagination: AdvertisementForPaginationDTO;
  ordering: AdvertisementOrdering;
  setFilters: (filters: AdvertisementFilteringDTO) => void;
  setPagination: (pagination: AdvertisementForPaginationDTO) => void;
  setOrdering: (ordering: AdvertisementOrdering) => void;
  fetchAdvertisements: () => Promise<void>;
  clearFilters: () => void;
  resetPagination: () => void;
}

export const useAdvertisements = (
  options: UseAdvertisementsOptions = {}
): UseAdvertisementsReturn => {
  const {
    initialFilters = {},
    initialPagination = { page: 1, pageSize: 12 },
    initialOrdering = { orderBy: "createdAt", orderDirection: "desc" },
    autoFetch = true,
  } = options;

  const [advertisements, setAdvertisements] = useState<AdvertisementDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(initialPagination.page || 1);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize || 12);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFiltersState] =
    useState<AdvertisementFilteringDTO>(initialFilters);
  const [pagination, setPaginationState] =
    useState<AdvertisementForPaginationDTO>(initialPagination);
  const [ordering, setOrderingState] =
    useState<AdvertisementOrdering>(initialOrdering);

  const fetchAdvertisements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await advertisementService.getAll(
        filters,
        pagination,
        ordering
      );

      console.log("API Response:", response); // Debug log

      // Verificar se a resposta tem a estrutura esperada
      if (response && Array.isArray(response.data)) {
        setAdvertisements(response.data);
        setTotalCount(response.totalCount || 0);
        setPage(response.page || 1);
        setPageSize(response.pageSize || 12);
        setTotalPages(response.totalPages || 0);
      } else {
        console.warn("Unexpected API response structure:", response);
        setAdvertisements([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error fetching advertisements:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar anúncios"
      );
      setAdvertisements([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, ordering]);

  const setFilters = useCallback((newFilters: AdvertisementFilteringDTO) => {
    setFiltersState(newFilters);
    setPaginationState((prev) => ({ ...prev, page: 1 })); // Reset para primeira página
  }, []);

  const setPagination = useCallback(
    (newPagination: AdvertisementForPaginationDTO) => {
      setPaginationState(newPagination);
    },
    []
  );

  const setOrdering = useCallback((newOrdering: AdvertisementOrdering) => {
    setOrderingState(newOrdering);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setPaginationState((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetPagination = useCallback(() => {
    setPaginationState((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Auto-fetch quando dependências mudarem
  useEffect(() => {
    if (autoFetch) {
      fetchAdvertisements();
    }
  }, [fetchAdvertisements, autoFetch]);

  return {
    advertisements,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    totalPages,
    filters,
    pagination,
    ordering,
    setFilters,
    setPagination,
    setOrdering,
    fetchAdvertisements,
    clearFilters,
    resetPagination,
  };
};
