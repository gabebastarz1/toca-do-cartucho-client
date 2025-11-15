import React, { useState, useCallback, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { useAllCategoryData } from "../components/CategoryDataProvider";
import { useIsMobile } from "../hooks/useIsMobile";

import FilterAccordion from "./FilterSidebar/FilterAccordion";
import CheckboxFilterGroup from "./FilterSidebar/CheckboxFilterGroup";
import RadioFilterGroup from "./FilterSidebar/RadioFilterGroup";
import PriceFilterGroup from "./FilterSidebar/PriceFilterGroup";

// --- Tipos ---
type SelectedFilters = Record<
  string,
  Set<string> | string | { min: string; max: string }
>;

interface FilterSidebarProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  loading?: boolean;
  initialFilters?: Record<string, string[]>;
  initialPriceRange?: { min: string; max: string };
}

// --- Funções Helper ---
const initializeSelectedFilters = (
  initialFilters: Record<string, string[]> = {},
  initialPriceRange?: { min: string; max: string }
): SelectedFilters => {
  const selected: SelectedFilters = {};

  // Mapeamento de seções para prefixos
  const sectionPrefixes: Record<string, string> = {
    genre: "genre_",
    theme: "theme_",
    gameMode: "gamemode_",
    audioLanguage: "language_",
    subtitleLanguage: "language_",
    interfaceLanguage: "language_",
    region: "region_",
  };

  for (const key in initialFilters) {
    if (initialFilters[key] && initialFilters[key].length > 0) {
      // Seção de condições usa radio button (seleção única)
      if (key === "conditions") {
        selected[key] = initialFilters[key][0]; // Pega apenas o primeiro valor
      } else {
        // Outras seções usam checkbox (seleção múltipla)
        const prefix = sectionPrefixes[key] || "";
        // Converter IDs para IDs prefixados (lidando com IDs que já têm prefixo)
        const prefixedIds = initialFilters[key].map((id) => {
          if (prefix && id.startsWith(prefix)) {
            return id;
          }
          return prefix ? `${prefix}${id}` : id;
        });
        selected[key] = new Set(prefixedIds);
      }
    }
  }

  // Inicializar filtro de preço se fornecido
  if (initialPriceRange && (initialPriceRange.min || initialPriceRange.max)) {
    selected.price = {
      min: initialPriceRange.min || "",
      max: initialPriceRange.max || "",
    };
  }

  return selected;
};

// Função para extrair ID numérico do ID prefixado
const extractNumericId = (prefixedId: string): string => {
  const parts = prefixedId.split("_");
  return parts[parts.length - 1]; // Retorna a última parte (ID numérico)
};

// Função para converter filtros selecionados para o formato do backend
const convertFiltersForBackend = (
  selectedFilters: SelectedFilters
): Record<string, string[]> => {
  const backendFilters: Record<string, string[]> = {};

  for (const [sectionId, selectedValue] of Object.entries(selectedFilters)) {
    if (selectedValue) {
      if (sectionId === "conditions") {
        // Para condições (radio button), enviar como array com um elemento
        backendFilters[sectionId] = [selectedValue as string];
      } else if (sectionId === "price") {
        // Para preço, converter objeto para array [min, max]
        const priceRange = selectedValue as { min: string; max: string };
        if (priceRange.min || priceRange.max) {
          backendFilters[sectionId] = [priceRange.min, priceRange.max];
        }
      } else {
        // Para outras seções (checkbox), converter Set para array
        const selectedIds = selectedValue as Set<string>;
        if (selectedIds.size > 0) {
          // Converter IDs prefixados para IDs numéricos para o backend
          const numericIds = Array.from(selectedIds).map(extractNumericId);
          backendFilters[sectionId] = numericIds;
        }
      }
    }
  }

  return backendFilters;
};

// --- Componente Principal ---
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFiltersChange,
  initialFilters,
  initialPriceRange,
}) => {
  const isMobile = useIsMobile(1023);
  const { genres, themes, gameModes, languages, regions } =
    useAllCategoryData();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() =>
    initializeSelectedFilters(initialFilters, initialPriceRange)
  );

  const [desktopExpanded, setDesktopExpanded] = useState<Set<string>>(
    new Set()
  );

  // Sincronizar com initialFilters quando eles mudam (evitando conflitos)
  useEffect(() => {
    if (!initialFilters && !initialPriceRange) return;

    // Converter initialFilters para o formato interno do FilterSidebar
    const newSelectedFilters = initializeSelectedFilters(
      initialFilters,
      initialPriceRange
    );

    // Verificar se os filtros realmente mudaram para evitar loops
    const currentFiltersString = JSON.stringify(selectedFilters);
    const newFiltersString = JSON.stringify(newSelectedFilters);

    if (currentFiltersString !== newFiltersString) {
      
      setSelectedFilters(newSelectedFilters);
    }
  }, [initialFilters, initialPriceRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterConfig = useMemo(
    () => [
      {
        id: "conditions",
        title: "Condição",
        options: [
          { id: "sale-only", label: "Somente Venda" },
          { id: "trade-only", label: "Somente Troca" },
          { id: "sale-trade", label: "Venda e Troca" },
        ],
      },
      {
        id: "preservationStateIds",
        title: "Estado de Preservação",
        options: [
          { id: "new", label: "Novo" },
          { id: "semi-new", label: "Seminovo" },
          { id: "good", label: "Bom" },
          { id: "normal", label: "Normal" },
          { id: "damaged", label: "Danificado" },
        ],
      },
      {
        id: "cartridgeType",
        title: "Tipo do Cartucho",
        options: [
          { id: "retro", label: "Retrô" },
          { id: "repro", label: "Reprô" },
        ],
      },
      {
        id: "price",
        title: "Preço",
        type: "price",
      },
      {
        id: "theme",
        title: "Temática",
        options: themes.map((t) => ({ id: t.id, label: t.name })),
      },
      {
        id: "genre",
        title: "Gênero",
        options: genres.map((g) => ({ id: g.id, label: g.name })),
      },
      {
        id: "gameMode",
        title: "Modo de Jogo",
        options: gameModes.map((gm) => ({ id: gm.id, label: gm.name })),
      },
      {
        id: "audioLanguage",
        title: "Idioma do Áudio",
        options: languages.map((l) => ({ id: l.id, label: l.name })),
      },
      {
        id: "subtitleLanguage",
        title: "Idioma da Legenda",
        options: languages.map((l) => ({ id: l.id, label: l.name })),
      },
      {
        id: "interfaceLanguage",
        title: "Idioma da Interface",
        options: languages.map((l) => ({ id: l.id, label: l.name })),
      },
      {
        id: "region",
        title: "Região",
        options: regions.map((r) => ({ id: r.id, label: r.name })),
      },
    ],
    [genres, themes, gameModes, languages, regions]
  );

  // Handlers memoizados
  const handleCheckboxChange = useCallback(
    (sectionId: string, optionId: string) => {
      setSelectedFilters((prev) => {
        const newSelected = { ...prev };
        const sectionSet = new Set(
          (newSelected[sectionId] as Set<string>) || []
        );
        if (sectionSet.has(optionId)) sectionSet.delete(optionId);
        else sectionSet.add(optionId);
        if (sectionSet.size === 0) delete newSelected[sectionId];
        else newSelected[sectionId] = sectionSet;
        return newSelected;
      });
    },
    []
  );

  const handleRadioChange = useCallback(
    (sectionId: string, optionId: string) => {
      setSelectedFilters((prev) => {
        const newSelected = { ...prev };
        newSelected[sectionId] = optionId;
        return newSelected;
      });
    },
    []
  );

  const handlePriceChange = useCallback(
    (sectionId: string, min: string, max: string) => {
      setSelectedFilters((prev) => {
        const newSelected = { ...prev };
        if (min || max) {
          newSelected[sectionId] = { min, max };
        } else {
          delete newSelected[sectionId];
        }
        return newSelected;
      });
    },
    []
  );

  const clearSectionFilters = useCallback((sectionId: string) => {
    setSelectedFilters((prev) => {
      const newSelected = { ...prev };
      delete newSelected[sectionId];
      return newSelected;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({});
  }, []);

  const toggleDesktopExpand = useCallback((sectionId: string) => {
    setDesktopExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    if (!onFiltersChange) return;
    const activeFilters = convertFiltersForBackend(selectedFilters);
    onFiltersChange(activeFilters);
  }, [selectedFilters, onFiltersChange]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((acc, currentValue) => {
      if (typeof currentValue === "string") {
        return acc + 1; // Radio button selecionado conta como 1
      } else if (typeof currentValue === "object" && currentValue !== null) {
        if (Array.isArray(currentValue)) {
          return acc + currentValue.length; // Array
        } else if (currentValue instanceof Set) {
          return acc + currentValue.size; // Set de checkboxes
        } else if ("min" in currentValue || "max" in currentValue) {
          // Objeto de preço - conta como 1 se tem valores
          const priceRange = currentValue as { min: string; max: string };
          return acc + (priceRange.min || priceRange.max ? 1 : 0);
        }
      }
      return acc;
    }, 0);
  }, [selectedFilters]);

  return (
    <aside className="w-full lg:w-72 bg-[#F4F3F5] p-1 font-sans">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Filtrar por:</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-purple-600 hover:text-purple-800"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {filterConfig.map((section) => {
        const selectedCount = (() => {
          if (section.id === "conditions") {
            return selectedFilters[section.id] ? 1 : 0;
          } else if (section.id === "price") {
            const priceRange = selectedFilters[section.id] as
              | { min: string; max: string }
              | undefined;
            return priceRange && (priceRange.min || priceRange.max) ? 1 : 0;
          } else {
            return (selectedFilters[section.id] as Set<string>)?.size || 0;
          }
        })();

        if (isMobile) {
          return (
            <FilterAccordion
              key={section.id}
              title={section.title}
              badgeCount={selectedCount}
            >
              {section.id === "conditions" ? (
                <RadioFilterGroup
                  options={section.options}
                  selectedId={(selectedFilters[section.id] as string) || null}
                  onRadioChange={(optionId) =>
                    handleRadioChange(section.id, optionId)
                  }
                  sectionId={section.id}
                />
              ) : section.id === "price" ? (
                <PriceFilterGroup
                  minPrice={
                    (
                      selectedFilters[section.id] as {
                        min: string;
                        max: string;
                      }
                    )?.min || ""
                  }
                  maxPrice={
                    (
                      selectedFilters[section.id] as {
                        min: string;
                        max: string;
                      }
                    )?.max || ""
                  }
                  onPriceChange={(min, max) =>
                    handlePriceChange(section.id, min, max)
                  }
                  sectionId={section.id}
                />
              ) : (
                <CheckboxFilterGroup
                  options={section.options}
                  selectedIds={
                    (selectedFilters[section.id] as Set<string>) || new Set()
                  }
                  onCheckboxChange={(optionId) =>
                    handleCheckboxChange(section.id, optionId)
                  }
                  sectionId={section.id}
                />
              )}
            </FilterAccordion>
          );
        }

        // --- RENDERIZAÇÃO DESKTOP ---
        const canExpand = section.options && section.options.length > 5;
        const isExpanded = desktopExpanded.has(section.id);
        const displayOptions =
          canExpand && !isExpanded
            ? section.options.slice(0, 5)
            : section.options;

        return (
          <div key={section.id} className="border-b border-gray-200 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{section.title}</h3>
                {selectedCount > 0 && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                    {selectedCount}
                  </span>
                )}
              </div>
              {selectedCount > 0 && (
                <button
                  onClick={() => clearSectionFilters(section.id)}
                  title={`Limpar filtros de ${section.title}`}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {section.id === "conditions" ? (
                <RadioFilterGroup
                  options={displayOptions}
                  selectedId={(selectedFilters[section.id] as string) || null}
                  onRadioChange={(optionId) =>
                    handleRadioChange(section.id, optionId)
                  }
                  sectionId={section.id}
                />
              ) : section.id === "price" ? (
                <PriceFilterGroup
                  minPrice={
                    (
                      selectedFilters[section.id] as {
                        min: string;
                        max: string;
                      }
                    )?.min || ""
                  }
                  maxPrice={
                    (
                      selectedFilters[section.id] as {
                        min: string;
                        max: string;
                      }
                    )?.max || ""
                  }
                  onPriceChange={(min, max) =>
                    handlePriceChange(section.id, min, max)
                  }
                  sectionId={section.id}
                />
              ) : (
                <CheckboxFilterGroup
                  options={displayOptions}
                  selectedIds={
                    (selectedFilters[section.id] as Set<string>) || new Set()
                  }
                  onCheckboxChange={(optionId) =>
                    handleCheckboxChange(section.id, optionId)
                  }
                  sectionId={section.id}
                />
              )}
            </div>
            {canExpand && (
              <button
                onClick={() => toggleDesktopExpand(section.id)}
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 mt-2"
              >
                {isExpanded ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default FilterSidebar;
