import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Genre {
  id: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
}

interface FilterTopBarProps {
  onCategoryClick?: (category: string) => void;
  onFavoritesClick?: () => void;
  activeCategory?: string;
  genres?: Genre[];
  themes?: Theme[];
  loading?: boolean;
}

const FilterTopBar: React.FC<FilterTopBarProps> = ({
  onCategoryClick,
  onFavoritesClick,
  activeCategory = "all",
  genres = [],
  themes = [],
  loading = false,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Gêneros mockados como fallback
  const mockGenres: Genre[] = [
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
  ];

  // Temas mockados como fallback
  const mockThemes: Theme[] = [
    { id: "fantasia", name: "Fantasia" },
    { id: "futurista", name: "Futurista" },
    { id: "historico", name: "Histórico" },
    { id: "medieval", name: "Medieval" },
    { id: "espacial", name: "Espacial" },
  ];

  // Usar dados do backend se disponíveis, senão usar mockados
  const displayGenres = genres.length > 0 ? genres : mockGenres;
  const displayThemes = themes.length > 0 ? themes : mockThemes;

  const categories = [
    { id: "all", label: "All" },
    { id: "generos", label: "Gêneros" },
    { id: "tematicas", label: "Temáticas" },
    { id: "sobre", label: "Sobre" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick?.(categoryId);
    setOpenDropdown(null);
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
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 font-vt323">
                      {category.id === "generos" && (
                        <>
                          {loading ? (
                            <div className="flex items-center justify-center px-4 py-2 text-sm text-gray-500">
                              Carregando...
                            </div>
                          ) : (
                            displayGenres.map((genre) => (
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
                          ) : (
                            displayThemes.map((theme) => (
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
