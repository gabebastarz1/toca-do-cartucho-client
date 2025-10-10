import React, { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";

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
  // Estados locais para os valores temporários
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Sincronizar estados locais quando props mudarem
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMinPrice(value);
    validatePrices(value, localMaxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMaxPrice(value);
    validatePrices(localMinPrice, value);
  };

  const validatePrices = (min: string, max: string) => {
    const minValue = parseFloat(min);
    const maxValue = parseFloat(max);

    if (min && max && !isNaN(minValue) && !isNaN(maxValue)) {
      if (minValue > maxValue) {
        setErrorMessage("Valor mínimo não pode ser maior que o máximo");
      } else {
        setErrorMessage("");
      }
    } else {
      setErrorMessage("");
    }
  };

  const handleApplyFilter = () => {
    // Validar antes de aplicar
    const minValue = parseFloat(localMinPrice);
    const maxValue = parseFloat(localMaxPrice);

    if (
      localMinPrice &&
      localMaxPrice &&
      !isNaN(minValue) &&
      !isNaN(maxValue)
    ) {
      if (minValue > maxValue) {
        setErrorMessage("Valor mínimo não pode ser maior que o máximo");
        return;
      }
    }

    // Aplicar o filtro apenas se não houver erro
    if (!errorMessage) {
      onPriceChange(localMinPrice, localMaxPrice);
      setErrorMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilter();
    }
  };

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
          className={`flex-1 px-3 py-2 max-w-20 text-sm border-0 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            errorMessage ? "ring-2 ring-red-500" : ""
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
          className={`flex-1 px-3 py-2 max-w-20 text-sm border-0 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            errorMessage ? "ring-2 ring-red-500" : ""
          }`}
        />

        {/* Botão de Aplicar */}
        <button
          onClick={handleApplyFilter}
          disabled={!!errorMessage}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
            errorMessage
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-400 hover:bg-purple-500"
          }`}
          title={
            errorMessage
              ? "Corrija os valores antes de aplicar"
              : "Aplicar filtro de preço"
          }
        >
          <Search
            className={`w-4 h-4 ${
              errorMessage ? "text-gray-500" : "text-gray-800"
            }`}
          />
        </button>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PriceFilterGroup;
