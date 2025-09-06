import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface TopBarProps {
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  logoPosition?: "left" | "center" | "right";
  showSearchBar?: boolean;
  onSearch?: (query: string) => void;
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
  onSearch,
  searchPlaceholder = "Buscar...",
  showUserMenu = false,
  userName = "Usuário",
  userAvatar = "",
}) => {
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery("");
    }
  };

  const handleSearchBlur = () => {
    // Delay para permitir clique no botão de submit
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setIsSearchExpanded(false);
      }
    }, 150);
  };

  return (
    <div className="w-full bg-[#211C49] flex items-center justify-between px-4 sm:px-14 py-3">
      {/* Layout Desktop */}
      <div className="hidden md:flex w-full items-center justify-between">
        {/* Logo Desktop */}
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

        {/* Barra de pesquisa - Desktop */}
        {showSearchBar && (
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearchSubmit}>
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

        {/* Menu do usuário e botões - Desktop */}
        <div className="flex-none flex items-center space-x-4">
          {/* Botão do lado direito se necessário */}
          {rightButtonText && (
            <button
              type="button"
              onClick={onRightButtonClick}
              className="text-white text-xs px-4 py-2"
            >
              {rightButtonText}
            </button>
          )}

          {/* User Menu - só aparece quando showUserMenu é true */}
          {showUserMenu && (
            <div className="flex items-center space-x-3 pr-6">
              {/* Nome do usuário */}
              <span className="text-white text-base font-normal text-sm">
                {userName}
              </span>

              {/* Foto de perfil */}
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Layout Mobile */}
      <div className="md:hidden flex w-full items-center justify-between">
        {/* Barra de pesquisa expandida - Mobile (ocupa toda a largura) */}
        {showSearchBar && isSearchExpanded ? (
          <div className="bg-[#211C49] w-full px-4 py-1 z-30 duration-200 ease-in-out ">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center w-full">
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="p-2 text-white  rounded-full transition-colors mr-2"
                  aria-label="Fechar pesquisa"
                >
                  <Search className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={handleSearchBlur}
                  placeholder={searchPlaceholder}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none rounded-full"
                  autoFocus
                />
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Barra de pesquisa colapsada - Mobile (esquerda) */}
            {showSearchBar && (
              <div className="relative z-20">
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="p-2 text-white rounded-full  transition-colors"
                  aria-label="Abrir pesquisa"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Logo Mobile (centro) */}
            <div className="flex items-center justify-center flex-1">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="focus:outline-none"
                aria-label="Ir para Home"
              >
                <img
                  src="../public/logo.svg"
                  alt="Logo"
                  className="h-8 min-w-32"
                />
              </button>
            </div>

            {/* Menu do usuário - Mobile (direita) */}
            <div className="flex items-center space-x-2">
              {/* Botão do lado direito se necessário */}
              {rightButtonText && (
                <button
                  type="button"
                  onClick={onRightButtonClick}
                  className="text-white text-xs px-2 py-2"
                >
                  {rightButtonText}
                </button>
              )}

              {/* User Menu - só aparece quando showUserMenu é true */}
              {showUserMenu && (
                <div className="flex items-center">
                  {/* Foto de perfil - apenas no mobile */}
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;

// ---Como importar---
/*
<TopBar 
  rightButtonText="Meus Anúncios" 
  onRightButtonClick={() => navigate("/meus-anuncios")}
  logoPosition="center" // ou "left" ou "right"
  showSearchBar={true} // mostra a barra de pesquisa
  onSearch={(query) => console.log("Buscar:", query)}
  searchPlaceholder="Pesquisar produtos..."
  showUserMenu={true} // mostra o menu do usuário
  userName="João Silva"
  onFavoritesClick={() => navigate("/favoritos")}
  onProfileClick={() => navigate("/perfil")}
/>
*/
