import React from "react";
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
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPriceChange(value, maxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPriceChange(minPrice, value);
  };

  const handleApplyFilter = () => {
    // O filtro é aplicado automaticamente quando os valores mudam
    // Este botão serve apenas como feedback visual
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
          value={minPrice}
          onChange={handleMinPriceChange}
          placeholder="Min."
          className="flex-1 px-3 py-2 max-w-20 text-sm border-0 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
        />

        {/* Input Preço Máximo */}
        <input
          id={`${sectionId}-max-price`}
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          placeholder="Máx."
          className="flex-1 px-3 py-2 max-w-20 text-sm border-0 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
        />

        {/* Botão de Aplicar */}
        <button
          onClick={handleApplyFilter}
          className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center shadow-sm hover:bg-purple-500 transition-colors"
          title="Aplicar filtro de preço"
        >
          <Search className="w-4 h-4 text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default PriceFilterGroup;
