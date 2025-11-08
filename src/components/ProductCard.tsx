import React from "react";
import { Star, MapPin } from "lucide-react";
import Tooltip from "./Tooltip";
import { useSellerRatings } from "../hooks/useSellerRatings";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  originalPrice?: number;
  currentPrice: number;
  discount?: number;
  displayDiscount?: boolean; // Se false, não mostra o desconto
  condition: "new" | "semi-new" | "good" | "normal" | "damaged";
  type: "retro" | "repro";
  location: string;
  genre?: string;
  theme?: string;
  saleType?: "sale" | "trade" | "sale-trade";
  sellerId?: string;
  parentAdvertisementId?: number;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
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
  displayDiscount = true, // Por padrão, mostra o desconto
  saleType,
  sellerId,
  onClick,
}) => {
  const { averageRating, totalRatings } = useSellerRatings(sellerId);

  const displayRating = averageRating > 0 ? averageRating : rating;
  const displayReviewCount = totalRatings > 0 ? totalRatings : reviewCount;
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
      new: "bg-[#EDECF7] text-[#211C49]",
      "semi-new": "bg-[#EDECF7] text-[#211C49]",
      good: "bg-[#EDECF7] text-[#211C49]",
      normal: "bg-[#EDECF7] text-[#211C49]",
      damaged: "bg-[#EDECF7] text-[#211C49]",
    };
    return (
      colors[condition as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getTypeColor = (type: string) => {
    return type === "retro"
      ? "bg-[#EDECF7] text-[#211C49]"
      : "bg-[#EDECF7] text-[#211C49]";
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

  {
    /* 
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
*/
  }
  const renderStars = (rating: number) => {
    const validRating = Math.max(0, Math.min(5, rating || 0));
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(validRating)
            ? "text-[#1D1B20] fill-current"
            : "text-[#1D1B20]"
        }`}
      />
    ));
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer transform hover:scale-105 transition-transform relative"
      onClick={onClick}
    >
      {/* ✅ Botão de favorito no canto superior direito */}
      <div
        className="absolute bottom-2 right-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <FavoriteButton
          advertisementId={parseInt(id)}
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white"
        />
      </div>

      {/* ✅ NOVO: Layout responsivo - Horizontal no mobile, Vertical no desktop */}

      {/* Mobile: Layout horizontal */}
      <div className="flex items-center md:hidden">
        {saleType && (
          <span
            className={`absolute z-50 top-3 right-0 px-3 py-1 inline-block text-xs bg-[#38307C] text-white shadow-xl`}
          >
            {getSaleTypeLabel(saleType)}
          </span>
        )}
        {/* Imagem à esquerda */}
        <div className="w-24 h-24 bg-gray-100 overflow-hidden rounded-lg ml-2 flex-shrink-0 flex items-center justify-center">
          {image && image.trim() !== "" ? (
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain bg-white"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Conteúdo à direita */}
        <div className="flex-1 p-3 min-w-0">
          {/* Título */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>

          {/* Avaliação */}
          <div className="flex items-center space-x-1 mb-1">
            <div className="flex items-center">
              {renderStars(displayRating)}
            </div>
            <span className="text-xs text-gray-600">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({displayReviewCount})
            </span>
          </div>

          {/* Preços */}
          {currentPrice > 0 && (
            <div className="mb-2">
              {originalPrice &&
                originalPrice > 0 &&
                originalPrice !== currentPrice && (
                  <span className="text-xs text-gray-400 line-through mr-2">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              <span className="flex items-center text-sm font-semibold text-gray-900">
                {formatPrice(currentPrice)}
                {discount && displayDiscount !== false && (
                  <span className="text-[#47884F] text-xs px-1 py-0.5 font-normal ml-1">
                    {discount}% OFF
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full border ${getConditionColor(
                condition
              )}`}
            >
              {getConditionLabel(condition)}
            </span>
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full border ${getTypeColor(
                type
              )}`}
            >
              {type === "retro" ? "RETRÔ" : "REPRÔ"}
            </span>
          </div>

          {/* Localização */}
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Desktop: Layout vertical */}
      <div className="hidden md:block">
        {/* Imagem do produto */}
        {saleType && (
          <span
            className={`absolute z-50 top-3 right-0 px-3 py-1 inline-block text-xs bg-[#38307C] text-white shadow-xl`}
          >
            {getSaleTypeLabel(saleType)}
          </span>
        )}
        <div className="relative h-48 bg-gray-100 overflow-hidden rounded-t-lg border-b border-white border-8 inner-border">
          {image && image.trim() !== "" ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-contain bg-white "
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
            <div className="flex items-center">
              {renderStars(displayRating)}
            </div>
            <span className="text-xs text-gray-600">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({displayReviewCount})
            </span>
          </div>

          {/* Preços */}
          {currentPrice > 0 && (
            <div className="mb-3">
              {originalPrice &&
                originalPrice > 0 &&
                originalPrice > currentPrice &&
                originalPrice !== currentPrice &&
                displayDiscount !== false && (
                  <span className="text-xs text-gray-400 line-through mr-2">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              <span className="flex items-center text-lg font-semibold text-gray-900">
                {formatPrice(currentPrice)}
                {discount && displayDiscount !== false && (
                  <div className=" text-[#47884F] text-sm px-2 py-1 font-normal">
                    {discount}% OFF
                  </div>
                )}
              </span>
            </div>
          )}

          {/* Etiquetas de estado e tipo */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Tooltip
              content={getConditionDescription(condition)}
              position="top"
            >
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full border cursor-help ${getConditionColor(
                  condition
                )}`}
              >
                {getConditionLabel(condition)}
              </span>
            </Tooltip>
            <Tooltip content={getTypeDescription(type)} position="top">
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full border cursor-help ${getTypeColor(
                  type
                )}`}
              >
                {type === "retro" ? "RETRÔ" : "REPRO"}
              </span>
            </Tooltip>
          </div>

          {/* Localização */}
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
