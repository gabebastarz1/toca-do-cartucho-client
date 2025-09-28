import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";


export interface OrderingOption {
  value: string;
  label: string;
}

interface OrderingSelectorProps {
  currentOrdering?: OrderingOption;
  onOrderingChange?: (ordering: OrderingOption) => void;
}

const OrderingSelector: React.FC<OrderingSelectorProps> = ({
  currentOrdering,
  onOrderingChange,
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Opções de ordenação usando valores corretos da API
  const orderingOptions: OrderingOption[] = [
    {
      value: "PriceAscending",
      label: "Menor Preço",
    },
    {
      value: "PriceDescending",
      label: "Maior Preço",
    },
    {
      value: "Newest",
      label: "Mais Novo",
    },
    {
      value: "Oldest",
      label: "Mais Antigo",
    },
  ];

  const handleOptionClick = (option: OrderingOption) => {
    onOrderingChange?.(option);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Renderização para Desktop (Dropdown)
  if (!isMobile) {
    return (
      <div className="relative">
        <button
          onClick={handleToggle}
          className="flex items-center gap-1 px-2 py-1"
        >
          <span className="text-sm text-gray-600">
            {currentOrdering?.label || "Ordenar por"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div className="fixed inset-0 z-10" onClick={handleClose} />

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {orderingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentOrdering?.value === option.value
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Renderização para Mobile (Sidebar)
  return (
    <>
      {/* Botão para abrir sidebar */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-1"
      >
        <span className="text-sm font-normal text-gray-700">
          {"Ordenar"}
        </span>
        <img src="../public/fi-rr-apps-sort.svg"  />
      </button>

      {/* Sidebar Mobile */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleClose}
          />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-100 bg-[#F4F3F5] shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-3 pt-14 pl-5 border-b border-gray-200">
              <h2 className="text-md font-normal c">
                Ordenar por
              </h2>
            </div>

            {/* Options */}
            <div className="p-3">
              {orderingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full px-4 py-2 text-left text-sm  border-b border-gray-200 ${
                    currentOrdering?.value === option.value
                      ? "bg-[#EDECF7] text-[#4F43AE] font-medium"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderingSelector;
