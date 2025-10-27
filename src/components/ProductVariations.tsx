import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useReferenceData } from "../hooks/useReferenceData"; // Removed to use mock
import WhatsAppLink from "./WhatsAppLink"; // Removed to use mock

type AdvertisementDTO = {
  id: number | string;
  preservationState?: { name: string };
  cartridgeType?: { name: string };
  gameLocalization?: { region?: { name: string } };
  advertisementLanguageSupports?: {
    languageSupport?: {
      language?: { name: string };
      languageSupportType?: { id: number };
    };
  }[];
  availableStock?: number;
  game?: {
    title?: string;
    igdbUrl?: string;
  };
};

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

// Componente para renderizar opções com botão de expansão (LÓGICA ATUALIZADA)
interface OptionsSectionProps {
  title: string;
  options: string[]; // Recebe apenas as opções que devem ser exibidas
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
  // Se não há opções para esta seção, não renderiza nada.
  if (options.length === 0) {
    return null;
  }

  const isExpanded = expandedSections[sectionKey];
  const limitedOptions = isExpanded ? options : options.slice(0, 6);
  const hasMore = options.length > 6;

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
            disabled={disabledOptions.includes(option)}
          />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => onToggleExpansion(sectionKey)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? "Ver menos" : `Ver mais (${options.length - 6} opções)`}
        </button>
      )}
    </div>
  );
};

interface ProductVariationsData {
  preservation: string[];
  cartridgeType: string[];
  region: string[];
  audioLanguages: string[];
  interfaceLanguages: string[];
  stock: number;
}

interface ProductVariationsProps {
  data?: ProductVariationsData;
  variations?: AdvertisementDTO[];
  mainAdvertisement?: AdvertisementDTO;
  onVariationChange?: (variation: AdvertisementDTO | undefined) => void;
}

const ProductVariations: React.FC<ProductVariationsProps> = ({
  variations = [],
  mainAdvertisement,
  onVariationChange,
}) => {
  const { loading, error } = useReferenceData();
  const location = useLocation();

  const variationKeyMap = useMemo(
    () => ({
      preservation: (v: AdvertisementDTO) => v.preservationState?.name,
      cartridgeType: (v: AdvertisementDTO) => v.cartridgeType?.name,
      region: (v: AdvertisementDTO) => v.gameLocalization?.region?.name,
      audioLanguages: (v: AdvertisementDTO) => {
        if (!v.advertisementLanguageSupports) return [];
        return v.advertisementLanguageSupports
          .filter(
            (als: any) => als.languageSupport?.languageSupportType?.id === 1
          )
          .map((als: any) => als.languageSupport?.language?.name)
          .filter(Boolean);
      },
      subtitleLanguages: (v: AdvertisementDTO) => {
        if (!v.advertisementLanguageSupports) return [];
        return v.advertisementLanguageSupports
          .filter(
            (als: any) => als.languageSupport?.languageSupportType?.id === 2
          )
          .map((als: any) => als.languageSupport?.language?.name)
          .filter(Boolean);
      },
      interfaceLanguages: (v: AdvertisementDTO) => {
        if (!v.advertisementLanguageSupports) return [];
        return v.advertisementLanguageSupports
          .filter(
            (als: any) => als.languageSupport?.languageSupportType?.id === 3
          )
          .map((als: any) => als.languageSupport?.language?.name)
          .filter(Boolean);
      },
    }),
    []
  );

  const [selection, setSelection] = useState<{ [key: string]: string }>({});
  const [activeVariationId, setActiveVariationId] = useState<
    string | number | null
  >(null);
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: string[];
  }>({});

  // Seleção automática desativada - usuário deve escolher manualmente as características

  // ✅ Pré-selecionar variação da URL se houver parâmetro ?variation=
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const variationIdFromUrl = urlParams.get("variation");

    if (variationIdFromUrl && variations.length > 0) {
      const targetVariation = variations.find(
        (v) => v.id.toString() === variationIdFromUrl
      );

      if (targetVariation) {
        // Preencher seleção com as características da variação
        const options: { [key: string]: string } = {};
        Object.keys(variationKeyMap).forEach((key) => {
          const getValue = variationKeyMap[key as keyof typeof variationKeyMap];
          if (getValue) {
            const value = getValue(targetVariation);
            if (value) {
              if (Array.isArray(value)) {
                if (value.length > 0) options[key] = value[0];
              } else {
                options[key] = value;
              }
            }
          }
        });
        setSelection(options);
        setActiveVariationId(targetVariation.id);
      }
    }
  }, [location.search, variations, variationKeyMap]);

  useEffect(() => {
    const allAdvertisements = [
      ...(mainAdvertisement ? [mainAdvertisement] : []),
      ...variations,
    ];

    const allExistingOptions: { [key: string]: Set<string> } = {};
    const variationKeys = Object.keys(variationKeyMap);

    variationKeys.forEach((key) => {
      allExistingOptions[key] = new Set<string>();
      allAdvertisements.forEach((ad) => {
        const value =
          variationKeyMap[key as keyof typeof variationKeyMap]?.(ad);
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((item) => item && allExistingOptions[key].add(item));
          } else {
            allExistingOptions[key].add(value);
          }
        }
      });
    });

    const finalOptions: { [key: string]: string[] } = {};
    Object.keys(allExistingOptions).forEach((key) => {
      finalOptions[key] = Array.from(allExistingOptions[key]);
    });

    setDynamicOptions(finalOptions);
  }, [variations, mainAdvertisement, variationKeyMap]);

  const handleSelect = (group: string, value: string) => {
    // Se clicar na opção já selecionada, desmarca apenas essa característica
    if (selection[group] === value) {
      const newSelection = { ...selection };
      delete newSelection[group];
      setSelection(newSelection);

      // Se não sobrou nenhuma seleção, remove a variação ativa
      if (Object.keys(newSelection).length === 0) {
        setActiveVariationId(null);
      } else {
        // Busca uma variação que corresponda às características restantes
        const allAds = [
          ...(mainAdvertisement ? [mainAdvertisement] : []),
          ...variations,
        ];
        const matchingAd = allAds.find((ad) => {
          return Object.keys(newSelection).every((key) => {
            const adValue =
              variationKeyMap[key as keyof typeof variationKeyMap]?.(ad);
            const selectedValue = newSelection[key];
            if (Array.isArray(adValue)) {
              return adValue.includes(selectedValue);
            }
            return adValue === selectedValue;
          });
        });
        setActiveVariationId(matchingAd ? matchingAd.id : null);
      }
      return;
    }

    // Cria a nova seleção com base na seleção atual e na nova opção clicada
    // Apenas atualiza/adiciona a característica específica clicada
    const newSelection = { ...selection, [group]: value };

    const allAds = [
      ...(mainAdvertisement ? [mainAdvertisement] : []),
      ...variations,
    ];

    // Procura por um anúncio que corresponda à nova combinação
    const matchingAd = allAds.find((ad) => {
      return Object.keys(newSelection).every((key) => {
        const adValue =
          variationKeyMap[key as keyof typeof variationKeyMap]?.(ad);
        const selectedValue = newSelection[key];
        if (Array.isArray(adValue)) {
          return adValue.includes(selectedValue);
        }
        return adValue === selectedValue;
      });
    });

    // Atualiza apenas a característica clicada, sem preencher as outras automaticamente
    setSelection(newSelection);
    setActiveVariationId(matchingAd ? matchingAd.id : null);
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

  const selectedVariation = useMemo(() => {
    if (!activeVariationId) {
      return mainAdvertisement;
    }
    const allAds = [
      ...(mainAdvertisement ? [mainAdvertisement] : []),
      ...variations,
    ];
    return (
      allAds.find((ad) => ad.id === activeVariationId) || mainAdvertisement
    );
  }, [activeVariationId, mainAdvertisement, variations]);

  useEffect(() => {
    if (onVariationChange) {
      onVariationChange(selectedVariation);
    }
  }, [selectedVariation, onVariationChange]);

  if (loading) {
    return <div>Carregando...</div>;
  }
  if (error) {
    return <div>Erro: {error}</div>;
  }

  const getDisabledOptionsFor = (group: keyof typeof dynamicOptions) => {
    const availableInAnyVar = dynamicOptions[group] || [];

    // Se há uma opção selecionada neste grupo, desabilita todas as outras opções do mesmo grupo
    if (selection[group]) {
      return availableInAnyVar.filter((opt) => opt !== selection[group]);
    }

    // Se não há nenhuma seleção em nenhuma categoria, todas as opções estão disponíveis
    if (Object.keys(selection).length === 0) {
      return [];
    }

    const allAds = [
      ...(mainAdvertisement ? [mainAdvertisement] : []),
      ...variations,
    ];

    // Encontra variações "compatíveis", que correspondem à seleção atual em todas as outras características.
    const compatibleAds = allAds.filter((ad) => {
      return Object.keys(selection).every((key) => {
        if (key === group) {
          return true; // Ignora a verificação para o grupo atual
        }
        const adValue =
          variationKeyMap[key as keyof typeof variationKeyMap]?.(ad);
        const selectedValue = selection[key];
        if (Array.isArray(adValue)) {
          return adValue.includes(selectedValue);
        }
        return adValue === selectedValue;
      });
    });

    // A partir das variações compatíveis, coleta todas as opções possíveis para o grupo atual.
    const enabledOptions = new Set<string>();
    compatibleAds.forEach((ad) => {
      const value =
        variationKeyMap[group as keyof typeof variationKeyMap]?.(ad);
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((item) => item && enabledOptions.add(item));
        } else {
          enabledOptions.add(value);
        }
      }
    });

    // As opções desabilitadas são todas as que existem, exceto as que foram habilitadas.
    return availableInAnyVar.filter((opt) => !enabledOptions.has(opt));
  };

  const currentAd = selectedVariation;

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Cartuchos disponíveis:
      </h2>

      <OptionsSection
        title="Estado de Preservação"
        options={dynamicOptions.preservation || []}
        selectedValue={selection.preservation || ""}
        onSelect={(value) => handleSelect("preservation", value)}
        disabledOptions={getDisabledOptionsFor("preservation")}
        sectionKey="preservation"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Tipo de cartucho"
        options={dynamicOptions.cartridgeType || []}
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
        options={dynamicOptions.region || []}
        selectedValue={selection.region || ""}
        onSelect={(value) => handleSelect("region", value)}
        disabledOptions={getDisabledOptionsFor("region")}
        sectionKey="region"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Idiomas do Áudio"
        options={dynamicOptions.audioLanguages || []}
        selectedValue={selection.audioLanguages || ""}
        onSelect={(value) => handleSelect("audioLanguages", value)}
        disabledOptions={getDisabledOptionsFor("audioLanguages")}
        sectionKey="audioLanguages"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Idiomas da Legenda"
        options={dynamicOptions.subtitleLanguages || []}
        selectedValue={selection.subtitleLanguages || ""}
        onSelect={(value) => handleSelect("subtitleLanguages", value)}
        disabledOptions={getDisabledOptionsFor("subtitleLanguages")}
        sectionKey="subtitleLanguages"
        expandedSections={expandedSections}
        onToggleExpansion={toggleExpansion}
      />

      <OptionsSection
        title="Idiomas da Interface"
        options={dynamicOptions.interfaceLanguages || []}
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
            disabled={!currentAd || currentAd.availableStock === 0}
          >
            {currentAd &&
            currentAd.availableStock &&
            currentAd.availableStock > 0 ? (
              Array.from({ length: currentAd.availableStock }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Quantidade: {i + 1}
                </option>
              ))
            ) : (
              <option>Sem estoque</option>
            )}
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

const ProductVariationsWrapper: React.FC<ProductVariationsProps> = (props) => {
  return <ProductVariations {...props} />;
};

export default ProductVariationsWrapper;
