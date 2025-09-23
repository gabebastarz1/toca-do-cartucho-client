import React, { useState, useCallback, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { useAllCategoryData } from "../components/CategoryDataProvider";
import { useIsMobile } from "../hooks/useIsMobile";

import FilterAccordion from "./FilterSidebar/FilterAccordion";
import CheckboxFilterGroup from "./FilterSidebar/CheckboxFilterGroup";

// --- Tipos ---
type SelectedFilters = Record<string, Set<string>>;

interface FilterSidebarProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  loading?: boolean;
  initialFilters?: Record<string, string[]>;
  initialPriceRange?: { min: string; max: string };
}

// --- Funções Helper ---
const initializeSelectedFilters = (
  initialFilters: Record<string, string[]> = {}
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
      const prefix = sectionPrefixes[key] || "";
      // Converter IDs para IDs prefixados (lidando com IDs que já têm prefixo)
      const prefixedIds = initialFilters[key].map((id) => {
        // Se o ID já tem o prefixo correto, usar como está
        if (prefix && id.startsWith(prefix)) {
          return id;
        }
        // Se não tem prefixo, adicionar
        return prefix ? `${prefix}${id}` : id;
      });
      selected[key] = new Set(prefixedIds);
    }
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

  for (const [sectionId, selectedIds] of Object.entries(selectedFilters)) {
    if (selectedIds.size > 0) {
      // Converter IDs prefixados para IDs numéricos para o backend
      const numericIds = Array.from(selectedIds).map(extractNumericId);
      backendFilters[sectionId] = numericIds;
    }
  }

  return backendFilters;
};

// --- Componente Principal ---
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFiltersChange,
  initialFilters,
}) => {
  const isMobile = useIsMobile(1023);
  const { genres, themes, gameModes, languages, regions } =
    useAllCategoryData();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(() =>
    initializeSelectedFilters(initialFilters)
  );

  // NOVO: Estado para controlar seções expandidas apenas no desktop
  const [desktopExpanded, setDesktopExpanded] = useState<Set<string>>(
    new Set()
  );

  // Sincronizar com initialFilters quando eles mudam (evitando conflitos)
  useEffect(() => {
    if (!initialFilters) return;

    // Converter initialFilters para o formato interno do FilterSidebar
    const newSelectedFilters = initializeSelectedFilters(initialFilters);

    // Verificar se os filtros realmente mudaram para evitar loops
    const currentFiltersString = JSON.stringify(
      Object.fromEntries(
        Object.entries(selectedFilters).map(([key, set]) => [
          key,
          Array.from(set).sort(),
        ])
      )
    );
    const newFiltersString = JSON.stringify(
      Object.fromEntries(
        Object.entries(newSelectedFilters).map(([key, set]) => [
          key,
          Array.from(set).sort(),
        ])
      )
    );

    if (currentFiltersString !== newFiltersString) {
      console.log(
        "FilterSidebar - Sincronizando com initialFilters:",
        initialFilters
      );
      setSelectedFilters(newSelectedFilters);
    }
  }, [initialFilters]); // eslint-disable-line react-hooks/exhaustive-deps

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
        id: "preservation",
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
        const sectionSet = new Set(newSelected[sectionId] || []);
        if (sectionSet.has(optionId)) sectionSet.delete(optionId);
        else sectionSet.add(optionId);
        if (sectionSet.size === 0) delete newSelected[sectionId];
        else newSelected[sectionId] = sectionSet;
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

  // NOVO: Handler para expandir/recolher seções no desktop
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
    return Object.values(selectedFilters).reduce(
      (acc, currentSet) => acc + currentSet.size,
      0
    );
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
        const selectedCount = selectedFilters[section.id]?.size || 0;

        if (isMobile) {
          return (
            <FilterAccordion
              key={section.id}
              title={section.title}
              badgeCount={selectedCount}
            >
              <CheckboxFilterGroup
                options={section.options}
                selectedIds={selectedFilters[section.id] || new Set()}
                onCheckboxChange={(optionId) =>
                  handleCheckboxChange(section.id, optionId)
                }
                sectionId={section.id}
              />
            </FilterAccordion>
          );
        }

        // --- RENDERIZAÇÃO DESKTOP ---
        const canExpand = section.options.length > 5;
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
              <CheckboxFilterGroup
                options={displayOptions}
                selectedIds={selectedFilters[section.id] || new Set()}
                onCheckboxChange={(optionId) =>
                  handleCheckboxChange(section.id, optionId)
                }
                sectionId={section.id}
              />
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
