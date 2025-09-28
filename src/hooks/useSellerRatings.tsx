import { useState, useEffect, useCallback } from "react";
import {
  sellerRatingsService,
  SellerRatingsResponse,
  SellerRatingDTO,
} from "../services/sellerRatingsService";

interface UseSellerRatingsReturn {
  averageRating: number;
  totalRatings: number;
  ratings: SellerRatingDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSellerRatings = (sellerId?: string): UseSellerRatingsReturn => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [ratings, setRatings] = useState<SellerRatingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = useCallback(async () => {
    if (!sellerId) {
      setAverageRating(0);
      setTotalRatings(0);
      setRatings([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: SellerRatingsResponse =
        await sellerRatingsService.getSellerRatings(sellerId);

      setAverageRating(response.averageRating || 0);
      setTotalRatings(response.totalRatings || 0);
      setRatings(response.ratings || []);

      //console.log("=== SELLER RATINGS HOOK ===");
      //console.log("Seller ID:", sellerId);
      //console.log("Average Rating:", response.averageRating);
      //console.log("Total Ratings:", response.totalRatings);
      //console.log("Ratings:", response.ratings);
      //console.log("========================");
    } catch (err) {
      //console.error("Erro no hook useSellerRatings:", err);
      setError("Erro ao carregar avaliações do vendedor");
      setAverageRating(0);
      setTotalRatings(0);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return {
    averageRating,
    totalRatings,
    ratings,
    loading,
    error,
    refetch: fetchRatings,
  };
};

export default useSellerRatings;
