import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Heart, ChevronDown } from "lucide-react";

interface TopBarProps {
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  logoPosition?: "left" | "center" | "right";
  showSearchBar?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showUserMenu?: boolean;
  userName?: string;
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
  onFavoritesClick,
  onProfileClick,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="w-full bg-[#211C49] flex items-center justify-between px-14 py-3 ">
      <div className={`flex items-center gap-2 ${justifyLogo}`}>
        {/* Logo como botão */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="focus:outline-none"
          aria-label="Ir para Home"
        >
          <img src="../public/logo.svg" alt="Logo" className="h-8" />
        </button>
      </div>

      {/* Barra de pesquisa centralizada - só aparece quando showSearchBar é true */}
      {showSearchBar && (
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex rounded-full overflow-hidden">
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
        {/* Botão do lado direito se necessário) */}
        {rightButtonText && (
          <button
            type="button"
            onClick={onRightButtonClick}
            className="text-white text-xs px-4 py-2"
          >
            {rightButtonText}
          </button>
        )}

        {/* userMenu - só aparece quando showUserMenu é true */}
        {showUserMenu && (
          <div className="flex items-center  space-x-3 pr-6">
            {/* Nome do usuário */}
            <span className="text-white text-base font-normal text-sm">{userName}</span>

            {/* Foto de perfil */}
            <img
              src={userAvatar} // passe a URL da foto do usuário
              alt={userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
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
