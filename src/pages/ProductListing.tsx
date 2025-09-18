import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import { Menu, X } from "lucide-react";
import { useAdvertisements } from "../hooks/useAdvertisements";
import { mapAdvertisementsToProducts } from "../utils/advertisementMapper";
import {
  mapFrontendFiltersToBackend,
  cleanBackendFilters,
  FrontendFilters,
} from "../utils/filterMapper";

// Removido mockProducts - agora usando dados do backend

const ProductListing: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Hook para buscar anúncios do backend
  const {
    advertisements,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    totalPages,
    setFilters: setBackendFilters,
    setPagination,
    fetchAdvertisements,
  } = useAdvertisements({
    initialPagination: { page: 1, pageSize: 12 },
    initialOrdering: { orderBy: "createdAt", orderDirection: "desc" },
  });

  // Converter anúncios para produtos
  const products = useMemo(() => {
    return mapAdvertisementsToProducts(advertisements);
  }, [advertisements]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleProductClick = (productId: string) =>
    navigate(`/anuncio/${productId}`);
  const handleFavoritesClick = () => navigate("/favoritos");
  const handleProfileClick = () => navigate("/perfil");
  const handleCategoryClick = (category: string) => setActiveCategory(category);

  // Atualizar filtros e aplicar ao backend
  const handleFiltersChange = useCallback(
    (filters: Record<string, string[]>) => {
      console.log("ProductListing recebeu filtros:", filters);
      setActiveFilters((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(filters)) return prev;

        // Extrair e atualizar filtro de preço
        if (filters.price) {
          const [min, max] = filters.price;
          console.log("Atualizando filtro de preço:", { min, max });
          setPriceRange({ min: min || "", max: max || "" });
        } else {
          // Limpar filtro de preço se não existir
          console.log("Limpando filtro de preço no ProductListing");
          setPriceRange({ min: "", max: "" });
        }

        return filters;
      });
    },
    []
  );

  // Aplicar filtros ao backend quando eles mudarem
  useEffect(() => {
    const frontendFilters: FrontendFilters = activeFilters as FrontendFilters;
    const backendFilters = mapFrontendFiltersToBackend(
      frontendFilters,
      searchQuery
    );
    const cleanedFilters = cleanBackendFilters(backendFilters);
    setBackendFilters(cleanedFilters);
  }, [activeFilters, searchQuery, setBackendFilters]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Função para lidar com mudanças de página
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPagination({ page: newPage, pageSize });
    },
    [setPagination, pageSize]
  );

  return (
    <div className="min-h-screen bg-[#f4f3f5]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#211C49]">
        <TopBar
          logoPosition="left"
          showSearchBar
          onSearch={handleSearch}
          searchPlaceholder="Pesquisa na Toca do Cartucho"
          showUserMenu
          userName="Nome Sobrenome"
          onFavoritesClick={handleFavoritesClick}
          onProfileClick={handleProfileClick}
        />
        <FilterTopBar
          onCategoryClick={handleCategoryClick}
          onFavoritesClick={handleFavoritesClick}
          activeCategory={activeCategory}
          onFilterChange={handleFiltersChange}
          currentFilters={activeFilters}
        />
      </div>

      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <FilterSidebar
                  onFiltersChange={handleFiltersChange}
                  initialFilters={activeFilters}
                  initialPriceRange={priceRange}
                  loading={loading}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="lg:hidden mb-4">
                <button
                  onClick={toggleSidebar}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <Menu className="w-5 h-5" />
                  <span>Filtros</span>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {loading ? (
                      <span>Carregando produtos...</span>
                    ) : searchQuery ? (
                      <span>
                        {totalCount} resultado(s) para "{searchQuery}"
                      </span>
                    ) : (
                      <span>{totalCount} produto(s) encontrado(s)</span>
                    )}
                  </div>
                </div>
              </div>

              {error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Erro ao carregar produtos
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {error.includes("Network Error")
                      ? "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
                      : error.includes("404")
                      ? "Serviço não encontrado. Tente novamente mais tarde."
                      : error.includes("500")
                      ? "Erro interno do servidor. Tente novamente mais tarde."
                      : error}
                  </p>
                  <button
                    onClick={() => fetchAdvertisements()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : products.length === 0 ? (
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
                      setPriceRange({ min: "", max: "" });
                      setActiveCategory("all");
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <>
                  <ProductGrid
                    products={products}
                    onProductClick={handleProductClick}
                    loading={loading}
                  />
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                initialFilters={activeFilters}
                initialPriceRange={priceRange}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

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
