import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  expanded?: boolean;
}

interface FilterSidebarProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<Record<string, FilterSection>>({
    conditions: {
      id: "conditions",
      title: "Condições:",
      options: [
        { id: "sale-only", label: "Somente Venda", checked: false },
        { id: "trade-only", label: "Somente Troca", checked: false },
        { id: "sale-trade", label: "Venda e Troca", checked: false },
      ],
    },
    preservation: {
      id: "preservation",
      title: "Estado de Preservação:",
      options: [
        { id: "new", label: "Novo", checked: false },
        { id: "semi-new", label: "Seminovo", checked: false },
        { id: "good", label: "Bom", checked: false },
        { id: "normal", label: "Normal", checked: false },
        { id: "damaged", label: "Danificado", checked: false },
      ],
    },
    cartridgeType: {
      id: "cartridgeType",
      title: "Tipo do Cartucho:",
      options: [
        { id: "retro", label: "Retrô", checked: false },
        { id: "repro", label: "Reprô", checked: false },
      ],
    },
    price: {
      id: "price",
      title: "Preço:",
      options: [],
    },
    theme: {
      id: "theme",
      title: "Temática:",
      options: [
        { id: "action", label: "Ação", checked: false },
        { id: "fantasy", label: "Fantasia", checked: false },
        { id: "sci-fi", label: "Ficção Científica", checked: false },
        { id: "party", label: "Party", checked: false },
      ],
      expanded: false,
    },
    genre: {
      id: "genre",
      title: "Gênero",
      options: [
        { id: "adventure", label: "Aventura", checked: false },
        { id: "arcade", label: "Arcade", checked: false },
        { id: "indie", label: "Indie", checked: false },
        { id: "platform", label: "Plataforma", checked: false },
      ],
      expanded: false,
    },
    gameMode: {
      id: "gameMode",
      title: "Modo de jogo:",
      options: [
        { id: "singleplayer", label: "Singleplayer", checked: false },
        { id: "multiplayer", label: "Multiplayer", checked: false },
      ],
    },
    audioLanguage: {
      id: "audioLanguage",
      title: "Idioma do Audio",
      options: [
        { id: "english", label: "Inglês", checked: false },
        { id: "portuguese", label: "Português", checked: false },
        { id: "japanese", label: "Japonês", checked: false },
      ],
    },
    subtitleLanguage: {
      id: "subtitleLanguage",
      title: "Idioma da Legenda",
      options: [
        { id: "english", label: "Inglês", checked: false },
        { id: "portuguese", label: "Português", checked: false },
        { id: "japanese", label: "Japonês", checked: false },
      ],
    },
    interfaceLanguage: {
      id: "interfaceLanguage",
      title: "Idioma da Interface",
      options: [
        { id: "english", label: "Inglês", checked: false },
        { id: "portuguese", label: "Português", checked: false },
        { id: "japanese", label: "Japonês", checked: false },
      ],
    },
    region: {
      id: "region",
      title: "Região",
      options: [
        { id: "australia", label: "Australia", checked: false },
        { id: "brazil", label: "Brazil", checked: false },
        { id: "europe", label: "Europe", checked: false },
        { id: "north-america", label: "North America", checked: false },
        { id: "korea", label: "Korea", checked: false },
      ],
    },
  });

  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const handleCheckboxChange = (sectionId: string, optionId: string) => {
    setFilters((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        options: prev[sectionId].options.map((option) =>
          option.id === optionId
            ? { ...option, checked: !option.checked }
            : option
        ),
      },
    }));
  };

  const toggleSection = (sectionId: string) => {
    setFilters((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        expanded: !prev[sectionId].expanded,
      },
    }));
  };

  const handlePriceChange = (field: "min" | "max", value: string) => {
    setPriceRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyPriceFilter = () => {
    // Implementar lógica de aplicação do filtro de preço
    console.log("Aplicar filtro de preço:", priceRange);
  };

  const renderCheckbox = (sectionId: string, option: FilterOption) => (
    <div key={option.id} className="flex items-center space-x-2 mb-2">
      <input
        type="checkbox"
        id={`${sectionId}-${option.id}`}
        checked={option.checked}
        onChange={() => handleCheckboxChange(sectionId, option.id)}
        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
      />
      <label
        htmlFor={`${sectionId}-${option.id}`}
        className="text-sm text-gray-700 cursor-pointer"
      >
        {option.label}
      </label>
    </div>
  );

  const renderSection = (section: FilterSection) => {
    if (section.id === "price") {
      return (
        <div key={section.id} className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {section.title}
          </h3>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min."
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Máx."
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={applyPriceFilter}
              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Aplicar
            </button>
          </div>
        </div>
      );
    }

    const hasExpandableOptions = section.options.length > 4;
    const displayOptions =
      hasExpandableOptions && !section.expanded
        ? section.options.slice(0, 4)
        : section.options;

    return (
      <div key={section.id} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
          {hasExpandableOptions && (
            <button
              onClick={() => toggleSection(section.id)}
              className="text-purple-600 hover:text-purple-700"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  section.expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
        <div className="space-y-1">
          {displayOptions.map((option) => renderCheckbox(section.id, option))}
          {hasExpandableOptions && !section.expanded && (
            <button
              onClick={() => toggleSection(section.id)}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              Ver mais
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-sm font-medium text-gray-900 mb-4">Filtre por:</h2>
      <div className="space-y-4">
        {Object.values(filters).map(renderSection)}
      </div>
    </div>
  );
};

export default FilterSidebar;
