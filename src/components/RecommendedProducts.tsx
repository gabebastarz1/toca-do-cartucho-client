// src/components/RecommendedProducts.tsx

import React, { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdvertisementDTO } from "../api/types";
import { useAdvertisements } from "../hooks/useAdvertisements";
import { mapAdvertisementsToProducts } from "../utils/advertisementMapper";

interface RecommendedProductsProps {
  onProductClick?: (productId: string, parentAdvertisementId?: number) => void;
  currentAdvertisement?: AdvertisementDTO; // ✅ NOVO: Anúncio atual para buscar relacionados
  maxProducts?: number; // ✅ NOVO: Limite de produtos recomendados
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  onProductClick,
  currentAdvertisement,
  maxProducts = 6,
}) => {
  // ✅ Buscar produtos relacionados baseado no anúncio atual
  const getRelatedFilters = () => {
    if (!currentAdvertisement) {
      // Se não há anúncio atual, buscar produtos aleatórios
      return { status: ["Active"] };
    }

    // Buscar produtos relacionados por gênero, tema ou franquia
    const relatedFilters: Record<string, string[]> = { status: ["Active"] };

    // ✅ Filtrar por gêneros do jogo atual
    if (currentAdvertisement.game?.genres?.length) {
      const genreIds = currentAdvertisement.game.genres
        .map((g: any) => g.genre?.id || g.id)
        .filter(Boolean);
      if (genreIds.length > 0) {
        relatedFilters.genre = genreIds.map((id) => `genre_${id}`);
      }
    }

    // ✅ Filtrar por temas do jogo atual
    if (currentAdvertisement.game?.themes?.length) {
      const themeIds = currentAdvertisement.game.themes
        .map((t: any) => t.theme?.id || t.id)
        .filter(Boolean);
      if (themeIds.length > 0) {
        relatedFilters.theme = themeIds.map((id) => `theme_${id}`);
      }
    }

    // ✅ Filtrar por franquia do jogo atual
    if (currentAdvertisement.game?.franchises?.length) {
      const franchiseIds = currentAdvertisement.game.franchises
        .map((f: any) => f.franchise?.id || f.id)
        .filter(Boolean);
      if (franchiseIds.length > 0) {
        relatedFilters.franchise = franchiseIds.map((id) => `franchise_${id}`);
      }
    }

    return relatedFilters;
  };

  // ✅ Hook para buscar produtos relacionados
  const { advertisements, loading, error } = useAdvertisements({
    initialFilters: getRelatedFilters(),
    initialPagination: { page: 1, pageSize: maxProducts },
    initialOrdering: { orderBy: "createdAt", orderDirection: "desc" },
    autoFetch: true,
  });

  // ✅ Converter advertisements para produtos e filtrar o atual
  const recommendedProducts = React.useMemo(() => {
    const products = mapAdvertisementsToProducts(advertisements);
    // Filtrar o produto atual se estiver na lista
    return products
      .filter(
        (product) =>
          !currentAdvertisement ||
          product.id !== currentAdvertisement.id.toString()
      )
      .slice(0, maxProducts);
  }, [advertisements, currentAdvertisement, maxProducts]);

  const showCarousel = recommendedProducts.length > 4;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Estados para controlar a visibilidade dos botões de navegação
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Função para verificar o estado do scroll e atualizar os botões
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      // Usamos uma tolerância de 1px para evitar problemas de arredondamento
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Roda a verificação quando o componente monta e quando a janela é redimensionada
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll(); // Verifica o estado inicial
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      // Limpa os event listeners quando o componente é desmontado
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [recommendedProducts]); // ✅ Usar recommendedProducts em vez de recommendedProductsData

  // Função para rolar o carrossel
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      // Rola em 80% da largura visível do container para uma navegação fluida
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white rounded-lg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Você também pode gostar
        </h2>

        {/* ✅ Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">
              Carregando produtos recomendados...
            </span>
          </div>
        )}

        {/* ✅ Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">
              Erro ao carregar produtos recomendados
            </p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        {/* ✅ Empty State */}
        {!loading && !error && recommendedProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhum produto relacionado encontrado
            </p>
          </div>
        )}

        {/* ✅ Products Display */}
        {!loading && !error && recommendedProducts.length > 0 && (
          <>
            {showCarousel ? (
              // Renderiza o Carrossel customizado
              <div className="relative group">
                {/* Botão Esquerdo */}
                <button
                  onClick={() => scroll("left")}
                  className={`absolute top-1/2 -translate-y-1/2 -left-5 z-10 p-2 bg-white rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed`}
                  disabled={!canScrollLeft}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>

                {/* Container Rolável */}
                <div
                  ref={scrollContainerRef}
                  className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
                >
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex-none w-64 sm:w-72 md:w-80"
                    >
                      <ProductCard
                        {...product}
                        onClick={() =>
                          onProductClick?.(
                            product.id,
                            product.parentAdvertisementId
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Botão Direito */}
                <button
                  onClick={() => scroll("right")}
                  className={`absolute top-1/2 -translate-y-1/2 -right-5 z-10 p-2 bg-white rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed`}
                  disabled={!canScrollRight}
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </div>
            ) : (
              // Renderiza o Grid Padrão
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onClick={() =>
                      onProductClick?.(
                        product.id,
                        product.parentAdvertisementId
                      )
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;
