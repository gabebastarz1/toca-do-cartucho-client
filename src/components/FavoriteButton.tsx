import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";

interface FavoriteButtonProps {
  advertisementId: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  advertisementId,
  size = "md",
  showText = false,
  className = "",
}) => {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();

  const isCurrentlyFavorite = isFavorite(advertisementId);

  const handleClick = async () => {
    

    await toggleFavorite(advertisementId);

    // if (success) {
    //   console.log("✅ [FavoriteButton] Operação realizada com sucesso");
    // } else {
    //   console.log("❌ [FavoriteButton] Falha na operação");
    // }
  };

  // ✅ Tamanhos do ícone
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // ✅ Classes do botão
  const buttonClasses = `
    inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
    ${
      isCurrentlyFavorite
        ? ""
        : "text-gray-600"
    }
    ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `.trim();

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={buttonClasses}
      title={
        isCurrentlyFavorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Heart
        className={`${sizeClasses[size]} ${
          isCurrentlyFavorite ? "fill-current" : ""
        }`}
        style={{
          color: isCurrentlyFavorite ? "#211C49" : undefined,
        }}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isCurrentlyFavorite ? "Favorito" : "Favoritar"}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
