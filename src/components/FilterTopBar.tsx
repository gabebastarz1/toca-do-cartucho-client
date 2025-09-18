import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCategories } from "./CategoryDataProvider";

interface FilterTopBarProps {
  onCategoryClick?: (category: string) => void;
  onFavoritesClick?: () => void;
  activeCategory?: string;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  currentFilters?: Record<string, string[]>; // Para manter filtros da sidebar
}

const FilterTopBar: React.FC<FilterTopBarProps> = ({
  onCategoryClick,
  onFavoritesClick,
  activeCategory = "all",
  onFilterChange,
  currentFilters = {},
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Usar dados do CategoryDataProvider
  const { genres, themes, loading, error } = useCategories();

  const categories = [
    { id: "all", label: "All" },
    { id: "generos", label: "Gêneros" },
    { id: "tematicas", label: "Temáticas" },
    { id: "sobre", label: "Sobre" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick?.(categoryId);
    setOpenDropdown(null);

    // Aplicar filtros baseados na categoria selecionada
    if (onFilterChange) {
      // Manter filtros da sidebar (exceto genre/theme que são controlados pela topbar)
      const sidebarFilters = { ...currentFilters };

      if (categoryId === "all") {
        // Limpar apenas filtros de categoria da topbar, manter outros
        delete sidebarFilters.genre;
        delete sidebarFilters.theme;
        onFilterChange(sidebarFilters);
      } else {
        // Verificar se é um gênero ou tema específico
        const genre = genres.find((g) => g.id === categoryId);
        const theme = themes.find((t) => t.id === categoryId);

        if (genre) {
          // Limpar tema anterior e aplicar novo gênero
          delete sidebarFilters.theme;
          sidebarFilters.genre = [categoryId];
          onFilterChange(sidebarFilters);
        } else if (theme) {
          // Limpar gênero anterior e aplicar novo tema
          delete sidebarFilters.genre;
          sidebarFilters.theme = [categoryId];
          onFilterChange(sidebarFilters);
        } else {
          // Para outras categorias (quem-somos, contato, ajuda), limpar apenas categoria
          delete sidebarFilters.genre;
          delete sidebarFilters.theme;
          onFilterChange(sidebarFilters);
        }
      }
    }
  };

  const handleDropdownToggle = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  return (
    <div className="bg-[#211C49] border-t border-gray-600 font-vt323 text-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Menu de navegação */}
          <div className="flex items-center flex-1">
            <div className="flex items-center space-x-8">
              {categories.map((category) => (
                <div key={category.id} className="relative">
                  <button
                    onClick={() => {
                      if (category.id === "all") {
                        handleCategoryClick(category.id);
                      } else {
                        handleDropdownToggle(category.id);
                      }
                    }}
                    className={`flex items-center space-x-1 text-white hover:text-purple-200 transition-colors ${
                      activeCategory === category.id ? "text-purple-200" : ""
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
              onClick={onFavoritesClick}
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
