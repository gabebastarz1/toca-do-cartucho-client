import React, { useState, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { useAllCategoryData } from "../components/CategoryDataProvider";
import CustomCheckbox from "./ui/CustomCheckbox";

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
  initialFilters?: Record<string, string[]>;
  initialPriceRange?: { min: string; max: string };
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFiltersChange,
  initialFilters = {},
  initialPriceRange = { min: "", max: "" },
}) => {
  const { genres, themes, gameModes, languages, regions } =
    useAllCategoryData();

  // Função para criar estado inicial dos filtros
  const createInitialFilters = () => ({
    conditions: {
      id: "conditions",
      title: "Condições:",
      options: [
        {
          id: "sale-only",
          label: "Somente Venda",
          checked: initialFilters.conditions?.includes("sale-only") || false,
        },
        {
          id: "trade-only",
          label: "Somente Troca",
          checked: initialFilters.conditions?.includes("trade-only") || false,
        },
        {
          id: "sale-trade",
          label: "Venda e Troca",
          checked: initialFilters.conditions?.includes("sale-trade") || false,
        },
      ],
    },
    preservation: {
      id: "preservation",
      title: "Estado de Preservação:",
      options: [
        {
          id: "new",
          label: "Novo",
          checked: initialFilters.preservation?.includes("new") || false,
        },
        {
          id: "semi-new",
          label: "Seminovo",
          checked: initialFilters.preservation?.includes("semi-new") || false,
        },
        {
          id: "good",
          label: "Bom",
          checked: initialFilters.preservation?.includes("good") || false,
        },
        {
          id: "normal",
          label: "Normal",
          checked: initialFilters.preservation?.includes("normal") || false,
        },
        {
          id: "damaged",
          label: "Danificado",
          checked: initialFilters.preservation?.includes("damaged") || false,
        },
      ],
    },
    cartridgeType: {
      id: "cartridgeType",
      title: "Tipo do Cartucho:",
      options: [
        {
          id: "retro",
          label: "Retrô",
          checked: initialFilters.cartridgeType?.includes("retro") || false,
        },
        {
          id: "repro",
          label: "Reprô",
          checked: initialFilters.cartridgeType?.includes("repro") || false,
        },
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
        checked: initialFilters.theme?.includes(theme.id) || false,
      })),
      expanded: false,
    },
    genre: {
      id: "genre",
      title: "Gênero",
      options: genres.map((genre) => ({
        id: genre.id,
        label: genre.name,
        checked: initialFilters.genre?.includes(genre.id) || false,
      })),
      expanded: false,
    },
    gameMode: {
      id: "gameMode",
      title: "Modo de jogo:",
      options: gameModes.map((gameMode) => ({
        id: gameMode.id,
        label: gameMode.name,
        checked: initialFilters.gameMode?.includes(gameMode.id) || false,
      })),
      expanded: false,
    },
    audioLanguage: {
      id: "audioLanguage",
      title: "Idioma do Audio",
      options: languages.map((language) => ({
        id: language.id,
        label: language.name,
        checked: initialFilters.audioLanguage?.includes(language.id) || false,
      })),
      expanded: false,
    },
    subtitleLanguage: {
      id: "subtitleLanguage",
      title: "Idioma da Legenda",
      options: languages.map((language) => ({
        id: language.id,
        label: language.name,
        checked:
          initialFilters.subtitleLanguage?.includes(language.id) || false,
      })),
      expanded: false,
    },
    interfaceLanguage: {
      id: "interfaceLanguage",
      title: "Idioma da Interface",
      options: languages.map((language) => ({
        id: language.id,
        label: language.name,
        checked:
          initialFilters.interfaceLanguage?.includes(language.id) || false,
      })),
      expanded: false,
    },
    region: {
      id: "region",
      title: "Região",
      options: regions.map((region) => ({
        id: region.id,
        label: region.name,
        checked: initialFilters.region?.includes(region.id) || false,
      })),
      expanded: false,
    },
  });

  const [filters, setFilters] =
    useState<Record<string, FilterSection>>(createInitialFilters);

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [tempPriceRange, setTempPriceRange] = useState(initialPriceRange);

  // Sincronizar com props iniciais quando elas mudarem
  useEffect(() => {
    console.log(
      "Sincronizando FilterSidebar com initialPriceRange:",
      initialPriceRange
    );
    setPriceRange(initialPriceRange);
    setTempPriceRange(initialPriceRange);
  }, [initialPriceRange]);

  useEffect(() => {
    const createInitialFiltersFromProps = () => ({
      conditions: {
        id: "conditions",
        title: "Condições:",
        options: [
          {
            id: "sale-only",
            label: "Somente Venda",
            checked: initialFilters.conditions?.includes("sale-only") || false,
          },
          {
            id: "trade-only",
            label: "Somente Troca",
            checked: initialFilters.conditions?.includes("trade-only") || false,
          },
          {
            id: "sale-trade",
            label: "Venda e Troca",
            checked: initialFilters.conditions?.includes("sale-trade") || false,
          },
        ],
      },
      preservation: {
        id: "preservation",
        title: "Estado de Preservação:",
        options: [
          {
            id: "new",
            label: "Novo",
            checked: initialFilters.preservation?.includes("new") || false,
          },
          {
            id: "semi-new",
            label: "Seminovo",
            checked: initialFilters.preservation?.includes("semi-new") || false,
          },
          {
            id: "good",
            label: "Bom",
            checked: initialFilters.preservation?.includes("good") || false,
          },
          {
            id: "normal",
            label: "Normal",
            checked: initialFilters.preservation?.includes("normal") || false,
          },
          {
            id: "damaged",
            label: "Danificado",
            checked: initialFilters.preservation?.includes("damaged") || false,
          },
        ],
      },
      cartridgeType: {
        id: "cartridgeType",
        title: "Tipo do Cartucho:",
        options: [
          {
            id: "retro",
            label: "Retrô",
            checked: initialFilters.cartridgeType?.includes("retro") || false,
          },
          {
            id: "repro",
            label: "Reprô",
            checked: initialFilters.cartridgeType?.includes("repro") || false,
          },
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
          checked: initialFilters.theme?.includes(theme.id) || false,
        })),
        expanded: false,
      },
      genre: {
        id: "genre",
        title: "Gênero",
        options: genres.map((genre) => ({
          id: genre.id,
          label: genre.name,
          checked: initialFilters.genre?.includes(genre.id) || false,
        })),
        expanded: false,
      },
      gameMode: {
        id: "gameMode",
        title: "Modo de jogo:",
        options: gameModes.map((gameMode) => ({
          id: gameMode.id,
          label: gameMode.name,
          checked: initialFilters.gameMode?.includes(gameMode.id) || false,
        })),
        expanded: false,
      },
      audioLanguage: {
        id: "audioLanguage",
        title: "Idioma do Audio",
        options: languages.map((language) => ({
          id: language.id,
          label: language.name,
          checked: initialFilters.audioLanguage?.includes(language.id) || false,
        })),
        expanded: false,
      },
      subtitleLanguage: {
        id: "subtitleLanguage",
        title: "Idioma da Legenda",
        options: languages.map((language) => ({
          id: language.id,
          label: language.name,
          checked:
            initialFilters.subtitleLanguage?.includes(language.id) || false,
        })),
        expanded: false,
      },
      interfaceLanguage: {
        id: "interfaceLanguage",
        title: "Idioma da Interface",
        options: languages.map((language) => ({
          id: language.id,
          label: language.name,
          checked:
            initialFilters.interfaceLanguage?.includes(language.id) || false,
        })),
        expanded: false,
      },
      region: {
        id: "region",
        title: "Região",
        options: regions.map((region) => ({
          id: region.id,
          label: region.name,
          checked: initialFilters.region?.includes(region.id) || false,
        })),
        expanded: false,
      },
    });

    setFilters(createInitialFiltersFromProps);
    setPriceRange(initialPriceRange);
  }, [
    initialFilters,
    initialPriceRange,
    themes,
    genres,
    gameModes,
    languages,
    regions,
  ]);

  // Atualizar opções de gênero, temática, modos de jogo, idiomas e regiões quando os dados mudarem
  useEffect(() => {
    // Só atualiza se os dados realmente mudaram
    if (
      genres.length === 0 &&
      themes.length === 0 &&
      gameModes.length === 0 &&
      languages.length === 0 &&
      regions.length === 0
    )
      return;

    setFilters((prev) => {
      const newThemeOptions = themes.map((theme) => ({
        id: theme.id,
        label: theme.name,
        checked:
          prev.theme.options.find((opt) => opt.id === theme.id)?.checked ||
          false,
      }));

      const newGenreOptions = genres.map((genre) => ({
        id: genre.id,
        label: genre.name,
        checked:
          prev.genre.options.find((opt) => opt.id === genre.id)?.checked ||
          false,
      }));

      const newGameModeOptions = gameModes.map((gameMode) => ({
        id: gameMode.id,
        label: gameMode.name,
        checked:
          prev.gameMode.options.find((opt) => opt.id === gameMode.id)
            ?.checked || false,
      }));

      const newAudioLanguageOptions = languages.map((language) => ({
        id: language.id,
        label: language.name,
        checked:
          prev.audioLanguage.options.find((opt) => opt.id === language.id)
            ?.checked || false,
      }));

      const newSubtitleLanguageOptions = languages.map((language) => ({
        id: language.id,
        label: language.name,
        checked:
          prev.subtitleLanguage.options.find((opt) => opt.id === language.id)
            ?.checked || false,
      }));

      const newInterfaceLanguageOptions = languages.map((language) => ({
        id: language.id,
        label: language.name,
        checked:
          prev.interfaceLanguage.options.find((opt) => opt.id === language.id)
            ?.checked || false,
      }));

      const newRegionOptions = regions.map((region) => ({
        id: region.id,
        label: region.name,
        checked:
          prev.region.options.find((opt) => opt.id === region.id)?.checked ||
          false,
      }));

      // Verifica se as opções realmente mudaram para evitar re-renderizações desnecessárias
      const themeChanged =
        JSON.stringify(prev.theme.options) !== JSON.stringify(newThemeOptions);
      const genreChanged =
        JSON.stringify(prev.genre.options) !== JSON.stringify(newGenreOptions);
      const gameModeChanged =
        JSON.stringify(prev.gameMode.options) !==
        JSON.stringify(newGameModeOptions);
      const audioLanguageChanged =
        JSON.stringify(prev.audioLanguage.options) !==
        JSON.stringify(newAudioLanguageOptions);
      const subtitleLanguageChanged =
        JSON.stringify(prev.subtitleLanguage.options) !==
        JSON.stringify(newSubtitleLanguageOptions);
      const interfaceLanguageChanged =
        JSON.stringify(prev.interfaceLanguage.options) !==
        JSON.stringify(newInterfaceLanguageOptions);
      const regionChanged =
        JSON.stringify(prev.region.options) !==
        JSON.stringify(newRegionOptions);

      if (
        !themeChanged &&
        !genreChanged &&
        !gameModeChanged &&
        !audioLanguageChanged &&
        !subtitleLanguageChanged &&
        !interfaceLanguageChanged &&
        !regionChanged
      ) {
        return prev;
      }

      return {
        ...prev,
        theme: {
          ...prev.theme,
          options: newThemeOptions,
        },
        genre: {
          ...prev.genre,
          options: newGenreOptions,
        },
        gameMode: {
          ...prev.gameMode,
          options: newGameModeOptions,
        },
        audioLanguage: {
          ...prev.audioLanguage,
          options: newAudioLanguageOptions,
        },
        subtitleLanguage: {
          ...prev.subtitleLanguage,
          options: newSubtitleLanguageOptions,
        },
        interfaceLanguage: {
          ...prev.interfaceLanguage,
          options: newInterfaceLanguageOptions,
        },
        region: {
          ...prev.region,
          options: newRegionOptions,
        },
      };
    });
  }, [genres, themes, gameModes, languages, regions]);

  // Notificar mudanças de filtros
  useEffect(() => {
    if (!onFiltersChange) return;

    const getActiveFilters = () => {
      const activeFilters: Record<string, string[]> = {};

      Object.values(filters).forEach((section) => {
        if (section.id === "price") {
          // Incluir filtro de preço apenas se pelo menos um dos valores estiver preenchido
          if (priceRange.min.trim() || priceRange.max.trim()) {
            activeFilters.price = [
              priceRange.min.trim(),
              priceRange.max.trim(),
            ];
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

    const activeFilters = getActiveFilters();
    console.log("Filtros ativos atualizados:", activeFilters);
    onFiltersChange(activeFilters);
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
    // Permitir apenas números positivos ou string vazia
    const isValidInput =
      value === "" || (!isNaN(Number(value)) && Number(value) >= 0);

    if (isValidInput) {
      setTempPriceRange((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePriceKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      applyPriceFilter();
    }
  };

  const applyPriceFilter = () => {
    // Validar os valores antes de aplicar
    const minValue = tempPriceRange.min ? parseFloat(tempPriceRange.min) : null;
    const maxValue = tempPriceRange.max ? parseFloat(tempPriceRange.max) : null;

    // Verificar se min não é maior que max
    if (minValue && maxValue && minValue > maxValue) {
      alert("O valor mínimo não pode ser maior que o valor máximo.");
      return;
    }

    console.log("Aplicando filtro de preço:", tempPriceRange);
    setPriceRange(tempPriceRange);
  };

  const clearAllFilters = () => {
    console.log("Limpando todos os filtros");
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
    setTempPriceRange({ min: "", max: "" });
  };

  const clearSectionFilters = (sectionId: string) => {
    if (sectionId === "price") {
      console.log("Limpando filtro de preço");
      setPriceRange({ min: "", max: "" });
      setTempPriceRange({ min: "", max: "" });
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
    <div key={option.id} className="mb-2">
      <CustomCheckbox
        id={`${sectionId}-${option.id}`}
        checked={option.checked}
        onChange={() => handleCheckboxChange(sectionId, option.id)}
        label={option.label}
        labelClassName="text-sm text-gray-700"
      />
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
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min."
                value={tempPriceRange.min}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                onKeyPress={handlePriceKeyPress}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Máx."
                value={tempPriceRange.max}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                onKeyPress={handlePriceKeyPress}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={applyPriceFilter}
                className="px-3 py-3 text-xs bg-[#B298F4] text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <Search className="h-4 w-4 text-[#1D1B20]" />
              </button>
            </div>
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
        <div
          className={`space-y-1 ${
            hasExpandableOptions && section.expanded
              ? "max-h-48 overflow-y-auto"
              : ""
          }`}
        >
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
    <div className="w-full lg:w-64 bg-[#F4F3F5] p-4 rounded-lg shadow-sm">
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

      <div className="space-y-4">
        {Object.values(filters).map(renderSection)}
      </div>
    </div>
  );
};

export default FilterSidebar;
