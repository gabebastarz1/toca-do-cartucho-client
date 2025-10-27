import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

      // ✅ Obter foto do perfil se disponível
      const profileImageUrl = seller.profileImage?.preSignedUrl;

      return {
        name: seller.nickName || seller.email || "Vendedor",
        avatar: profileImageUrl || null, // ✅ Usar foto do perfil ou null
        rating: averageRating || 0, // ✅ Usar rating real da API
        memberSince: getMemberSinceYear(), // ✅ Usar ano real do createdAt
        slug: seller.slug,
        id: seller.id,
      };
    }
    return {
      name: "Vendedor",
      avatar: null,
      rating: 0,
      memberSince: "2023",
      slug: undefined,
      id: undefined,
    };
  };

  const sellerData = getSellerData();

  // ✅ Função para navegar ao perfil do vendedor
  const handleSellerClick = () => {
    if (sellerData.id) {
      navigate(`/usuario/${sellerData.id}`);
    }
  };

  // Mostrar loading se estiver carregando os ratings
  if (loading && sellerId) {
    return (
      <div className="p-4 mt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Conheça o vendedor
        </h2>
        <div className="flex items-center bg-white p-4 rounded-lg">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4 animate-pulse overflow-hidden">
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
        {/* ✅ Foto do vendedor clicável */}
        <button
          onClick={handleSellerClick}
          className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#4f43ae] focus:ring-offset-2"
          aria-label={`Ver perfil de ${sellerData.name}`}
        >
          {sellerData.avatar ? (
            <img
              src={sellerData.avatar}
              alt={sellerData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-2xl">👤</span>
            </div>
          )}
        </button>

        {/* Informações do vendedor */}
        <div className="flex-1">
          <button
            onClick={handleSellerClick}
            className="text-gray-700 font-medium block hover:text-[#4f43ae] transition-colors text-left focus:outline-none focus:underline"
          >
            {sellerData.name}
          </button>
          <span className="text-sm text-gray-500">
            ⭐ {sellerData.rating.toFixed(1)}/5 • {totalRatings} avaliações
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
