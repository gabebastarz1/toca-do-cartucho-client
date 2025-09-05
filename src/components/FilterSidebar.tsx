import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useCategories } from "./CategoryDataProvider";

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
  loading?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFiltersChange,
  loading = false,
}) => {
  const { genres, themes, loading: categoriesLoading } = useCategories();

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
      options: themes.map((theme) => ({
        id: theme.id,
        label: theme.name,
        checked: false,
      })),
      expanded: false,
    },
    genre: {
      id: "genre",
      title: "Gênero",
      options: genres.map((genre) => ({
        id: genre.id,
        label: genre.name,
        checked: false,
      })),
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

  // Atualizar opções de gênero e temática quando os dados mudarem
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        options: themes.map((theme) => ({
          id: theme.id,
          label: theme.name,
          checked:
            prev.theme.options.find((opt) => opt.id === theme.id)?.checked ||
            false,
        })),
      },
      genre: {
        ...prev.genre,
        options: genres.map((genre) => ({
          id: genre.id,
          label: genre.name,
          checked:
            prev.genre.options.find((opt) => opt.id === genre.id)?.checked ||
            false,
        })),
      },
    }));
  }, [genres, themes]);

  // Notificar mudanças de filtros
  useEffect(() => {
    const getActiveFilters = () => {
      const activeFilters: Record<string, string[]> = {};

      Object.values(filters).forEach((section) => {
        if (section.id === "price") {
          if (priceRange.min || priceRange.max) {
            activeFilters.price = [priceRange.min, priceRange.max];
          }
        } else {
          const checkedOptions = section.options
            .filter((option) => option.checked)
            .map((option) => option.id);
          if (checkedOptions.length > 0) {
            activeFilters[section.id] = checkedOptions;
          }
        }
      });

      return activeFilters;
    };

    onFiltersChange?.(getActiveFilters());
  }, [filters, priceRange, onFiltersChange]);

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

  const clearAllFilters = () => {
    setFilters((prev) => {
      const clearedFilters = { ...prev };
      Object.keys(clearedFilters).forEach((key) => {
        if (key === "price") return;
        clearedFilters[key] = {
          ...clearedFilters[key],
          options: clearedFilters[key].options.map((option) => ({
            ...option,
            checked: false,
          })),
        };
      });
      return clearedFilters;
    });
    setPriceRange({ min: "", max: "" });
  };

  const clearSectionFilters = (sectionId: string) => {
    if (sectionId === "price") {
      setPriceRange({ min: "", max: "" });
    } else {
      setFilters((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          options: prev[sectionId].options.map((option) => ({
            ...option,
            checked: false,
          })),
        },
      }));
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.values(filters).forEach((section) => {
      if (section.id === "price") {
        if (priceRange.min || priceRange.max) count++;
      } else {
        count += section.options.filter((option) => option.checked).length;
      }
    });
    return count;
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
      const hasPriceFilter = priceRange.min || priceRange.max;
      return (
        <div key={section.id} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              {section.title}
            </h3>
            {hasPriceFilter && (
              <button
                onClick={() => clearSectionFilters("price")}
                className="text-red-500 hover:text-red-700 p-1"
                title="Limpar filtro de preço"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
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
          </div>
          {hasPriceFilter && (
            <div className="mt-2 text-xs text-purple-600">
              R$ {priceRange.min || "0"} - R$ {priceRange.max || "∞"}
            </div>
          )}
        </div>
      );
    }

    const hasExpandableOptions = section.options.length > 5;
    const displayOptions =
      hasExpandableOptions && !section.expanded
        ? section.options.slice(0, 5)
        : section.options;

    const activeOptionsCount = section.options.filter(
      (option) => option.checked
    ).length;
    const hasActiveFilters = activeOptionsCount > 0;

    return (
      <div key={section.id} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900">
              {section.title}
            </h3>
            {hasActiveFilters && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {activeOptionsCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {hasActiveFilters && (
              <button
                onClick={() => clearSectionFilters(section.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Limpar filtros desta seção"
              >
                <X className="w-3 h-3" />
              </button>
            )}
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

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900">Filtre por:</h2>
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
            <button
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-700 text-xs font-medium"
              title="Limpar todos os filtros"
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      {loading || categoriesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">Carregando filtros...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.values(filters).map(renderSection)}
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
