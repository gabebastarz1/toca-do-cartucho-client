import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "./CategoryDataProvider";
import { Menu } from "lucide-react";

interface FilterTopBarProps {
  currentFilters?: Record<string, string[]>; // Para manter filtros da sidebar
  onFiltersChange?: (filters: Record<string, string[]>) => void; // Usar o mesmo callback do FilterSidebar
  onClearSearch?: () => void; // Callback para limpar a pesquisa
}

const FilterTopBar: React.FC<FilterTopBarProps> = ({
  currentFilters = {},
  onFiltersChange,
  onClearSearch,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para determinar categoria ativa baseada na URL (removida - usando filtros atuais)

  // Determinar categoria ativa baseada nos filtros atuais
  const getCurrentActiveCategory = () => {
    if (currentFilters.genre && currentFilters.genre.length > 0) {
      return currentFilters.genre[0];
    }
    if (currentFilters.theme && currentFilters.theme.length > 0) {
      return currentFilters.theme[0];
    }
    return "all";
  };

  const currentActiveCategory = getCurrentActiveCategory();

  // Usar dados do CategoryDataProvider
  const { genres, themes, loading, error } = useCategories();

  const categories = [
    { id: "all", label: "All" },
    { id: "generos", label: "Gêneros" },
    { id: "tematicas", label: "Temáticas" },
    { id: "sobre", label: "Sobre" },
  ];

  // Ler parâmetros da URL para determinar categoria ativa (removido - usando comunicação direta)

  const handleCategoryClick = (categoryId: string) => {
    setOpenDropdown(null);

    console.log("=== FILTER TOPBAR CLICK ===");
    console.log("Category clicked:", categoryId);
    console.log("Current filters:", currentFilters);
    console.log("onFiltersChange available:", !!onFiltersChange);

    // Se há callback de filtros, usar o mesmo método do FilterSidebar
    if (onFiltersChange) {
      console.log(
        "FilterTopBar - Aplicando filtro usando método do FilterSidebar:",
        categoryId
      );

      // LIMPAR TODOS OS FILTROS E APLICAR APENAS O NOVO FILTRO
      const newFilters: Record<string, string[]> = {};

      if (categoryId === "all") {
        // Para "All", manter apenas filtros vazios (status=Active será aplicado automaticamente)
        
      } else {
        // Verificar se é um gênero ou tema válido
        const genre = genres.find((g) => g.id === categoryId);
        const theme = themes.find((t) => t.id === categoryId);

        if (genre) {
          // Aplicar apenas o gênero selecionado
          newFilters.genre = [categoryId];

        } else if (theme) {
          // Aplicar apenas o tema selecionado
          newFilters.theme = [categoryId];

        } else {
          // Se não é nem gênero nem tema, manter filtros vazios
          console.log(
     
          );
        }
      }

      // Limpar a pesquisa também
      if (onClearSearch) {

        onClearSearch();
      }

      // Verificar se os filtros realmente mudaram antes de chamar o callback
      if (JSON.stringify(currentFilters) !== JSON.stringify(newFilters)) {
        
        onFiltersChange(newFilters);
      }

      return;
    }

    // Fallback para navegação (comportamento antigo)
    const buildProductsUrl = (filters: Record<string, string[]>) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params.append(key, values.join(","));
        }
      });

      const queryString = params.toString();
      return queryString ? `/produtos?${queryString}` : "/produtos";
    };

    // Navegar para produtos com filtros aplicados
    const updatedFilters = { ...currentFilters };

    if (categoryId === "all") {
      delete updatedFilters.genre;
      delete updatedFilters.theme;
    } else {
      const genre = genres.find((g) => g.id === categoryId);
      const theme = themes.find((t) => t.id === categoryId);

      if (genre) {
        delete updatedFilters.theme;
        updatedFilters.genre = [categoryId];
      } else if (theme) {
        delete updatedFilters.genre;
        updatedFilters.theme = [categoryId];
      } else {
        delete updatedFilters.genre;
        delete updatedFilters.theme;
      }
    }

    const productsUrl = buildProductsUrl(updatedFilters);
    navigate(productsUrl);
  };

  const handleFavoritesClick = () => {
    navigate("/favoritos");
  };

  const handleDropdownToggle = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  return (
    <div className="hidden md:block bg-[#211C49] border-t border-gray-600 font-vt323 text-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Menu de navegação */}
          <div className="flex items-center flex-1">
            <div className="flex items-center space-x-8">
              {categories.map((category) => (
                <div key={category.id} className="relative flex items-center">
                    {category.id === "all" && (
                      <Menu className="h-4 w-4 text-white mr-1" />
                    )}
                  <button
                    onClick={() => {
                      if (category.id === "all") {
                        
                        handleCategoryClick(category.id);
                      } else {
                        handleDropdownToggle(category.id);
                      }
                    }}
                    className={`flex items-center space-x-1 text-white hover:text-purple-200 transition-colors ${
                      currentActiveCategory === category.id
                        ? "text-purple-200"
                        : ""
                    }`}
                  >
                    <span>{category.label}</span>
                    {category.id !== "all" && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Dropdown para categorias com submenu */}
                  {openDropdown === category.id && category.id !== "all" && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 font-vt323 max-h-64 overflow-y-auto">
                      {category.id === "generos" && (
                        <>
                          {loading ? (
                            <div className="flex items-center justify-center px-4 py-2 text-sm text-gray-500">
                              Carregando...
                            </div>
                          ) : error ? (
                            <div className="flex items-center justify-center px-4 py-2 text-sm text-red-500">
                              Erro ao carregar gêneros
                            </div>
                          ) : (
                            genres.map((genre) => (
                              <button
                                key={genre.id}
                                onClick={() => handleCategoryClick(genre.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {genre.name}
                              </button>
                            ))
                          )}
                        </>
                      )}
                      {category.id === "tematicas" && (
                        <>
                          {loading ? (
                            <div className="flex items-center justify-center px-4 py-2 text-sm text-gray-500">
                              Carregando...
                            </div>
                          ) : error ? (
                            <div className="flex items-center justify-center px-4 py-2 text-sm text-red-500">
                              Erro ao carregar temáticas
                            </div>
                          ) : (
                            themes.map((theme) => (
                              <button
                                key={theme.id}
                                onClick={() => handleCategoryClick(theme.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {theme.name}
                              </button>
                            ))
                          )}
                        </>
                      )}
                      {category.id === "sobre" && (
                        <>
                          <button
                            onClick={() => handleCategoryClick("quem-somos")}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Quem Somos
                          </button>
                          <button
                            onClick={() => handleCategoryClick("contato")}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Contato
                          </button>
                          <button
                            onClick={() => handleCategoryClick("ajuda")}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Ajuda
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botão Favoritos */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFavoritesClick}
              className="text-white hover:text-purple-200 transition-colors"
            >
              Favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTopBar;
