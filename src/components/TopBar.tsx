import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import SideBar from "./SideBar";
import UserDropdown from "./UserDropdown";

interface TopBarProps {
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  logoPosition?: "left" | "center" | "right";
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  showUserMenu?: boolean;
  userName?: string; // Opcional - se não fornecido, será obtido do contexto de autenticação
  userAvatar?: string;
  onFavoritesClick?: () => void;
  onProfileClick?: () => void;
  searchValue?: string; // Valor atual da pesquisa
  onSearchChange?: (value: string) => void; // Callback para mudanças na pesquisa
  onSearchConfirm?: () => void; // Callback para confirmar a pesquisa
}

const TopBar: React.FC<TopBarProps> = ({
  rightButtonText = "",
  onRightButtonClick,
  logoPosition = "left",
  showSearchBar = false,
  searchPlaceholder = "Buscar...",
  showUserMenu = false,
  userName,
  userAvatar = "",
  searchValue = "",
  onSearchChange,
  onSearchConfirm,
}) => {
  const { user } = useAuth();
  const [showSecondaryHeader, setShowSecondaryHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Usar o nome do usuário do contexto de autenticação se disponível
  const displayUserName =
    userName ||
    (user
      ? user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.nickName || "Usuário"
      : "Usuário");

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
  const [searchQuery, setSearchQuery] = useState(searchValue);

  // Sincronizar com o valor externo quando mudar
  useEffect(() => {
    setSearchQuery(searchValue);
  }, [searchValue]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchConfirm) {
      // Se há callback de confirmação, usar ele
      onSearchConfirm();
    } else {
      // Fallback para comportamento antigo
      if (searchQuery.trim()) {
        navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        // Se a pesquisa estiver vazia, redirecionar para a página inicial
        navigate("/");
      }
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Notificar o componente pai sobre a mudança
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Efeito para controlar a visibilidade da barra de pesquisa ao rolar
  useEffect(() => {
    const controlNavbar = () => {
      // Se rolar para baixo e passar de 100px, esconde a barra
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowSecondaryHeader(false);
      } else if (window.scrollY < lastScrollY && window.scrollY < 50) {
        // Se rolar para cima, mostra a barra
        setShowSecondaryHeader(true);
      }
      // Atualiza a última posição de scroll
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // Limpa o evento ao desmontar o componente para evitar vazamento de memória
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".user-dropdown-container")) {
          setIsUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserDropdownOpen]);

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
              <img
                src="../public/logo.svg"
                alt="Logo"
                className="h-8 w-auto max-w-32"
              />
            </button>
          </div>

          {/* Barra de pesquisa - Desktop*/}
          {showSearchBar && (
            <div
              className={`flex-1 mx-4 ease-in-out overflow-hidden max-w-2xl opacity-100}`}
            >
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex rounded-full overflow-hidden w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
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
              <div className="flex items-center space-x-3 pr-6 relative user-dropdown-container">
                <span className="text-white text-base font-normal text-sm">
                  {displayUserName}
                </span>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="focus:outline-none"
                >
                  {userAvatar && userAvatar.trim() !== "" ? (
                    <img
                      src={userAvatar}
                      alt={displayUserName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-lg">👤</span>
                    </div>
                  )}
                </button>
                <UserDropdown
                  isOpen={isUserDropdownOpen}
                  onClose={() => setIsUserDropdownOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Layout Mobile*/}
        <div className="md:hidden w-full flex items-center justify-between ">
          <button
            type="button"
            onClick={() => setIsSideBarOpen(true)}
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
          <div className="flex items-center gap-2 relative">
            <span className="text-gray-300 text-sm">{displayUserName}</span>
            <div className="relative user-dropdown-container">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="focus:outline-none"
              >
                {userAvatar && userAvatar.trim() !== "" ? (
                  <img
                    src={userAvatar}
                    alt={displayUserName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                )}
              </button>
              <UserDropdown
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa - MOBILE */}
      {showSearchBar && (
        <div
          className={`md:hidden w-full bg-[#211C49] transition-all duration-500 ease-in-out overflow-hidden ${
            showSecondaryHeader ? "max-h-40 pb-3" : "max-h-0"
          }`}
        >
          <div className="px-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center w-full bg-gray-100 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
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

      {/* SideBar Mobile */}
      <SideBar isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />
    </header>
  );
};

export default TopBar;
