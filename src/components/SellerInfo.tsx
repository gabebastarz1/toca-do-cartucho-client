import React from "react";
import { AdvertisementDTO } from "../api/types";

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

const SellerInfo: React.FC<SellerInfoProps> = ({
  advertisement,
}) => {
  // Função para converter dados do seller do advertisement
  const getSellerData = () => {
    if (advertisement?.seller) {
      const seller = advertisement.seller;
      return {
        name: seller.nickName || seller.email || "Vendedor",
        avatar: "👤", // Pode ser implementado com foto do perfil
        rating: 4.5, // Mockado por enquanto - implementar sistema de avaliações
        memberSince: new Date(seller.createdAt || "2023-01-01")
          .getFullYear()
          .toString(),
      };
    }
    return data;
  };

  const sellerData = getSellerData();

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
            ⭐ {sellerData.rating}/5 • Membro desde {sellerData.memberSince}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
