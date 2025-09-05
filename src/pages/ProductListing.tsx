import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import { Menu, X } from "lucide-react";
import Head from "../components/Head";

// Dados mockados para demonstração
const mockProducts = [
  {
    id: "1",
    title: "Cartucho SNES - Super Mario World",
    image: "/logo.svg", // Usando o logo como placeholder
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "semi-new" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "action",
    theme: "fantasia",
    saleType: "sale" as const,
    gameMode: ["singleplayer"],
    audioLanguage: "english",
    subtitleLanguage: "english",
    interfaceLanguage: "english",
    region: "north-america",
  },
  {
    id: "2",
    title: "Cartucho SNES - Mega Man X",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "normal" as const,
    type: "repro" as const,
    location: "Cidade - Estado",
    genre: "action",
    theme: "futurista",
    saleType: "trade" as const,
    gameMode: ["singleplayer"],
    audioLanguage: "japanese",
    subtitleLanguage: "english",
    interfaceLanguage: "english",
    region: "japan",
  },
  {
    id: "3",
    title: "Cartucho SNES - Super Mario World",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "good" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "fantasy",
    theme: "fantasia",
    saleType: "sale-trade" as const,
    gameMode: ["singleplayer", "multiplayer"],
    audioLanguage: "portuguese",
    subtitleLanguage: "portuguese",
    interfaceLanguage: "portuguese",
    region: "brazil",
  },
  {
    id: "4",
    title: "Cartucho SNES - Super Mario World",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "new" as const,
    type: "repro" as const,
    location: "Cidade - Estado",
    genre: "science-fiction",
    theme: "futurista",
    saleType: "sale" as const,
    gameMode: ["singleplayer"],
    audioLanguage: "english",
    subtitleLanguage: "english",
    interfaceLanguage: "english",
    region: "europe",
  },
  {
    id: "5",
    title: "Cartucho SNES - Mega Man X",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "damaged" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "action",
    theme: "futurista",
    saleType: "trade" as const,
    gameMode: ["multiplayer"],
    audioLanguage: "japanese",
    subtitleLanguage: "japanese",
    interfaceLanguage: "japanese",
    region: "korea",
  },
  {
    id: "6",
    title: "Cartucho SNES - Super Mario World",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "normal" as const,
    type: "repro" as const,
    location: "Cidade - Estado",
    genre: "action",
    theme: "fantasia",
    saleType: "sale" as const,
    gameMode: ["singleplayer"],
    audioLanguage: "english",
    subtitleLanguage: "english",
    interfaceLanguage: "english",
    region: "north-america",
  },
  {
    id: "7",
    title: "Cartucho SNES - Mega Man X",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "good" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "horror",
    theme: "historico",
    saleType: "sale-trade" as const,
    gameMode: ["singleplayer"],
    audioLanguage: "portuguese",
    subtitleLanguage: "portuguese",
    interfaceLanguage: "portuguese",
    region: "brazil",
  },
  {
    id: "8",
    title: "Cartucho SNES - Super Mario World",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "semi-new" as const,
    type: "repro" as const,
    location: "Cidade - Estado",
    genre: "comedy",
    theme: "medieval",
    saleType: "sale" as const,
    gameMode: ["multiplayer"],
    audioLanguage: "english",
    subtitleLanguage: "english",
    interfaceLanguage: "english",
    region: "europe",
  },
  {
    id: "9",
    title: "Cartucho SNES - Mega Man X",
    image: "/logo.svg",
    rating: 4.0,
    reviewCount: 1,
    originalPrice: 100,
    currentPrice: 80,
    discount: 20,
    condition: "new" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "mystery",
    theme: "espacial",
    saleType: "trade" as const,
    gameMode: ["singleplayer"],
    audioLanguage: "japanese",
    subtitleLanguage: "japanese",
    interfaceLanguage: "japanese",
    region: "australia",
  },
  {
    id: "10",
    title: "Cartucho SNES - Final Fantasy VI",
    image: "/logo.svg",
    rating: 4.9,
    reviewCount: 1,
    originalPrice: 150,
    currentPrice: 130,
    discount: 13,
    condition: "new" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "fantasy",
    theme: "fantasia",
  },
  {
    id: "11",
    title: "Cartucho SNES - Castlevania IV",
    image: "/logo.svg",
    rating: 4.5,
    reviewCount: 1,
    originalPrice: 90,
    currentPrice: 85,
    discount: 6,
    condition: "good" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "horror",
    theme: "fantasia",
  },
  {
    id: "12",
    title: "Cartucho SNES - Chrono Trigger",
    image: "/logo.svg",
    rating: 5.0,
    reviewCount: 1,
    originalPrice: 200,
    currentPrice: 180,
    discount: 10,
    condition: "new" as const,
    type: "retro" as const,
    location: "Cidade - Estado",
    genre: "fantasy",
    theme: "fantasia",
  },
];

const ProductListing: React.FC = () => {
  const navigate = useNavigate();
  const [allProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Buscar por:", query);
  };

  // Função unificada para aplicar todos os filtros (busca + filtros do sidebar)
  const applyAllFilters = useCallback(() => {
    let filtered = [...allProducts];

    // Aplicar filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        return (
          product.title.toLowerCase().includes(query) ||
          product.genre.toLowerCase().includes(query) ||
          product.theme.toLowerCase().includes(query) ||
          product.location.toLowerCase().includes(query)
        );
      });
    }

    // Aplicar filtros do sidebar
    if (Object.keys(activeFilters).length > 0) {
      // Filtrar por condições (sale-only, trade-only, sale-trade)
      if (activeFilters.conditions && activeFilters.conditions.length > 0) {
        filtered = filtered.filter((product) => {
          return activeFilters.conditions.some((condition) => {
            switch (condition) {
              case "sale-only":
                return product.saleType === "sale";
              case "trade-only":
                return product.saleType === "trade";
              case "sale-trade":
                return product.saleType === "sale-trade";
              default:
                return true;
            }
          });
        });
      }

      // Filtrar por estado de preservação
      if (activeFilters.preservation && activeFilters.preservation.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.preservation.includes(product.condition)
        );
      }

      // Filtrar por tipo de cartucho
      if (
        activeFilters.cartridgeType &&
        activeFilters.cartridgeType.length > 0
      ) {
        filtered = filtered.filter((product) =>
          activeFilters.cartridgeType.includes(product.type)
        );
      }

      // Filtrar por preço
      if (activeFilters.price && activeFilters.price.length === 2) {
        const [minPrice, maxPrice] = activeFilters.price;
        filtered = filtered.filter((product) => {
          const price = product.currentPrice;
          const min = minPrice ? parseFloat(minPrice) : 0;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Filtrar por temática
      if (activeFilters.theme && activeFilters.theme.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.theme.includes(product.theme)
        );
      }

      // Filtrar por gênero
      if (activeFilters.genre && activeFilters.genre.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.genre.includes(product.genre)
        );
      }

      // Filtrar por modo de jogo
      if (activeFilters.gameMode && activeFilters.gameMode.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.gameMode.some((mode) => product.gameMode.includes(mode))
        );
      }

      // Filtrar por idioma do áudio
      if (
        activeFilters.audioLanguage &&
        activeFilters.audioLanguage.length > 0
      ) {
        filtered = filtered.filter((product) =>
          activeFilters.audioLanguage.includes(product.audioLanguage)
        );
      }

      // Filtrar por idioma da legenda
      if (
        activeFilters.subtitleLanguage &&
        activeFilters.subtitleLanguage.length > 0
      ) {
        filtered = filtered.filter((product) =>
          activeFilters.subtitleLanguage.includes(product.subtitleLanguage)
        );
      }

      // Filtrar por idioma da interface
      if (
        activeFilters.interfaceLanguage &&
        activeFilters.interfaceLanguage.length > 0
      ) {
        filtered = filtered.filter((product) =>
          activeFilters.interfaceLanguage.includes(product.interfaceLanguage)
        );
      }

      // Filtrar por região
      if (activeFilters.region && activeFilters.region.length > 0) {
        filtered = filtered.filter((product) =>
          activeFilters.region.includes(product.region)
        );
      }
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchQuery, activeFilters]);

  const handleProductClick = (productId: string) => {
    // Forçar navegação com replace para garantir que a rota mude
    navigate(`/anuncio/${productId}`, { replace: false });
  };

  const handleFavoritesClick = () => {
    navigate("/favoritos");
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    console.log("Categoria selecionada:", category);

    // Implementar lógica de filtro por categoria
    if (category === "all") {
      setFilteredProducts(allProducts);
    } else {
      // Filtrar produtos baseado na categoria selecionada
      const filtered = allProducts.filter((product) => {
        // Verificar se o produto tem o gênero ou temática selecionada
        return product.genre === category || product.theme === category;
      });
      setFilteredProducts(filtered);
    }
  };

  const handleFiltersChange = (filters: Record<string, string[]>) => {
    console.log("Filtros aplicados:", filters);
    setActiveFilters(filters);
  };

  // Aplicar filtros sempre que searchQuery ou activeFilters mudarem
  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Head title="Produtos - Toca do Cartucho" />
      <div className="min-h-screen bg-[#f4f3f5]">
        {/* Header fixo */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#211C49]">
          {/* TopBar principal com barra de pesquisa e menu do usuário */}
          <TopBar
            logoPosition="left"
            showSearchBar={true}
            onSearch={handleSearch}
            searchPlaceholder="Pesquisa na Toca do Cartucho"
            showUserMenu={true}
            userName="Nome Sobrenome"
            onFavoritesClick={handleFavoritesClick}
            onProfileClick={handleProfileClick}
          />

          {/* Segunda layer com navegação */}
          <FilterTopBar
            onCategoryClick={handleCategoryClick}
            onFavoritesClick={handleFavoritesClick}
            activeCategory={activeCategory}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6">
              {/* Sidebar de filtros */}
              <div className="hidden lg:block">
                <div className="sticky top-32">
                  <FilterSidebar onFiltersChange={handleFiltersChange} />
                </div>
              </div>

              {/* Grid de produtos */}
              <div className="flex-1">
                {/* Botão para abrir sidebar no mobile */}
                <div className="lg:hidden mb-4">
                  <button
                    onClick={toggleSidebar}
                    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <Menu className="w-5 h-5" />
                    <span>Filtros</span>
                  </button>
                </div>

                {/* Indicador de resultados */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {searchQuery ? (
                        <span>
                          {filteredProducts.length} resultado(s) para "
                          {searchQuery}"
                        </span>
                      ) : (
                        <span>
                          {filteredProducts.length} produto(s) encontrado(s)
                        </span>
                      )}
                    </div>
                    {(searchQuery || Object.keys(activeFilters).length > 0) && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveFilters({});
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery
                        ? `Não encontramos produtos para "${searchQuery}".`
                        : "Tente ajustar os filtros para encontrar o que procura."}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilters({});
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <ProductGrid
                    products={filteredProducts}
                    onProductClick={handleProductClick}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={toggleSidebar}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-[#211C49] text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <button className="bg-[#2B2560] hover:bg-[#1a1640] px-8 py-3 rounded-lg font-semibold transition-colors">
              VOLTAR AO INICIO
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ProductListing;
