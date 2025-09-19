import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";

interface TopBarProps {
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  logoPosition?: "left" | "center" | "right";
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  showUserMenu?: boolean;
  userName?: string;
  userAvatar?: string;
  onFavoritesClick?: () => void;
  onProfileClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  rightButtonText = "",
  onRightButtonClick,
  logoPosition = "left",
  showSearchBar = false,
  searchPlaceholder = "Buscar...",
  showUserMenu = false,
  userName = "Usuário",
  userAvatar = "",
}) => {
  const [showSecondaryHeader, setShowSecondaryHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  let justifyLogo: string;
  switch (logoPosition) {
    case "center":
      justifyLogo = "justify-center";
      break;
    case "right":
      justifyLogo = "justify-end";
      break;
    default:
      justifyLogo = "justify-start ml-10";
  }

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Efeito para controlar a visibilidade da barra de pesquisa ao rolar
  useEffect(() => {
    const controlNavbar = () => {
      // Se rolar para baixo e passar de 100px, esconde a barra
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowSecondaryHeader(false);
      } else if (window.scrollY < lastScrollY && window.scrollY < 50) { // Se rolar para cima, mostra a barra
        setShowSecondaryHeader(true);
      }
      // Atualiza a última posição de scroll
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    // Limpa o evento ao desmontar o componente para evitar vazamento de memória
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);


  return (
    
    <header className="sticky top-0 z-50 w-full">
      
      <div className="w-full bg-[#211C49] flex items-center justify-between px-2 sm:px-14 py-3 relative z-10">
       
        <div className="hidden md:flex w-full items-center justify-between">
          
          <div className={`flex items-center gap-2 ${justifyLogo}`}>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="focus:outline-none"
              aria-label="Ir para Home"
            >
              <img src="../public/logo.svg" alt="Logo" className="h-8 min-w-32" />
            </button>
          </div>
          
          {/* Barra de pesquisa - Desktop*/}
          {showSearchBar && (
            <div className={`flex-1 mx-4 ease-in-out overflow-hidden max-w-2xl opacity-100}`}>
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="flex rounded-full overflow-hidden w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-purple-300 flex items-center justify-center px-6"
                    >
                      <Search className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </form>
            </div>
          )}

         
          <div className="flex-none flex items-center space-x-4">
            {rightButtonText && (
              <button
                type="button"
                onClick={onRightButtonClick}
                className="text-white text-xs px-4 py-2"
              >
                {rightButtonText}
              </button>
            )}
            {showUserMenu && (
              <div className="flex items-center space-x-3 pr-6">
                <span className="text-white text-base font-normal text-sm">
                  {userName}
                </span>
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Layout Mobile*/}
        <div className="md:hidden w-full flex items-center justify-between ">
            <button
              type="button"
              className="p-2 text-gray-300 hover:text-white transition-colors pl-0"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-start justify-start flex-1">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="focus:outline-none flex items-start gap-2"
                aria-label="Ir para Home"
              >
                <img src="../public/logo.svg" alt="Logo" className="h-6" />
              </button>
            </div>
            <div className="flex items-center gap-2 ">
              <span className="text-gray-300 text-sm">Perfil</span>
              <img
                src={
                  userAvatar || "https://placehold.co/32x32/4F46E5/FFFFFF?text=U"
                }
                alt={userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
        </div>
      </div>

      {/* Barra de Pesquisa - MOBILE */}
      {showSearchBar && (
        <div 
          className={`md:hidden w-full bg-[#211C49] transition-all duration-500 ease-in-out overflow-hidden ${showSecondaryHeader ? 'max-h-40 pb-3' : 'max-h-0'}`}
        >
          <div className="px-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center w-full bg-gray-100 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisa na Toca do Cartucho"
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#B5B6E4] flex items-center justify-center px-4 py-4"
                >
                  <Search className="h-5 w-5 text-[#1D1B20]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;

