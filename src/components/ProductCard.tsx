import React from "react";
import { Star, MapPin } from "lucide-react";
import Tooltip from "./Tooltip";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  originalPrice?: number;
  currentPrice: number;
  discount?: number;
  condition: "new" | "semi-new" | "good" | "normal" | "damaged";
  type: "retro" | "repro";
  location: string;
  genre?: string;
  theme?: string;
  saleType?: "sale" | "trade" | "sale-trade";
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  rating,
  reviewCount,
  originalPrice,
  currentPrice,
  condition,
  type,
  location,
  discount,
  genre,
  theme,
  saleType,
  onClick,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      new: "Novo",
      "semi-new": "Seminovo",
      good: "Bom",
      normal: "Normal",
      damaged: "Danificado",
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      new: "bg-green-100 text-green-800 border-green-200",
      "semi-new": "bg-blue-100 text-blue-800 border-blue-200",
      good: "bg-yellow-100 text-yellow-800 border-yellow-200",
      normal: "bg-gray-100 text-gray-800 border-gray-200",
      damaged: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[condition as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getTypeColor = (type: string) => {
    return type === "retro"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-orange-100 text-orange-800 border-orange-200";
  };

  const getConditionDescription = (condition: string) => {
    const descriptions = {
      new: "Produto lacrado, nunca utilizado, em perfeito estado. Embalagem intacta.",
      "semi-new": "Produto usado, sem danos visuais significativos.",
      good: "Produto com sinais leves de uso, como pequenos arranhões, desgaste na capa, leve amarelamento no cartucho.",
      normal:
        "Produto com desgaste visível, como arranhões, amarelamento no cartucho ou rótulo parcialmente danificado.",
      damaged:
        "Produto bastante desgastado, com rótulo danificado ou ausente. Pode conter trincas ou manchas.",
    };
    return descriptions[condition as keyof typeof descriptions] || "";
  };

  const getTypeDescription = (type: string) => {
    const descriptions = {
      retro: "Cartucho original da época do console.",
      repro: "Cópia não oficial, pode ter sido modificada ou traduzida.",
    };
    return descriptions[type as keyof typeof descriptions] || "";
  };

  const getSaleTypeLabel = (saleType?: string) => {
    const labels = {
      sale: "Venda",
      trade: "Troca",
      "sale-trade": "Venda e Troca",
    };
    return labels[saleType as keyof typeof labels] || "";
  };

  const getSaleTypeColor = (saleType?: string) => {
    const colors = {
      sale: "bg-green-100 text-green-800 border-green-200",
      trade: "bg-blue-100 text-blue-800 border-blue-200",
      "sale-trade": "bg-purple-100 text-purple-800 border-purple-200",
    };
    return (
      colors[saleType as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer transform hover:scale-105 transition-transform relative"
      onClick={onClick}
    >
      {/* Imagem do produto */}
      <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-lg">
        {image && image.trim() !== "" ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full border-8 border-white rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Avaliação */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">{renderStars(rating)}</div>
          <span className="text-xs text-gray-600">{rating}</span>
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>

        {/* Preços */}
        {currentPrice > 0 && (
          <div className="mb-3">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through mr-2">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="flex items-center text-lg font-semibold text-gray-900">
              {formatPrice(currentPrice)}
              {discount && (
                <div className=" text-[#47884F] text-sm px-2 py-1 font-normal">
                  {discount}% OFF
                </div>
              )}
            </span>
          </div>
        )}

        {/* Etiquetas de estado e tipo */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Tooltip content={getConditionDescription(condition)} position="top">
            <span
              className={`px-2 py-1 text-xs rounded-full border cursor-help ${getConditionColor(
                condition
              )}`}
            >
              {getConditionLabel(condition)}
            </span>
          </Tooltip>
          <Tooltip content={getTypeDescription(type)} position="top">
            <span
              className={`px-2 py-1 text-xs rounded-full border cursor-help ${getTypeColor(
                type
              )}`}
            >
              {type === "retro" ? "RETRÔ" : "REPRÔ"}
            </span>
          </Tooltip>
          {saleType && (
            <span
              className={`px-2 py-1 text-xs rounded-full border ${getSaleTypeColor(
                saleType
              )}`}
            >
              {getSaleTypeLabel(saleType)}
            </span>
          )}
        </div>

        {/* Localização */}
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
