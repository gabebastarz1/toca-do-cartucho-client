import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

interface NavigationHistoryBarProps {
  data?: {
    breadcrumbs: string[];
    breadcrumbData?: Array<{
      text: string;
      type:
        | "genre"
        | "theme"
        | "preservation"
        | "cartridgeType"
        | "game"
        | "back"
        | "platform";
      id?: string | number;
    }>;
  };
  onBreadcrumbClick?: (index: number, breadcrumb: string) => void;
}

const NavigationHistoryBar: React.FC<NavigationHistoryBarProps> = ({
  data = {
    breadcrumbs: [
      "Voltar",
      "Plataforma",
      "Ação",
      "Usado",
      "Repro",
      "Super Mario World",
    ],
  },
  onBreadcrumbClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Função para lidar com clique em breadcrumb
  const handleBreadcrumbClick = (index: number, breadcrumb: string) => {
    if (onBreadcrumbClick) {
      onBreadcrumbClick(index, breadcrumb);
      return;
    }

    // Se temos dados estruturados, usar eles para navegação mais precisa
    if (data.breadcrumbData && data.breadcrumbData[index]) {
      const breadcrumbInfo = data.breadcrumbData[index];

      switch (breadcrumbInfo.type) {
        case "back":
          navigate(-1);
          break;
        case "platform":
          navigate("/produtos");
          break;
        case "genre":
          if (breadcrumbInfo.id) {
            navigate(`/produtos?genre=${breadcrumbInfo.id}`);
          } else {
            navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
          }
          break;
        case "theme":
          if (breadcrumbInfo.id) {
            navigate(`/produtos?theme=${breadcrumbInfo.id}`);
          } else {
            navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
          }
          break;
        case "preservation":
          if (breadcrumbInfo.id) {
            navigate(`/produtos?preservation=${breadcrumbInfo.id}`);
          } else {
            navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
          }
          break;
        case "cartridgeType":
          if (breadcrumbInfo.id) {
            navigate(`/produtos?cartridgeType=${breadcrumbInfo.id}`);
          } else {
            navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
          }
          break;
        case "game":
          // Para jogos, fazer pesquisa pelo nome
          navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
          break;
        default:
          navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
          break;
      }
      return;
    }

    switch (index) {
      case 0: // "Voltar"
        navigate(-1);
        break;
      case 1: // "Plataforma" ou categoria principal
        navigate("/produtos");
        break;
      case 2: // Gênero
        // Navegar para produtos com filtro de gênero
        navigate(`/produtos?genre=${breadcrumb.toLowerCase()}`);
        break;
      case 3: // Estado de preservação
        navigate(`/produtos?preservation=${breadcrumb.toLowerCase()}`);
        break;
      case 4: // Tipo de cartucho
        navigate(`/produtos?cartridgeType=${breadcrumb.toLowerCase()}`);
        break;
      default:
        // Para outros breadcrumbs, navegar para produtos com filtro genérico
        navigate(`/produtos?search=${encodeURIComponent(breadcrumb)}`);
        break;
    }
  };

  // Função para lidar com clique no botão "Voltar" mobile
  const handleBackClick = () => {
    navigate(-1);
  };

  // Função para lidar com clique no ícone Home
  const handleHomeClick = () => {
    navigate("/");
  };

  // Para telas pequenas, mostrar apenas os últimos 2 itens por padrão
  const getVisibleBreadcrumbs = () => {
    if (isExpanded || data.breadcrumbs.length <= 3) {
      return data.breadcrumbs;
    }
    return data.breadcrumbs.slice(-2);
  };

  const visibleBreadcrumbs = getVisibleBreadcrumbs();
  const hasHiddenItems = data.breadcrumbs.length > 3 && !isExpanded;

  return (
    <nav className="flex items-center text-sm text-gray-600 p-4 border-b border-gray-200">
      {/* Desktop: Mostrar todos os breadcrumbs */}
      <div className="hidden md:flex items-center">
        {/* Ícone Home */}
        <button
          onClick={handleHomeClick}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-2"
          title="Ir para Home"
        >
          <Home className="h-4 w-4" />
        </button>
        <span className="mx-1 text-gray-400">›</span>

        {data.breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => handleBreadcrumbClick(index, crumb)}
              className={
                index === data.breadcrumbs.length - 1
                  ? "font-semibold text-blue-700 cursor-default"
                  : "mr-2 hover:text-blue-600 cursor-pointer transition-colors hover:underline"
              }
              disabled={index === data.breadcrumbs.length - 1}
            >
              {crumb}
            </button>
            {index < data.breadcrumbs.length - 1 && (
              <span className="mx-1 text-gray-400">›</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: Mostrar breadcrumbs responsivos */}
      <div className="flex md:hidden items-center w-full">
        {/* Botão de voltar */}
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        {/* Separador */}
        <span className="mx-2 text-gray-400">›</span>

        {/* Breadcrumbs visíveis */}
        <div className="flex items-center flex-1 min-w-0">
          {hasHiddenItems && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mr-2"
              >
                <span className="text-sm">...</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </button>
              <span className="mx-1 text-gray-400">›</span>
            </>
          )}

          {visibleBreadcrumbs.map((crumb) => {
            const originalIndex = data.breadcrumbs.indexOf(crumb);
            const isLast = originalIndex === data.breadcrumbs.length - 1;

            return (
              <React.Fragment key={originalIndex}>
                <button
                  onClick={() => handleBreadcrumbClick(originalIndex, crumb)}
                  disabled={isLast}
                  className={
                    isLast
                      ? "font-semibold text-blue-700 truncate cursor-default"
                      : "text-gray-600 hover:text-blue-600 cursor-pointer transition-colors truncate hover:underline"
                  }
                >
                  {crumb}
                </button>
                {!isLast && (
                  <span className="mx-1 text-gray-400 flex-shrink-0">›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Botão de expandir/recolher para mobile */}
      {data.breadcrumbs.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={isExpanded ? "Recolher" : "Expandir"}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
    </nav>
  );
};

export default NavigationHistoryBar;
