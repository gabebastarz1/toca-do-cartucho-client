import { api } from './api';

export interface SellerRatingDTO {
  id: number;
  sellerId: string;
  userId: string;
  title: string;
  description: string;
  rating: number;
  updatedByUserId: string;
  updatedAt: string;
  createdAt: string;
}

export interface SellerRatingsResponse {
  ratings: SellerRatingDTO[];
  averageRating: number;
  totalRatings: number;
}

class SellerRatingsService {
  private baseUrl = '/api/seller_ratings';

  async getSellerRatings(sellerId: string): Promise<SellerRatingsResponse> {
    try {
      const response = await api.get(`${this.baseUrl}?sellerId=${sellerId}`);
      
      //console.log("=== SELLER RATINGS API RESPONSE ===");
      //console.log("Seller ID:", sellerId);
      //console.log("Response status:", response.status);
      //console.log("Response data:", response.data);
      //console.log("================================");

      // A API pode retornar um array de ratings ou um único rating
      const data = response.data;
      
      if (Array.isArray(data)) {
        // ✅ Se retornar array de ratings
        const ratings = data;
        const averageRating = ratings.length > 0 
          ? (ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0) / ratings.length) / 2
          : 0;
        
        return {
          ratings,
          averageRating: Math.max(0, Math.min(5, averageRating)), // ✅ Validar entre 0-5
          totalRatings: ratings.length
        };
      } else {
        // ✅ Se retornar um único rating
        const rating = data;
        const validRating = Math.max(0, Math.min(5, rating.rating || 0)); // ✅ Validar entre 0-5
        return {
          ratings: [rating],
          averageRating: validRating,
          totalRatings: 1
        };
      }
    } catch (error) {
      console.error('Erro ao buscar ratings do vendedor:', error);
      throw error;
    }
  }

  async getSellerAverageRating(sellerId: string): Promise<number> {
    try {
      const response = await this.getSellerRatings(sellerId);
      return response.averageRating || 0;
    } catch (error) {
     // console.error('Erro ao buscar média de ratings do vendedor:', error);
      return 0; // Retorna 0 se houver erro
    }
  }
}

export const sellerRatingsService = new SellerRatingsService();
