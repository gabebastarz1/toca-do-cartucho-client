import React from "react";
import { AdvertisementDTO } from "../api/types";

interface ProductCharacteristicsProps {
  advertisement?: AdvertisementDTO;
  selectedVariation?: AdvertisementDTO; // ✅ NOVA: Variação selecionada
}

const ProductCharacteristics: React.FC<ProductCharacteristicsProps> = ({
  advertisement,
  selectedVariation,
}) => {
  // ✅ Função para extrair dados reais do advertisement
  const getCharacteristics = () => {
    // ✅ Usar a variação selecionada se disponível, senão usar o advertisement principal
    const dataSource = selectedVariation || advertisement;

    if (!dataSource) {
      return [
        { label: "Gêneros", value: "Não informado" },
        { label: "Temáticas", value: "Não informado" },
        { label: "Modo de Jogo", value: "Não informado" },
        { label: "Franquia", value: "Não informado" },
        { label: "Tipo de Cartucho", value: "Não informado" },
        { label: "Estado de Preservação", value: "Não informado" },
        { label: "Região", value: "Não informado" },
        { label: "Idiomas do Áudio", value: "Não informado" },
        { label: "Idiomas da Legenda", value: "Não informado" },
        { label: "Idiomas da Interface", value: "Não informado" },
      ];
    }

    // ✅ Extrair gêneros
    const genres =
      dataSource.game?.genres
        ?.map(
          (g: { genre?: { name: string }; name?: string }) =>
            g.genre?.name || g.name
        )
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair temas
    const themes =
      dataSource.game?.themes
        ?.map(
          (t: { theme?: { name: string }; name?: string }) =>
            t.theme?.name || t.name
        )
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair modos de jogo
    let gameModes = "Não informado";
    if (dataSource.game?.gameGameModes) {
      const modes = dataSource.game.gameGameModes
        .map(
          (gm: {
            gameModes?: { name: string };
            gameMode?: { name: string };
            name?: string;
          }) => gm.gameModes?.name || gm.gameMode?.name || gm.name
        )
        .filter(Boolean);
      gameModes = modes.length > 0 ? modes.join(", ") : "Não informado";
    }

    // ✅ Extrair franquia
    const franchise =
      dataSource.game?.franchises
        ?.map(
          (f: { franchise?: { name: string }; name?: string }) =>
            f.franchise?.name || f.name
        )
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair tipo de cartucho
    const cartridgeType = dataSource.cartridgeType?.name || "Não informado";

    // ✅ Extrair estado de preservação
    const preservationState =
      dataSource.preservationState?.name || "Não informado";

    // ✅ Extrair região
    const region = dataSource.gameLocalization?.region?.name || "Não informado";

    // ✅ Extrair idiomas do áudio
    const audioLanguages =
      dataSource.advertisementLanguageSupports
        ?.filter((als: any) => {
          const typeName =
            als.languageSupport?.languageSupportType?.name?.toLowerCase() || "";
          const typeId = als.languageSupport?.languageSupportType?.id;
          return typeId === 1 || typeName.includes("audio");
        })
        .map((als: any) => als.languageSupport?.language?.name)
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair idiomas da legenda
    const subtitleLanguages =
      dataSource.advertisementLanguageSupports
        ?.filter((als: any) => {
          const typeName =
            als.languageSupport?.languageSupportType?.name?.toLowerCase() || "";
          const typeId = als.languageSupport?.languageSupportType?.id;
          return (
            typeId === 2 ||
            typeName.includes("subtitle") ||
            typeName.includes("legenda")
          );
        })
        .map((als: any) => als.languageSupport?.language?.name)
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair idiomas da interface
    const interfaceLanguages =
      dataSource.advertisementLanguageSupports
        ?.filter((als: any) => {
          const typeName =
            als.languageSupport?.languageSupportType?.name?.toLowerCase() || "";
          const typeId = als.languageSupport?.languageSupportType?.id;
          return typeId === 3 || typeName.includes("interface");
        })
        .map((als: any) => als.languageSupport?.language?.name)
        .filter(Boolean)
        .join(", ") || "Não informado";

    return [
      { label: "Gêneros", value: genres },
      { label: "Temáticas", value: themes },
      { label: "Modo de Jogo", value: gameModes },
      { label: "Franquia", value: franchise },
      { label: "Tipo de Cartucho", value: cartridgeType },
      { label: "Estado de Preservação", value: preservationState },
      { label: "Região", value: region },
      { label: "Idiomas do Áudio", value: audioLanguages },
      { label: "Idiomas da Legenda", value: subtitleLanguages },
      { label: "Idiomas da Interface", value: interfaceLanguages },
    ];
  };

  // ✅ Função para extrair condições de troca baseadas nos jogos aceitos
  const getTradeConditions = () => {
    // ✅ Usar a variação selecionada se disponível, senão usar o advertisement principal
    const dataSource = selectedVariation || advertisement;

    if (!dataSource?.trade) {
      return null;
    }

    const trade = dataSource.trade;

    // ✅ Coletar todas as características dos jogos aceitos em troca
    const acceptedGameNames = new Set<string>();
    const allGenres = new Set<string>();
    const allThemes = new Set<string>();
    const allGameModes = new Set<string>();
    const allFranchises = new Set<string>();
    const allCartridgeTypes = new Set<string>();
    const allPreservationStates = new Set<string>();
    const allRegions = new Set<string>();
    const allAudioLanguages = new Set<string>();
    const allSubtitleLanguages = new Set<string>();
    const allInterfaceLanguages = new Set<string>();

    // ✅ Processar jogos aceitos e coletar suas características
    if (trade.acceptedGames && trade.acceptedGames.length > 0) {
      trade.acceptedGames.forEach((ag: any) => {
        const game = ag?.game;
        if (game) {
          // Extrair nome do jogo
          if (game.name) {
            acceptedGameNames.add(game.name);
          }
          // Extrair gêneros dos jogos aceitos
          if (
            game.genres &&
            Array.isArray(game.genres) &&
            game.genres.length > 0
          ) {
            game.genres.forEach((g: any) => {
              const genreName = g?.genre?.name || g?.name;
              if (genreName) allGenres.add(genreName);
            });
          }

          // Extrair temas dos jogos aceitos
          if (
            game.themes &&
            Array.isArray(game.themes) &&
            game.themes.length > 0
          ) {
            game.themes.forEach((t: any) => {
              const themeName = t?.theme?.name || t?.name;
              if (themeName) allThemes.add(themeName);
            });
          }

          // Extrair modos de jogo dos jogos aceitos
          if (
            game.gameGameModes &&
            Array.isArray(game.gameGameModes) &&
            game.gameGameModes.length > 0
          ) {
            game.gameGameModes.forEach((gm: any) => {
              const modeName =
                gm?.gameModes?.name || gm?.gameMode?.name || gm?.name;
              if (modeName) allGameModes.add(modeName);
            });
          }

          // Extrair franquias dos jogos aceitos
          if (
            game.franchises &&
            Array.isArray(game.franchises) &&
            game.franchises.length > 0
          ) {
            game.franchises.forEach((f: any) => {
              const franchiseName = f?.franchise?.name || f?.name;
              if (franchiseName) allFranchises.add(franchiseName);
            });
          }
        }
      });
    }

    // ✅ Processar tipos de cartucho aceitos
    if (
      trade.acceptedCartridgeTypes &&
      Array.isArray(trade.acceptedCartridgeTypes) &&
      trade.acceptedCartridgeTypes.length > 0
    ) {
      trade.acceptedCartridgeTypes.forEach((act: any) => {
        const cartridgeTypeName = act?.cartridgeType?.name || act?.name;
        if (cartridgeTypeName) allCartridgeTypes.add(cartridgeTypeName);
      });
    }

    // ✅ Processar estados de preservação aceitos
    if (
      trade.acceptedPreservationStates &&
      Array.isArray(trade.acceptedPreservationStates) &&
      trade.acceptedPreservationStates.length > 0
    ) {
      trade.acceptedPreservationStates.forEach((aps: any) => {
        const preservationStateName = aps?.preservationState?.name || aps?.name;
        if (preservationStateName)
          allPreservationStates.add(preservationStateName);
      });
    }

    // ✅ Processar regiões aceitas
    if (
      trade.acceptedRegions &&
      Array.isArray(trade.acceptedRegions) &&
      trade.acceptedRegions.length > 0
    ) {
      trade.acceptedRegions.forEach((ar: any) => {
        const regionName = ar?.region?.name || ar?.name;
        if (regionName) allRegions.add(regionName);
      });
    }

    // ✅ Processar idiomas aceitos
    if (
      trade.acceptedLanguageSupports &&
      Array.isArray(trade.acceptedLanguageSupports) &&
      trade.acceptedLanguageSupports.length > 0
    ) {
      trade.acceptedLanguageSupports.forEach((als: any) => {
        const languageName = als?.languageSupport?.language?.name;
        const typeName =
          als?.languageSupport?.languageSupportType?.name?.toLowerCase() || "";
        const typeId = als?.languageSupport?.languageSupportType?.id;

        if (languageName) {
          if (typeId === 1 || typeName.includes("audio")) {
            allAudioLanguages.add(languageName);
          } else if (
            typeId === 2 ||
            typeName.includes("subtitle") ||
            typeName.includes("legenda")
          ) {
            allSubtitleLanguages.add(languageName);
          } else if (typeId === 3 || typeName.includes("interface")) {
            allInterfaceLanguages.add(languageName);
          }
        }
      });
    }

    // ✅ Construir valores finais baseados nos dados coletados
    const acceptedGameNamesStr =
      acceptedGameNames.size > 0
        ? Array.from(acceptedGameNames).join(", ")
        : "Não especificado";
    const acceptedGenres =
      allGenres.size > 0
        ? Array.from(allGenres).join(", ")
        : "Não especificado";
    const acceptedThemes =
      allThemes.size > 0
        ? Array.from(allThemes).join(", ")
        : "Não especificado";
    const acceptedGameModes =
      allGameModes.size > 0
        ? Array.from(allGameModes).join(", ")
        : "Não especificado";
    const acceptedFranchises =
      allFranchises.size > 0
        ? Array.from(allFranchises).join(", ")
        : "Não especificado";
    const acceptedCartridgeTypes =
      allCartridgeTypes.size > 0
        ? Array.from(allCartridgeTypes).join(", ")
        : "Não especificado";
    const acceptedPreservationStates =
      allPreservationStates.size > 0
        ? Array.from(allPreservationStates).join(", ")
        : "Não especificado";
    const acceptedRegions =
      allRegions.size > 0
        ? Array.from(allRegions).join(", ")
        : "Não especificado";
    const acceptedAudioLanguages =
      allAudioLanguages.size > 0
        ? Array.from(allAudioLanguages).join(", ")
        : "Não especificado";
    const acceptedSubtitleLanguages =
      allSubtitleLanguages.size > 0
        ? Array.from(allSubtitleLanguages).join(", ")
        : "Não especificado";
    const acceptedInterfaceLanguages =
      allInterfaceLanguages.size > 0
        ? Array.from(allInterfaceLanguages).join(", ")
        : "Não especificado";

    return [
      { label: "Jogo", value: acceptedGameNamesStr },
      { label: "Gêneros", value: acceptedGenres },
      { label: "Temáticas", value: acceptedThemes },
      { label: "Modo de Jogo", value: acceptedGameModes },
      { label: "Franquia", value: acceptedFranchises },
      { label: "Tipo de Cartucho", value: acceptedCartridgeTypes },
      { label: "Estado de Preservação", value: acceptedPreservationStates },
      { label: "Região", value: acceptedRegions },
      { label: "Idiomas do Áudio", value: acceptedAudioLanguages },
      { label: "Idiomas da Legenda", value: acceptedSubtitleLanguages },
      { label: "Idiomas da Interface", value: acceptedInterfaceLanguages },
    ];
  };

  // ✅ Função para determinar o tipo de anúncio
  const getAdvertisementType = () => {
    const dataSource = selectedVariation || advertisement;
    if (!dataSource) return "Não informado";

    const hasSale = !!dataSource.sale;
    const hasTrade = !!dataSource.trade;

    if (hasSale && hasTrade) {
      return "Venda e Troca";
    } else if (hasSale) {
      return "Venda";
    } else if (hasTrade) {
      return "Troca";
    }

    return "Não informado";
  };

  const characteristics = getCharacteristics();
  const tradeConditions = getTradeConditions();
  const advertisementType = getAdvertisementType();

  return (
    <div id="product-characteristics" className="bg-white rounded-lg p-6 ">
      <h2 className="text-xl font-semibold mb-6">
        Características do produto
        {selectedVariation && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            (Variação selecionada)
          </span>
        )}
      </h2>

      {/* Seção com duas tabelas lado a lado */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Detalhes técnicos */}
        <div className="flex-1">
          <h3 className="text-lg mb-4">Detalhes técnicos</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            {characteristics.map((item, index) => (
              <div
                key={item.label}
                className={`flex p-4 py-2 ${
                  index % 2 !== 0 ? "bg-white " : "bg-gray-100"
                }`}
              >
                <div className="w-1/2 font-semibold text-gray-800">
                  {item.label}:
                </div>
                <div className="w-1/2 text-gray-600">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Condições de Troca */}
        {tradeConditions && (
          <div className="flex-1">
            <h3 className="text-lg mb-4">Condições de Troca</h3>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              {tradeConditions.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex p-4 py-2 ${
                    index % 2 !== 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="w-1/2 font-semibold text-gray-800">
                    {item.label}:
                  </div>
                  <div className="w-1/2 text-gray-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="mt-6 w-1/2">
        <h3 className="text-lg mb-4">Informações Adicionais</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="flex p-4 py-2 bg-white">
            <div className="w-1/2 font-semibold text-gray-800">Condições:</div>
            <div className="w-1/2 text-gray-600">{advertisementType}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCharacteristics;
