import React from "react";
import { AdvertisementDTO } from "../api/types";
import { useSellerRatings } from "../hooks/useSellerRatings";

interface SellerInfoProps {
  advertisement?: AdvertisementDTO;
  // Manter compatibilidade com dados mockados
  data?: {
    name: string;
    avatar: string;
    rating: number;
    memberSince: string;
  };
}

const SellerInfo: React.FC<SellerInfoProps> = ({ advertisement }) => {
  // Buscar ratings do vendedor
  const sellerId = advertisement?.seller?.id;
  const { averageRating, totalRatings, loading } = useSellerRatings(sellerId);

  // Função para converter dados do seller do advertisement
  const getSellerData = () => {
    if (advertisement?.seller) {
      const seller = advertisement.seller;

      // ✅ Extrair ano do createdAt do seller
      const getMemberSinceYear = () => {
        if (seller.createdAt) {
          try {
            return new Date(seller.createdAt).getFullYear().toString();
          } catch (error) {
            console.warn("Erro ao processar data de criação do seller:", error);
            return ""; // Fallback
          }
        }
        return ""; // Fallback se não houver createdAt
      };

      return {
        name: seller.nickName || seller.email || "Vendedor",
        avatar: "👤", // Pode ser implementado com foto do perfil
        rating: averageRating || 0, // ✅ Usar rating real da API
        memberSince: getMemberSinceYear(), // ✅ Usar ano real do createdAt
      };
    }
    return {
      name: "Vendedor",
      avatar: "👤",
      rating: 0,
      memberSince: "2023",
    };
  };

  const sellerData = getSellerData();

  // Mostrar loading se estiver carregando os ratings
  if (loading && sellerId) {
    return (
      <div className="p-4 mt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Conheça o vendedor
        </h2>
        <div className="flex items-center bg-white p-4 rounded-lg">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 animate-pulse">
            <span className="text-gray-600 text-lg">👤</span>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Conheça o vendedor
      </h2>
      <div className="flex items-center bg-white p-4 rounded-lg">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
          <span className="text-gray-600 text-lg">{sellerData.avatar}</span>
        </div>
        <div className="flex-1">
          <span className="text-gray-700 font-medium block">
            {sellerData.name}
          </span>
          <span className="text-sm text-gray-500">
            ⭐ {sellerData.rating.toFixed(1)}/5 • {totalRatings} avaliações
            
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
