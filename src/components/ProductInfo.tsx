import React from "react";
import { Heart, Star } from "lucide-react";
import { AdvertisementDTO } from "../api/types";
import { useSellerRatings } from "../hooks/useSellerRatings";

interface ProductInfoProps {
  advertisement?: AdvertisementDTO;

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

const ProductInfo: React.FC<ProductInfoProps> = ({ advertisement }) => {
  // Buscar ratings do vendedor
  const sellerId = advertisement?.seller?.id;
  const { averageRating, totalRatings } = useSellerRatings(sellerId);

  // Função para converter dados do advertisement para o formato esperado
  const getProductData = () => {
    if (advertisement) {
      // Calcular preço com base em sale
      const salePrice = advertisement.sale?.price || 0;
      const originalPrice = advertisement.sale?.previousPrice || 0;
      const discount = Math.round(
        ((originalPrice - salePrice) / originalPrice) * 100
      );

      // Tentar diferentes estruturas para modos de jogo
      let gameModes = [];

      if (advertisement.game?.gameGameModes) {
        // Verificar se é array de GameGameModesDTO (com wrapper) ou GameModeDTO (direto)
        const firstItem = advertisement.game.gameGameModes[0];

        if (firstItem && typeof firstItem === "object") {
          if ("gameModes" in firstItem) {
            // Estrutura real: gameGameModes[].gameModes.name
            gameModes = advertisement.game.gameGameModes
              .map((gm: any) => gm.gameModes?.name)
              .filter(Boolean);
          } else if ("gameMode" in firstItem) {
            // Estrutura alternativa: GameGameModesDTO[]
            gameModes = advertisement.game.gameGameModes
              .map((gm: any) => gm.gameMode?.name)
              .filter(Boolean);
          } else if ("name" in firstItem) {
            // Estrutura direta: GameModeDTO[]
            gameModes = advertisement.game.gameGameModes
              .map((gm: any) => gm.name)
              .filter(Boolean);
          } else {
            // Tentar todas as estruturas possíveis
            gameModes = advertisement.game.gameGameModes
              .map(
                (gm: any) => gm.gameModes?.name || gm.gameMode?.name || gm.name
              )
              .filter(Boolean);
          }
        }
      } else if (advertisement.game?.gameModes) {
        gameModes = advertisement.game.gameModes
          .map((gm: any) => gm.name)
          .filter(Boolean);
      }

      // Processar gêneros com debug
      const genres =
        advertisement.game?.genres
          ?.map((g: any) => {
            return g.genre?.name || g.name;
          })
          .filter(Boolean) || [];

      // Processar temas com debug
      const themes =
        advertisement.game?.themes
          ?.map((t: any) => {
            // Na estrutura real é "theme" (singular)
            return t.theme?.name || t.name;
          })
          .filter(Boolean) || [];

      const productInfo = {
        genres: genres,
        themes: themes,
        gameModes: gameModes,
        preservationState: advertisement.preservationState?.name || "",
        preservationDescription:
          advertisement.preservationState?.description || "",
        cartridgeType: advertisement.cartridgeType?.name || "",
        region: advertisement.gameLocalization?.region?.name || "",
      };

      return {
        title: advertisement.title,
        price: salePrice,
        originalPrice: originalPrice,
        discount: discount,
        rating: averageRating || 0, // ✅ Usar rating real do vendedor
        reviewCount: totalRatings || 0, // ✅ Usar contagem real de avaliações
        productInfo: productInfo,
      };
    }
    // Fallback para dados mockados se não houver advertisement
    return {
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
    };
  };
  const HalfStar: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
    // useId garante um ID único para o gradiente, evitando conflitos
    const gradientId = `half-star-gradient-${React.useId()}`;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className} {...props}>
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#E5E7EB" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path fill={`url(#${gradientId})`} strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    );
  };

  const productData = getProductData();
  const renderStars = (rating: number) => {
    // ✅ Validar e normalizar o rating
    const validRating = Math.max(0, Math.min(5, rating || 0));
    const fullStars = Math.floor(validRating);
    const hasHalfStar = validRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-[#1D1B20] fill-current" />
        ))}
        {hasHalfStar && <HalfStar key="half" className="h-4 w-4 text-[#1D1B20] " />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-[#1D1B20]" />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          {productData.title}
        </h1>
        <Heart className="h-6 w-6 text-gray-500 cursor-pointer hover:text-red-500 transition-colors" />
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <div className="flex items-center mr-2">
          {renderStars(productData.rating)}
        </div>
        <span className="mr-1">({productData.reviewCount})</span>
        <span>·</span>
        <span className="ml-1 text-blue-600 cursor-pointer">
          Avaliações do Vendedor
        </span>
      </div>

      <div className="mb-6">
        {productData.originalPrice > productData.price && (
          <p className="text-sm text-gray-500 line-through">
            R$ {productData.originalPrice.toFixed(2).replace(".", ",")}
          </p>
        )}
        <p className="text-3xl font-bold text-gray-900">
          R$ {productData.price.toFixed(2).replace(".", ",")}
          {productData.discount > 0 && (
            <span className="text-green-600 text-base font-normal">
              {" "}
              {productData.discount}% OFF
            </span>
          )}
        </p>
      </div>

      <div className="text-sm text-gray-700">
        <h2 className="font-semibold mb-2">Informações:</h2>
        <ul className="list-disc list-inside space-y-1">
          {productData.productInfo.genres.length > 0 && (
            <li>
              <span className="font-medium">Gêneros:</span>{" "}
              {productData.productInfo.genres.join(", ")}
            </li>
          )}
          {productData.productInfo.themes.length > 0 && (
            <li>
              <span className="font-medium">Temáticas:</span>{" "}
              {productData.productInfo.themes.join(", ")}
            </li>
          )}
          {productData.productInfo.gameModes.length > 0 && (
            <li>
              <span className="font-medium">Modos de Jogo:</span>{" "}
              {productData.productInfo.gameModes.join(", ")}
            </li>
          )}
          {productData.productInfo.preservationState && (
            <li>
              <span className="font-medium">
                Estado de Preservação (
                {productData.productInfo.preservationState}):
              </span>{" "}
              {productData.productInfo.preservationDescription ||
                "Não informado"}
            </li>
          )}
          {productData.productInfo.cartridgeType && (
            <li>
              <span className="font-medium">Tipo de Cartucho:</span>{" "}
              {productData.productInfo.cartridgeType}
            </li>
          )}
          {productData.productInfo.region && (
            <li>
              <span className="font-medium">Região:</span>{" "}
              {productData.productInfo.region}
            </li>
          )}
        </ul>
        <button
          onClick={() => {
            const characteristicsSection = document.getElementById(
              "product-characteristics"
            );
            if (characteristicsSection) {
              characteristicsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
          className="text-blue-600 mt-2 cursor-pointer hover:text-blue-800 hover:underline transition-colors"
        >
          Ver mais características
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
