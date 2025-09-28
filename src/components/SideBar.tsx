import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useCategories } from "./CategoryDataProvider";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

type SideBarPage = "main" | "genres" | "themes";

const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { genres, themes } = useCategories();
  const [currentPage, setCurrentPage] = useState<SideBarPage>("main");

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleCategoryNavigation = (categoryId: string, categoryType: "genre" | "theme") => {
    // Aplicar filtro e navegar para produtos
    const filters: Record<string, string[]> = {};
    
    if (categoryType === "genre") {
      filters.genre = [categoryId];
    } else if (categoryType === "theme") {
      filters.theme = [categoryId];
    }

    // Construir URL com filtros
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.append(key, values.join(","));
      }
    });

    const queryString = params.toString();
    const productsUrl = queryString ? `/produtos?${queryString}` : "/produtos";
    
    navigate(productsUrl);
    onClose();
  };

  const handleBackToMain = () => {
    setCurrentPage("main");
  };

  const handleOpenGenres = () => {
    setCurrentPage("genres");
  };

  const handleOpenThemes = () => {
    setCurrentPage("themes");
  };

  // Reset para página principal quando o SideBar for fechado
  useEffect(() => {
    if (!isOpen) {
      setCurrentPage("main");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-full bg-[#f4f3f5] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#211c49] py-3 pt-4 px-[22px]">
          <div className="items-center gap-3 pt-2">
            <ChevronLeft 
              className="w-5 h-5 text-white cursor-pointer" 
              onClick={currentPage === "main" ? onClose : handleBackToMain} 
            />
            <div className="text-white text-sm font-normal pt-4">
              {currentPage === "main" 
                ? `Olá, ${user?.firstName || user?.nickName || "Usuário"}`
                : currentPage === "genres" 
                  ? "Gêneros"
                  : "Temáticas"
              }
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-[22px] py-4 space-y-6">
          {currentPage === "main" && (
            <>
              {/* Destaques */}
              <div>
                <h2 className="text-[#0e0b0e] text-md font-semibold mb-3">
                  Destaques
                </h2>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleNavigation("/mais-vendidos")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Mais Vendidos
                  </button>
                  <button
                    onClick={() => handleNavigation("/novidades")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Novidades na Toca do Cartucho
                  </button>
                  <button
                    onClick={() => handleNavigation("/produtos-em-alta")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Produtos em Alta
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Venda na Toca do Cartucho */}
              <div>
                <h2 className="text-[#0e0b0e] text-md font-semibold mb-3">
                  Venda na Toca do Cartucho
                </h2>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleNavigation("/minhas-vendas")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Minhas vendas
                  </button>
                  <button
                    onClick={() => handleNavigation("/criar-anuncio")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Novo Anúncio
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Compre por Categoria */}
              <div>
                <h2 className="text-[#0e0b0e] text-md font-semibold mb-3">
                  Compre por Categoria
                </h2>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleOpenGenres}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Gêneros
                  </button>
                  <button
                    onClick={handleOpenThemes}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Temáticas
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Ajuda e Configurações */}
              <div>
                <h2 className="text-[#0e0b0e] text-md font-semibold mb-3">
                  Ajuda e Configurações
                </h2>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleNavigation("/conta")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Sua Conta
                  </button>
                  <button
                    onClick={() => handleNavigation("/ajuda")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors"
                  >
                    Ajuda
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-[#0e0b0e] text-sm text-left hover:text-red-600 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}

          {currentPage === "genres" && (
            <div>
              <div className="flex flex-col space-y-3">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleCategoryNavigation(genre.id.toString(), "genre")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors py-2"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentPage === "themes" && (
            <div>
              <div className="flex flex-col space-y-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleCategoryNavigation(theme.id.toString(), "theme")}
                    className="text-[#0e0b0e] text-sm text-left hover:text-purple-600 transition-colors py-2"
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
