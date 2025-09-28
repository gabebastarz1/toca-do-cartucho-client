import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`flex items-center p-3 text-sm font-medium rounded-lg ${
          currentPage === 1 || loading
            ? " text-gray-400  cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        
      </button>

      {/* Números das páginas */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-sm text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              disabled={loading}
              className={`px-3 py-1 text-sm font-medium rounded-lg ${
                isCurrentPage
                  ? "bg-[#4F43AE] text-white border-[#4F43AE]"
                  : loading
                  ? " text-gray-400  cursor-not-allowed"
                  : " text-gray-700  hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`flex items-center p-3 text-sm font-medium rounded-lg  ${
          currentPage === totalPages || loading
            ? " text-gray-400  cursor-not-allowed"
            : " text-gray-700  hover:bg-gray-200 hover:text-gray-900"
        }`}
      >
        
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
