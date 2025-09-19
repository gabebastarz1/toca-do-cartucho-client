import React from "react";
import { Heart, Star } from "lucide-react";

interface ProductInfoProps {
  data?: {
    title: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviewCount: number;
    productInfo: {
      genres: string[];
      themes: string[];
      gameModes: string[];
      preservationState: string;
      preservationDescription: string;
      cartridgeType: string;
      region: string;
    };
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  data = {
    title: "Cartucho Super Mario World - Usado - Vendo ou Troco",
    price: 89.99,
    originalPrice: 120.0,
    discount: 25,
    rating: 4.2,
    reviewCount: 13,
    productInfo: {
      genres: ["Ação", "Aventura", "Plataforma"],
      themes: ["Fantasia", "Reinos"],
      gameModes: ["Um jogador"],
      preservationState: "Bom",
      preservationDescription: "Pequenas marcas de uso",
      cartridgeType: "Repro",
      region: "Europa",
    },
  },
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
        ))}
        {hasHalfStar && (
          <Star
            key="half"
            className="h-4 w-4 text-yellow-500 fill-current opacity-50"
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">{data.title}</h1>
        <Heart className="h-6 w-6 text-gray-500 cursor-pointer hover:text-red-500 transition-colors" />
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <div className="flex items-center mr-2">{renderStars(data.rating)}</div>
        <span className="mr-1">({data.reviewCount})</span>
        <span>·</span>
        <span className="ml-1 text-blue-600 cursor-pointer">
          Avaliações do Vendedor
        </span>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 line-through">
          R$ {data.originalPrice.toFixed(2).replace(".", ",")}
        </p>
        <p className="text-3xl font-bold text-gray-900">
          R$ {data.price.toFixed(2).replace(".", ",")}
          <span className="text-green-600 text-base font-normal">
            {" "}
            {data.discount}% OFF
          </span>
        </p>
      </div>

      <div className="text-sm text-gray-700">
        <h2 className="font-semibold mb-2">Informações:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Gêneros:</span>{" "}
            {data.productInfo.genres.join(", ")}
          </li>
          <li>
            <span className="font-medium">Temáticas:</span>{" "}
            {data.productInfo.themes.join(", ")}
          </li>
          <li>
            <span className="font-medium">Modos de Jogo:</span>{" "}
            {data.productInfo.gameModes.join(", ")}
          </li>
          <li>
            <span className="font-medium">
              Estado de Preservação ({data.productInfo.preservationState}):
            </span>{" "}
            {data.productInfo.preservationDescription}
          </li>
          <li>
            <span className="font-medium">Tipo de Cartucho:</span>{" "}
            {data.productInfo.cartridgeType}
          </li>
          <li>
            <span className="font-medium">Região:</span>{" "}
            {data.productInfo.region}
          </li>
        </ul>
        <p className="text-blue-600 mt-2 cursor-pointer">
          Ver mais características
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
