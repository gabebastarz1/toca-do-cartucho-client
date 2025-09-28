import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface PriceFilterGroupProps {
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  sectionId: string;
}

const PriceFilterGroup: React.FC<PriceFilterGroupProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  sectionId,
}) => {
  // Estado local para os inputs (não aplica automaticamente)
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Sincronizar estado local quando props mudam externamente
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value);
  };

  const handleApplyFilter = () => {
    // Aplicar filtro apenas quando confirmar
    onPriceChange(localMinPrice, localMaxPrice);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilter();
    }
  };

  // Validação: verificar se preço mínimo é maior que máximo
  const isInvalidRange = () => {
    const min = parseFloat(localMinPrice);
    const max = parseFloat(localMaxPrice);

    // Só valida se ambos os campos têm valores válidos
    if (
      !isNaN(min) &&
      !isNaN(max) &&
      localMinPrice.trim() !== "" &&
      localMaxPrice.trim() !== ""
    ) {
      return min > max;
    }
    return false;
  };

  const hasValidationError = isInvalidRange();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {/* Input Preço Mínimo */}
        <input
          id={`${sectionId}-min-price`}
          type="number"
          min="0"
          step="0.01"
          value={localMinPrice}
          onChange={handleMinPriceChange}
          onKeyPress={handleKeyPress}
          placeholder="Min."
          className={`flex-1 px-3 py-2 max-w-20 text-sm border-0 rounded-md shadow-sm focus:outline-none transition-all ${
            hasValidationError
              ? "bg-red-50 border-2 border-red-300 text-red-700 focus:ring-2 focus:ring-red-500"
              : "bg-white focus:ring-2 focus:ring-purple-500"
          }`}
        />

        {/* Input Preço Máximo */}
        <input
          id={`${sectionId}-max-price`}
          type="number"
          min="0"
          step="0.01"
          value={localMaxPrice}
          onChange={handleMaxPriceChange}
          onKeyPress={handleKeyPress}
          placeholder="Máx."
          className={`flex-1 px-3 py-2 max-w-20 text-sm border-0 rounded-md shadow-sm focus:outline-none transition-all ${
            hasValidationError
              ? "bg-red-50 border-2 border-red-300 text-red-700 focus:ring-2 focus:ring-red-500"
              : "bg-white focus:ring-2 focus:ring-purple-500"
          }`}
        />

        {/* Botão de Aplicar */}
        <button
          onClick={handleApplyFilter}
          disabled={hasValidationError}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
            hasValidationError
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-400 hover:bg-purple-500"
          }`}
          title={
            hasValidationError
              ? "Corrija os valores antes de aplicar"
              : "Aplicar filtro de preço"
          }
        >
          <Search
            className={`w-4 h-4 ${
              hasValidationError ? "text-gray-500" : "text-gray-800"
            }`}
          />
        </button>
      </div>

      {/* Aviso de erro */}
      {hasValidationError && (
        <div className="text-xs text-red-600  rounded-md px-2 py-1">
          O preço mínimo não pode ser maior que o máximo
        </div>
      )}
    </div>
  );
};

export default PriceFilterGroup;
