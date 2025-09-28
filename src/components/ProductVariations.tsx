import React, { useState, useEffect, useMemo } from "react";
import { useReferenceData } from "../hooks/useReferenceData";
import { AdvertisementDTO } from "../api/types";
import { useLocation } from "react-router-dom";
import WhatsAppLink from "./WhatsAppLink";

// --- Componente de Botão de Opção Estilizado (Sem alterações) ---
interface OptionButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onClick: (value: string) => void;
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  value,
  selectedValue,
  onClick,
  disabled = false,
}) => {
  const isSelected = selectedValue === value && !disabled;

  const baseClasses =
    "px-3 py-2 text-sm border flex-grow flex items-center justify-center transition-colors duration-200";
  let stateClasses = "";

  if (disabled) {
    stateClasses =
      "border-dashed border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed";
  } else if (isSelected) {
    stateClasses = "border-[#4f43ae] text-[#4f43ae] font-semibold bg-white";
  } else {
    stateClasses =
      "border-gray-300 text-gray-800 bg-white hover:border-gray-500";
  }

  return (
    <button
      className={`${baseClasses} ${stateClasses}`}
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

// Tipo para as seções expandidas
type ExpandedSections = {
  preservation: boolean;
  cartridgeType: boolean;
  region: boolean;
  audioLanguages: boolean;
  subtitleLanguages: boolean;
  interfaceLanguages: boolean;
};

// Componente para renderizar opções com botão de expansão (Sem alterações)
interface OptionsSectionProps {
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabledOptions: string[];
  sectionKey: keyof ExpandedSections;
  expandedSections: ExpandedSections;
  onToggleExpansion: (section: keyof ExpandedSections) => void;
  gridCols?: string;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  disabledOptions,
  sectionKey,
  expandedSections,
  onToggleExpansion,
  gridCols = "grid-cols-3",
}) => {
  // Filtrar apenas as opções disponíveis (não desabilitadas)
  const availableOptions = options.filter(
    (option) => !disabledOptions.includes(option)
  );

  const isExpanded = expandedSections[sectionKey];
  const limitedOptions = isExpanded
    ? availableOptions
    : availableOptions.slice(0, 6);
  const hasMore = availableOptions.length > 6;

  // Se não há opções disponíveis, não renderizar a seção
  if (availableOptions.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-800 mb-2">{title}:</p>
      <div className={`grid ${gridCols} gap-2`}>
        {limitedOptions.map((option) => (
          <OptionButton
            key={option}
            label={option}
            value={option}
            selectedValue={selectedValue}
            onClick={onSelect}
            disabled={false} // Todas as opções renderizadas são disponíveis
          />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => onToggleExpansion(sectionKey)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded
            ? "Ver menos"
            : `Ver mais (${availableOptions.length - 6} opções)`}
        </button>
      )}
    </div>
  );
};

// Interface para os dados das variações
interface ProductVariationsData {
  preservation: string[];
  cartridgeType: string[];
  region: string[];
  audioLanguages: string[];
  interfaceLanguages: string[];
  stock: number;
}

// --- Componente Principal de Variações do Produto (COM AS MODIFICAÇÕES) ---
interface ProductVariationsProps {
  data?: ProductVariationsData;
  variations?: AdvertisementDTO[];
  mainAdvertisement?: AdvertisementDTO;
}

const ProductVariations: React.FC<ProductVariationsProps> = ({
  variations = [],
  mainAdvertisement,
}) => {
  const location = useLocation();
  const {
    preservationStates,
    cartridgeTypes,
    regions,
    languages,
    loading,
    error,
  } = useReferenceData();

  // Mapeamento para acessar os nomes corretos dentro do objeto de variação.
  // AQUI ESTÁ A CORREÇÃO PRINCIPAL
  const variationKeyMap = useMemo(
    () => ({
      preservation: (v: AdvertisementDTO) => v.preservationState?.name,
      cartridgeType: (v: AdvertisementDTO) => v.cartridgeType?.name,
      region: (v: AdvertisementDTO) => v.gameLocalization?.region?.name,
      // CORREÇÃO: Mapear diretamente para o nome do idioma (string)
      audioLanguages: (v: AdvertisementDTO) => {
        if (!v.advertisementLanguageSupports) return [];
        return v.advertisementLanguageSupports
          .filter((als: any) => {
            const typeName =
              als.languageSupport?.languageSupportType?.name?.toLowerCase() ||
              "";
            const typeId = als.languageSupport?.languageSupportType?.id;
            return typeId === 1 || typeName.includes("audio");
          })
          .map((als: any) => als.languageSupport?.language?.name) // <-- Extrai o .name aqui
          .filter(Boolean); // Remove quaisquer nomes nulos/undefined
      },
      subtitleLanguages: (v: AdvertisementDTO) => {
        if (!v.advertisementLanguageSupports) return [];
        return v.advertisementLanguageSupports
          .filter((als: any) => {
            const typeName =
              als.languageSupport?.languageSupportType?.name?.toLowerCase() ||
              "";
            const typeId = als.languageSupport?.languageSupportType?.id;
            return (
              typeId === 2 ||
              typeName.includes("subtitle") ||
              typeName.includes("legenda")
            );
          })
          .map((als: any) => als.languageSupport?.language?.name) // <-- Extrai o .name aqui
          .filter(Boolean);
      },
      interfaceLanguages: (v: AdvertisementDTO) => {
        if (!v.advertisementLanguageSupports) return [];
        return v.advertisementLanguageSupports
          .filter((als: any) => {
            const typeName =
              als.languageSupport?.languageSupportType?.name?.toLowerCase() ||
              "";
            const typeId = als.languageSupport?.languageSupportType?.id;
            return typeId === 3 || typeName.includes("interface");
          })
          .map((als: any) => als.languageSupport?.language?.name) // <-- Extrai o .name aqui
          .filter(Boolean);
      },
    }),
    []
  );

  // Estado centralizado para guardar as seleções do usuário
  const [selection, setSelection] = useState<{ [key: string]: string }>(() => {
    // ✅ CORREÇÃO: Pré-selecionar características do anúncio principal
    if (!mainAdvertisement) return {};

    const initialSelection: { [key: string]: string } = {};

    Object.keys(variationKeyMap).forEach((key) => {
      const getValue = variationKeyMap[key as keyof typeof variationKeyMap];
      if (getValue) {
        const value = getValue(mainAdvertisement);
        if (value) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              // Para arrays, pegar o primeiro valor
              initialSelection[key] = value[0];
            }
          } else {
            // Para valores únicos
            initialSelection[key] = value;
          }
        }
      }
    });

    console.log("=== INITIAL SELECTION FROM MAIN AD ===");
    console.log("mainAdvertisement:", mainAdvertisement);
    console.log("initialSelection:", initialSelection);
    console.log("=====================================");

    return initialSelection;
  });

  // ✅ NOVO: Ler query parameter 'variation' para pré-seleção
  const urlParams = new URLSearchParams(location.search);
  const variationId = urlParams.get("variation");

  // Estado para guardar as opções que estão dinamicamente disponíveis
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: string[];
  }>({});

  // ✅ CORREÇÃO: Reativado para atualizar seleção quando mainAdvertisement mudar
  useEffect(() => {
    if (mainAdvertisement) {
      const newSelection: { [key: string]: string } = {};

      // ✅ NOVO: Se há variationId na URL, usar essa variação para pré-seleção
      if (variationId) {
        const targetVariation = variations.find(
          (v) => v.id.toString() === variationId
        );
        if (targetVariation) {
          console.log("=== PRESELECTING VARIATION FROM URL ===");
          console.log("variationId:", variationId);
          console.log("targetVariation:", targetVariation);

          // Usar as características da variação selecionada
          Object.keys(variationKeyMap).forEach((key) => {
            const getValue =
              variationKeyMap[key as keyof typeof variationKeyMap];
            if (getValue) {
              const value = getValue(targetVariation);
              if (value) {
                if (Array.isArray(value)) {
                  if (value.length > 0) {
                    newSelection[key] = value[0];
                  }
                } else {
                  newSelection[key] = value;
                }
              }
            }
          });
          console.log("newSelection from variation:", newSelection);
        }
      } else {
        // ✅ Usar características do anúncio principal se não há variação específica
        console.log("=== USING MAIN ADVERTISEMENT CHARACTERISTICS ===");
        console.log("mainAdvertisement:", mainAdvertisement);

        // Usar as características do anúncio principal
        Object.keys(variationKeyMap).forEach((key) => {
          const getValue = variationKeyMap[key as keyof typeof variationKeyMap];
          if (getValue) {
            const value = getValue(mainAdvertisement);
            if (value) {
              if (Array.isArray(value)) {
                if (value.length > 0) {
                  newSelection[key] = value[0];
                }
              } else {
                newSelection[key] = value;
              }
            }
          }
        });
        console.log("newSelection from main ad:", newSelection);
      }

      console.log("=== UPDATING SELECTION FROM MAIN AD ===");
      console.log("mainAdvertisement:", mainAdvertisement);
      console.log("newSelection:", newSelection);
      console.log("=====================================");

      setSelection(newSelection);
    }
  }, [mainAdvertisement, variationId, variations, variationKeyMap]);

  // Armazena todas as opções possíveis vindas da API (calculado apenas uma vez)
  const allPossibleOptions = useMemo(
    () => ({
      preservation: preservationStates.map((state) => state.name),
      cartridgeType: cartridgeTypes.map((type) => type.name),
      region: regions.map((region) => region.name),
      audioLanguages: languages.map((lang) => lang.name),
      subtitleLanguages: languages.map((lang) => lang.name),
      interfaceLanguages: languages.map((lang) => lang.name),
    }),
    [preservationStates, cartridgeTypes, regions, languages]
  );

  // EFEITO PRINCIPAL: Recalcula as opções disponíveis sempre que uma seleção é feita
  useEffect(() => {
    console.log("=== PRODUCT VARIATIONS DEBUG ===");
    console.log("variations:", variations);
    console.log("mainAdvertisement:", mainAdvertisement);
    console.log("current selection:", selection);
    console.log("selection keys:", Object.keys(selection));
    console.log("selection values:", Object.values(selection));

    // ✅ Log detalhado para comparar estruturas
    console.log("=== VARIATIONS STRUCTURE ANALYSIS ===");
    variations.forEach((variation, index) => {
      console.log(`--- VARIATION ${index} (ID: ${variation.id}) ---`);
      console.log("preservationState:", variation.preservationState);
      console.log("cartridgeType:", variation.cartridgeType);
      console.log("gameLocalization:", variation.gameLocalization);
      console.log(
        "advertisementLanguageSupports:",
        variation.advertisementLanguageSupports
      );

      // ✅ Testar cada mapeamento
      Object.keys(variationKeyMap).forEach((key) => {
        const getValue = variationKeyMap[key as keyof typeof variationKeyMap];
        const value = getValue?.(variation);
        console.log(`${key}:`, value);
      });
      console.log("--------------------------------");
    });

    const available: { [key: string]: Set<string> } = {};
    const variationKeys = Object.keys(variationKeyMap);
    const allAdvertisements = [
      ...(mainAdvertisement ? [mainAdvertisement] : []),
      ...variations,
    ];

    console.log("allAdvertisements:", allAdvertisements);

    variationKeys.forEach((key) => {
      available[key] = new Set<string>();

      // ✅ SIMPLIFICAÇÃO: Sempre mostrar todas as opções disponíveis
      const relevantAdvertisements = allAdvertisements;
      console.log(`Showing all options for ${key}`);

      console.log(`relevantAdvertisements for ${key}:`, relevantAdvertisements);

      relevantAdvertisements.forEach((ad) => {
        const value =
          variationKeyMap[key as keyof typeof variationKeyMap]?.(ad);
        console.log(`value for ${key} from ad ${ad.id}:`, value);
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((item) => available[key].add(item));
          } else {
            available[key].add(value);
          }
        }
      });
    });

    const finalOptions: { [key: string]: string[] } = {};
    Object.keys(available).forEach((key) => {
      finalOptions[key] = Array.from(available[key]);
    });

    console.log("finalOptions:", finalOptions);
    console.log("================================");

    setDynamicOptions(finalOptions);
  }, [selection, variations, mainAdvertisement, variationKeyMap]);

  // Função para encontrar uma variação que contenha uma opção específica
  const findVariationWithOption = (group: string, value: string) => {
    return variations.find((variation) => {
      const getValue = variationKeyMap[group as keyof typeof variationKeyMap];
      if (getValue) {
        const variationValue = getValue(variation);
        if (Array.isArray(variationValue)) {
          return variationValue.includes(value);
        } else {
          return variationValue === value;
        }
      }
      return false;
    });
  };

  // Função para verificar se uma opção pertence ao anúncio principal
  const isMainAdvertisementOption = (group: string, value: string) => {
    if (!mainAdvertisement) return false;
    const getValue = variationKeyMap[group as keyof typeof variationKeyMap];
    if (getValue) {
      const mainAdValue = getValue(mainAdvertisement);
      if (Array.isArray(mainAdValue)) {
        return mainAdValue.includes(value);
      } else {
        return mainAdValue === value;
      }
    }
    return false;
  };

  // Função para obter todas as opções de uma variação específica
  const getVariationOptions = (variation: AdvertisementDTO) => {
    const options: { [key: string]: string } = {};
    Object.keys(variationKeyMap).forEach((key) => {
      const getValue = variationKeyMap[key as keyof typeof variationKeyMap];
      if (getValue) {
        const value = getValue(variation);
        if (value) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              options[key] = value[0];
            }
          } else {
            options[key] = value;
          }
        }
      }
    });
    return options;
  };

  // Handler unificado para lidar com cliques nos botões de opção
  const handleSelect = (group: string, value: string) => {
    setSelection((prev) => {
      const newSelection = { ...prev };
      if (newSelection[group] === value) {
        delete newSelection[group];
      } else {
        const targetVariation = findVariationWithOption(group, value);
        if (targetVariation) {
          const variationOptions = getVariationOptions(targetVariation);
          Object.assign(newSelection, variationOptions);
        } else if (
          isMainAdvertisementOption(group, value) &&
          mainAdvertisement
        ) {
          const mainAdOptions = getVariationOptions(mainAdvertisement);
          Object.assign(newSelection, mainAdOptions);
        } else {
          newSelection[group] = value;
        }
      }
      return newSelection;
    });
  };

  const [quantity, setQuantity] = useState<number>(1);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    preservation: false,
    cartridgeType: false,
    region: false,
    audioLanguages: false,
    subtitleLanguages: false,
    interfaceLanguages: false,
  });

  const toggleExpansion = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuantity(Number(event.target.value));
  };

  // Função para encontrar a variação atual baseada na seleção
  const findCurrentVariation = () => {
    if (!variations.length) return mainAdvertisement;

    // Procurar por uma variação que corresponda exatamente à seleção atual
    const matchingVariation = variations.find((variation) => {
      const variationOptions = getVariationOptions(variation);

      // Verificar se todas as opções selecionadas correspondem às opções da variação
      return Object.keys(selection).every((key) => {
        const selectedValue = selection[key];
        const variationValue = variationOptions[key];

        if (Array.isArray(variationValue)) {
          return variationValue.includes(selectedValue);
        } else {
          return variationValue === selectedValue;
        }
      });
    });

    return matchingVariation || mainAdvertisement;
  };

  const selectedVariation = findCurrentVariation();

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erro ao carregar dados</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Função helper para calcular as opções desabilitadas para um grupo
  const getDisabledOptionsFor = (group: keyof typeof allPossibleOptions) => {
    const availableOptions = dynamicOptions[group] || [];
    return allPossibleOptions[group].filter(
      (opt) => !availableOptions.includes(opt)
    );
  };

  // Função para determinar qual anúncio está atualmente selecionado
  const getCurrentSelectedAdvertisement = () => {
    if (Object.keys(selection).length === 0 && mainAdvertisement) {
      return mainAdvertisement;
    }
    const allAdvertisements = [
      ...(mainAdvertisement ? [mainAdvertisement] : []),
      ...variations,
    ];
    return (
      allAdvertisements.find((ad) => {
        return Object.entries(selection).every(([key, selectedValue]) => {
          const getValue = variationKeyMap[key as keyof typeof variationKeyMap];
          if (getValue) {
            const adValue = getValue(ad);
            if (Array.isArray(adValue)) {
              return adValue.includes(selectedValue);
            } else {
              return adValue === selectedValue;
            }
          }
          return false;
        });
      }) || null
    );
  };

  const currentAd = getCurrentSelectedAdvertisement();

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Cartuchos disponíveis:
      </h2>

      {currentAd && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm font-medium text-gray-700">📦 Seleção atual:</p>
          <p className="text-xs text-gray-600 mt-1">
            {currentAd === mainAdvertisement
              ? "Anúncio Principal"
              : `Variação ID: ${currentAd.id}`}
          </p>
          {currentAd.availableStock && (
            <p className="text-xs text-green-600 mt-1">
              ✅ {currentAd.availableStock} unidade(s) em estoque
            </p>
          )}
        </div>
      )}

      <OptionsSection
        title="Estado de Preservação"
        options={allPossibleOptions.preservation}
        selectedValue={selection.preservation || ""}
        onSelect={(value) => handleSelect("preservation", value)}
        disabledOptions={getDisabledOptionsFor("preservation")}
        sectionKey="preservation"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Tipo de cartucho"
        options={allPossibleOptions.cartridgeType}
        selectedValue={selection.cartridgeType || ""}
        onSelect={(value) => handleSelect("cartridgeType", value)}
        disabledOptions={getDisabledOptionsFor("cartridgeType")}
        sectionKey="cartridgeType"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
        gridCols="grid-cols-2"
      />

      <OptionsSection
        title="Região"
        options={allPossibleOptions.region}
        selectedValue={selection.region || ""}
        onSelect={(value) => handleSelect("region", value)}
        disabledOptions={getDisabledOptionsFor("region")}
        sectionKey="region"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Idiomas do Áudio"
        options={allPossibleOptions.audioLanguages}
        selectedValue={selection.audioLanguages || ""}
        onSelect={(value) => handleSelect("audioLanguages", value)}
        disabledOptions={getDisabledOptionsFor("audioLanguages")}
        sectionKey="audioLanguages"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Idiomas da Legenda"
        options={allPossibleOptions.subtitleLanguages}
        selectedValue={selection.subtitleLanguages || ""}
        onSelect={(value) => handleSelect("subtitleLanguages", value)}
        disabledOptions={getDisabledOptionsFor("subtitleLanguages")}
        sectionKey="subtitleLanguages"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Idiomas da Interface"
        options={allPossibleOptions.interfaceLanguages}
        selectedValue={selection.interfaceLanguages || ""}
        onSelect={(value) => handleSelect("interfaceLanguages", value)}
        disabledOptions={getDisabledOptionsFor("interfaceLanguages")}
        sectionKey="interfaceLanguages"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <div className="mb-5">
        <label htmlFor="quantity" className="text-sm text-gray-800 block mb-2">
          Estoque Disponível:
        </label>
        <div className="relative">
          <select
            id="quantity"
            className="block w-full px-3 py-2.5 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
            value={quantity}
            onChange={handleQuantityChange}
          >
            {Array.from({ length: currentAd?.availableStock || 0 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Quantidade: {i + 1}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <WhatsAppLink
          mainAdvertisement={mainAdvertisement}
          selectedVariation={selectedVariation}
          selection={selection}
          quantity={quantity}
        />
        <button
          onClick={() => {
            if (mainAdvertisement?.game?.igdbUrl) {
              window.open(
                mainAdvertisement.game.igdbUrl,
                "_blank",
                "noopener,noreferrer"
              );
            } else {
              console.warn("IGDB URL não disponível para este jogo");
            }
          }}
          disabled={!mainAdvertisement?.game?.igdbUrl}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ${
            mainAdvertisement?.game?.igdbUrl
              ? "bg-[#DDDDF3] text-black hover:bg-indigo-200 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Ver no IGDB
        </button>
      </div>
    </div>
  );
};

export default ProductVariations;
