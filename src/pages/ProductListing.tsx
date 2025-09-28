import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import OrderingSelector from "../components/OrderingSelector";
import { useAdvertisements } from "../hooks/useAdvertisements";
import { mapAdvertisementsToProducts } from "../utils/advertisementMapper";
import {
  mapFrontendFiltersToBackend,
  cleanBackendFilters,
  FrontendFilters,
} from "../utils/filterMapper";
import Footer from "../components/Footer";
import BottomBar from "@/components/BottomBar";
import Head from "@/components/Head";

// Removido mockProducts - agora usando dados do backend

const ProductListing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Obter dados de categorias para validação (removido - não mais necessário)
  // Função para inicializar estado baseado na URL (removida - não mais necessária)

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState(""); // Estado interno para digitação
  const [confirmedSearchQuery, setConfirmedSearchQuery] = useState(""); // Estado confirmado para filtros
  const [isInitialized, setIsInitialized] = useState(false); // Estado para controlar inicialização

  // ✅ NOVO: Estado para ordenação
  const [currentOrdering, setCurrentOrdering] = useState({
    value: "Newest",
    label: "Mais Novo",
  });

  // Função para criar filtros iniciais baseados na URL (removida - não mais necessária)

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
    setOrdering,
    fetchAdvertisements,
  } = useAdvertisements({
    initialFilters: { status: "Active" }, // Apenas status inicial, filtros serão aplicados via useEffect
    initialPagination: { page: 1, pageSize: 15 },
    initialOrdering: { ordering: "Newest" },
  });

  // Converter anúncios para produtos
  const products = useMemo(() => {
    return mapAdvertisementsToProducts(advertisements);
  }, [advertisements]);

  // Inicializar searchQuery e filtros a partir dos parâmetros da URL
  useEffect(() => {
    console.log("=== URL EFFECT TRIGGERED ===");
    console.log("location.search:", location.search);

    const urlParams = new URLSearchParams(location.search);

    // Processar pesquisa
    const searchParam = urlParams.get("search");
    if (searchParam) {
      const decodedSearch = decodeURIComponent(searchParam);
      console.log("Setting search from URL:", decodedSearch);
      setSearchQuery(decodedSearch);
      setConfirmedSearchQuery(decodedSearch);
    } else {
      console.log("No search param, clearing search");
      setSearchQuery("");
      setConfirmedSearchQuery("");
    }

    // Processar filtros da URL
    const urlFilters: Record<string, string[]> = {};

    // Processar gênero
    const genreParam = urlParams.get("genre");
    if (genreParam) {
      urlFilters.genre = genreParam.split(",");
      console.log("Setting genre from URL:", urlFilters.genre);
    }

    // Processar tema
    const themeParam = urlParams.get("theme");
    if (themeParam) {
      urlFilters.theme = themeParam.split(",");
      console.log("Setting theme from URL:", urlFilters.theme);
    }

    // Processar condições
    const conditionsParam = urlParams.get("conditions");
    if (conditionsParam) {
      urlFilters.conditions = conditionsParam.split(",");
      console.log("Setting conditions from URL:", urlFilters.conditions);
    }

    // Processar preço
    const minPriceParam = urlParams.get("minPrice");
    const maxPriceParam = urlParams.get("maxPrice");
    if (minPriceParam || maxPriceParam) {
      urlFilters.price = [minPriceParam || "", maxPriceParam || ""];
      console.log("Setting price from URL:", {
        min: minPriceParam,
        max: maxPriceParam,
      });
      setPriceRange({ min: minPriceParam || "", max: maxPriceParam || "" });
    } else {
      console.log("No price params, clearing price range");
      setPriceRange({ min: "", max: "" });
    }

    console.log("ProductListing - Final URL filters:", urlFilters);
    console.log("Setting activeFilters to:", urlFilters);
    setActiveFilters(urlFilters);
    setIsInitialized(true); // Marcar como inicializado após processar URL
    console.log("=== URL EFFECT COMPLETED ===");
  }, [location.search]);

  // Refs para evitar loop (removido - não mais necessário)

  // Atualizar estado quando a URL mudar (removido - usando comunicação direta)

  const handleProductClick = (
    productId: string,
    parentAdvertisementId?: number
  ) => {
    if (parentAdvertisementId) {
      // ✅ Se é uma variação, redirecionar para o anúncio principal com a variação pré-selecionada
      navigate(`/anuncio/${parentAdvertisementId}?variation=${productId}`);
    } else {
      // ✅ Se é um anúncio principal, redirecionar normalmente
      navigate(`/anuncio/${productId}`);
    }
  };
  const handleProfileClick = () => navigate("/perfil");

  // Callback para limpar a pesquisa
  const handleClearSearch = useCallback(() => {
    console.log("ProductListing - Limpando pesquisa");
    setSearchQuery("");
    setConfirmedSearchQuery(""); // Também limpar o estado confirmado
    // Também limpar a URL
    navigate("/produtos", { replace: true });
  }, [navigate]);

  // Callback para mudanças na pesquisa (apenas atualiza o estado interno)
  const handleSearchChange = useCallback((value: string) => {
    console.log("ProductListing - Mudança na pesquisa:", value);
    setSearchQuery(value);
    // NÃO atualiza confirmedSearchQuery aqui - só na confirmação
  }, []);

  // ✅ NOVO: Callback para mudança de ordenação
  const handleOrderingChange = useCallback(
    (ordering: { value: string; label: string }) => {
      console.log("ProductListing - Mudando ordenação:", ordering);
      setCurrentOrdering(ordering);

      // Aplicar nova ordenação no hook
      setOrdering({
        ordering: ordering.value,
      });
    },
    [setOrdering]
  );

  // Callback para confirmar a pesquisa (quando usuário pressiona Enter)
  const handleSearchConfirm = useCallback(() => {
    console.log("ProductListing - Confirmando pesquisa:", searchQuery);
    setConfirmedSearchQuery(searchQuery);
    // Atualizar a URL com a pesquisa confirmada
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/produtos");
    }
  }, [searchQuery, navigate]);

  // Atualizar filtros e aplicar ao backend
  const handleFiltersChange = useCallback(
    (filters: Record<string, string[]>) => {
      console.log("=== HANDLE FILTERS CHANGE ===");
      console.log("ProductListing recebeu filtros:", filters);

      // Verificar se os filtros realmente mudaram
      setActiveFilters((prev) => {
        console.log("setActiveFilters - prev:", prev);
        console.log("setActiveFilters - new:", filters);
        console.log(
          "setActiveFilters - são iguais?",
          JSON.stringify(prev) === JSON.stringify(filters)
        );

        if (JSON.stringify(prev) === JSON.stringify(filters)) {
          console.log("setActiveFilters - Filtros iguais, retornando prev");
          return prev;
        }
        console.log("setActiveFilters - Filtros diferentes, atualizando");
        return filters;
      });

      // Atualizar filtro de preço separadamente para evitar múltiplas re-renderizações
      if (filters.price) {
        const [min, max] = filters.price;
        console.log("Atualizando filtro de preço:", { min, max });
        setPriceRange({ min: min || "", max: max || "" });
      } else {
        // Limpar filtro de preço se não existir
        console.log("Limpando filtro de preço no ProductListing");
        setPriceRange({ min: "", max: "" });
      }
      console.log("=== HANDLE FILTERS CHANGE COMPLETED ===");
    },
    [] // ✅ Removido activeFilters das dependências para evitar loop
  );

  useEffect(() => {
    // Só aplicar filtros se já foi inicializado pela URL
    if (!isInitialized) {
      console.log("=== FILTER EFFECT SKIPPED - NOT INITIALIZED ===");
      return;
    }

    console.log("=== FILTER EFFECT TRIGGERED ===");
    console.log("activeFilters:", activeFilters);
    console.log("confirmedSearchQuery:", confirmedSearchQuery);

    const frontendFilters: FrontendFilters = activeFilters as FrontendFilters;
    const mapped = mapFrontendFiltersToBackend(
      frontendFilters,
      confirmedSearchQuery
    );
    const cleaned = cleanBackendFilters(mapped);

    console.log("=== FILTER DEBUG ===");
    console.log("Frontend filters:", frontendFilters);
    console.log("Search query in backend filters:", confirmedSearchQuery);
    console.log("Mapped backend filters:", mapped);
    console.log("Cleaned backend filters:", cleaned);
    console.log("Conditions filter:", frontendFilters.conditions);
    console.log("IsSale in mapped:", mapped.isSale);
    console.log("IsTrade in mapped:", mapped.isTrade);
    console.log("===================");

    // Garantir que sempre filtre apenas produtos ativos
    const finalFilters = { ...cleaned, status: "Active" };
    console.log("Setting backend filters:", finalFilters);
    console.log("Aguardando resposta da API...");

    // Evitar atualizações desnecessárias - só aplicar se realmente mudou
    setBackendFilters(finalFilters);
    console.log("=== FILTER EFFECT COMPLETED ===");
  }, [activeFilters, confirmedSearchQuery, setBackendFilters, isInitialized]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Função para lidar com mudanças de página
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPagination({ page: newPage, pageSize });
    },
    [setPagination, pageSize]
  );

  return (
    <>
      <Head title="Produtos" />

      <div className="min-h-screen bg-[#f4f3f5] overflow-hidden">
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#211C49]">
          <TopBar
            logoPosition="left"
            showSearchBar
            searchPlaceholder="Pesquisa na Toca do Cartucho"
            showUserMenu
            onProfileClick={handleProfileClick}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchConfirm={handleSearchConfirm}
          />
          <FilterTopBar
            currentFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onClearSearch={handleClearSearch}
          />
        </div>

        <div className="pt-36">
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

              <div className="flex-1 min-w-0">
                <div className="md:hidden ">
                  <div className="flex items-center justify-between text-sm text-gray-900">
                    <button
                      onClick={toggleSidebar}
                      className="flex items-center space-x-2 px-4 py-2"
                    >
                      <span>Filtros</span>
                      <img src="../public/filter.svg" />
                    </button>

                    {/* OrderingSelector no mobile */}
                    <OrderingSelector
                      currentOrdering={currentOrdering}
                      onOrderingChange={handleOrderingChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {/* ✅ NOVO: Ocultar quantidade de produtos no mobile */}
                    <div className="text-sm text-gray-600 hidden md:block">
                      {loading ? (
                        <span>Carregando produtos...</span>
                      ) : confirmedSearchQuery ? (
                        <span>
                          {totalCount} resultado(s) para "{confirmedSearchQuery}
                          "
                        </span>
                      ) : (
                        <span>{totalCount} produto(s) encontrado(s)</span>
                      )}
                    </div>

                    {/* DESKTOP*/}
                    <div className="hidden md:block">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-600">Ordenar por:</p>
                        <OrderingSelector
                          currentOrdering={currentOrdering}
                          onOrderingChange={handleOrderingChange}
                        />
                      </div>
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
                      }}
                      className="px-4 py-2 bg-[#483D9E] text-white rounded-lg hover:bg-purple-700 transition-colors"
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
            <div className="absolute left-0 top-0 h-full w-full bg-[#F4F3F5] shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 flex-shrink-0">
                <h2 className="text-lg font-semibold"></h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar
                  onFiltersChange={handleFiltersChange}
                  initialFilters={activeFilters}
                  initialPriceRange={priceRange}
                  loading={loading}
                />
                <div className="mt-6">
                  <button
                    className="w-full bg-[#4F378B] mb-32 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-800 transition-colors duration-200"
                    onClick={toggleSidebar}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer
          showBackToTopButton={true}
          onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </div>
      <BottomBar />
    </>
  );
};

export default ProductListing;
