import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import { Menu, X } from "lucide-react";

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
    genre: "action",
    theme: "fantasia",
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
    genre: "action",
    theme: "fantasia",
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
    genre: "action",
    theme: "futurista",
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
    genre: "action",
    theme: "fantasia",
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
    genre: "action",
    theme: "futurista",
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
  const [genres, setGenres] = useState<Array<{ id: string; name: string }>>([]);
  const [themes, setThemes] = useState<Array<{ id: string; name: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const handleSearch = (query: string) => {
    // Implementar lógica de busca
    console.log("Buscar por:", query);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/anuncio/${productId}`);
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

  // Simular carregamento de dados do backend
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        // Simular chamada para o backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dados mockados - substituir por chamada real para o backend
        setGenres([
          { id: "action", name: "Action" },
          { id: "comedy", name: "Comedy" },
          { id: "drama", name: "Drama" },
          { id: "educational", name: "Educational" },
          { id: "fantasy", name: "Fantasy" },
          { id: "historical", name: "Historical" },
          { id: "horror", name: "Horror" },
          { id: "kids", name: "Kids" },
          { id: "mystery", name: "Mystery" },
          { id: "romance", name: "Romance" },
          { id: "science-fiction", name: "Science fiction" },
          { id: "thriller", name: "Thriller" },
          { id: "warfare", name: "Warfare" },
        ]);

        setThemes([
          { id: "fantasia", name: "Fantasia" },
          { id: "futurista", name: "Futurista" },
          { id: "historico", name: "Histórico" },
          { id: "medieval", name: "Medieval" },
          { id: "espacial", name: "Espacial" },
        ]);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleFiltersChange = (filters: Record<string, string[]>) => {
    // Implementar lógica de filtros
    console.log("Filtros aplicados:", filters);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
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
          genres={genres}
          themes={themes}
          loading={categoriesLoading}
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

              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
                loading={loading}
              />
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
  );
};

export default ProductListing;
