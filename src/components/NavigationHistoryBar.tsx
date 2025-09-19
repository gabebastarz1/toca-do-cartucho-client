import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationHistoryBarProps {
  data?: {
    breadcrumbs: string[];
  };
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
        {data.breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span
              className={
                index === data.breadcrumbs.length - 1
                  ? "font-semibold text-blue-700"
                  : "mr-2 hover:text-gray-800 cursor-pointer transition-colors"
              }
            >
              {crumb}
            </span>
            {index < data.breadcrumbs.length - 1 && (
              <span className="mx-1 text-gray-400">›</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: Mostrar breadcrumbs responsivos */}
      <div className="flex md:hidden items-center w-full">
        {/* Botão de voltar */}
        <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-2">
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
                <span
                  className={
                    isLast
                      ? "font-semibold text-blue-700 truncate"
                      : "text-gray-600 hover:text-gray-800 cursor-pointer transition-colors truncate"
                  }
                >
                  {crumb}
                </span>
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
