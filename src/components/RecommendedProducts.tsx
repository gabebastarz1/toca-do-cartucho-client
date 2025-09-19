// src/components/RecommendedProducts.tsx

import React, { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Usando lucide para ícones

// A interface Product que você já tem no seu projeto
interface Product {
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
}

// Dados de exemplo com mais de 4 produtos para ativar o carrossel
const recommendedProductsData: Product[] = [
    { id: "snes-smw-1", image: "https://i.imgur.com/39p46v6.png", title: "Cartucho SNES - Super Mario World", rating: 4.0, reviewCount: 1, originalPrice: 100.0, currentPrice: 80.0, condition: "semi-new", type: "repro", location: "Cidade - Estado" },
    { id: "snes-mmx-1", image: "https://i.imgur.com/s6n5sCK.png", title: "Cartucho SNES - Mega Man X", rating: 4.0, reviewCount: 1, originalPrice: 100.0, currentPrice: 80.0, condition: "normal", type: "repro", location: "Cidade - Estado" },
    { id: "snes-smw-2", image: "https://i.imgur.com/2v3b1zT.png", title: "Cartucho SNES - Super Mario World", rating: 4.0, reviewCount: 1, originalPrice: 100.0, currentPrice: 80.0, condition: "good", type: "retro", location: "Cidade - Estado" },
    { id: "snes-dkc-1", image: "https://i.imgur.com/uN0m4Lq.png", title: "Cartucho SNES - Donkey Kong Country", rating: 5.0, reviewCount: 12, originalPrice: 120.0, currentPrice: 95.0, condition: "good", type: "retro", location: "Cidade - Estado" },
    { id: "snes-zelda-1", image: "https://i.imgur.com/s6n5sCK.png", title: "Cartucho SNES - The Legend of Zelda", rating: 5.0, reviewCount: 25, originalPrice: 150.0, currentPrice: 130.0, condition: "semi-new", type: "retro", location: "Cidade - Estado" },
    { id: "snes-smw-3", image: "https://i.imgur.com/39p46v6.png", title: "Cartucho SNES - Super Mario World", rating: 4.0, reviewCount: 1, originalPrice: 100.0, currentPrice: 80.0, condition: "good", type: "repro", location: "Cidade - Estado" },
];


interface RecommendedProductsProps {
  onProductClick?: (productId: string) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ onProductClick }) => {
  const showCarousel = recommendedProductsData.length > 4;
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
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      // Limpa os event listeners quando o componente é desmontado
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [recommendedProductsData]);


  // Função para rolar o carrossel
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      // Rola em 80% da largura visível do container para uma navegação fluida
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  return (
    <section className="bg-white rounded-lg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Você também pode gostar
        </h2>

        {showCarousel ? (
          // Renderiza o Carrossel customizado
          <div className="relative group">
            {/* Botão Esquerdo */}
            <button
              onClick={() => scroll('left')}
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
              {recommendedProductsData.map((product) => (
                <div key={product.id} className="flex-none w-[280px]">
                  <ProductCard
                    {...product}
                    onClick={() => onProductClick?.(product.id)}
                  />
                </div>
              ))}
            </div>

            {/* Botão Direito */}
            <button
              onClick={() => scroll('right')}
              className={`absolute top-1/2 -translate-y-1/2 -right-5 z-10 p-2 bg-white rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed`}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </div>
        ) : (
          // Renderiza o Grid Padrão
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProductsData.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onClick={() => onProductClick?.(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;