import React from "react";
import { AdvertisementDTO } from "../api/types";

interface ProductCharacteristicsProps {
  advertisement?: AdvertisementDTO;
}

const ProductCharacteristics: React.FC<ProductCharacteristicsProps> = ({
  advertisement,
}) => {
  // ✅ Função para extrair dados reais do advertisement
  const getCharacteristics = () => {
    if (!advertisement) {
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
      advertisement.game?.genres
        ?.map((g: any) => g.genre?.name || g.name)
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair temas
    const themes =
      advertisement.game?.themes
        ?.map((t: any) => t.theme?.name || t.name)
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair modos de jogo
    let gameModes = "Não informado";
    if (advertisement.game?.gameGameModes) {
      const modes = advertisement.game.gameGameModes
        .map((gm: any) => gm.gameModes?.name || gm.gameMode?.name || gm.name)
        .filter(Boolean);
      gameModes = modes.length > 0 ? modes.join(", ") : "Não informado";
    }

    // ✅ Extrair franquia
    const franchise =
      advertisement.game?.franchises
        ?.map((f: any) => f.franchise?.name || f.name)
        .filter(Boolean)
        .join(", ") || "Não informado";

    // ✅ Extrair tipo de cartucho
    const cartridgeType = advertisement.cartridgeType?.name || "Não informado";

    // ✅ Extrair estado de preservação
    const preservationState =
      advertisement.preservationState?.name || "Não informado";

    // ✅ Extrair região
    const region =
      advertisement.gameLocalization?.region?.name || "Não informado";

    // ✅ Extrair idiomas do áudio
    const audioLanguages =
      advertisement.advertisementLanguageSupports
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
      advertisement.advertisementLanguageSupports
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
      advertisement.advertisementLanguageSupports
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

  const characteristics = getCharacteristics();

  return (
    <div id="product-characteristics" className="bg-white rounded-lg p-6 ">
      <h2 className="text-xl font-semibold mb-6">Características do produto</h2>
      <div>
        <h3 className="text-lg mb-4">Detalhes técnicos</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden md:w-1/2 w-full">
          {characteristics.map((item, index) => (
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
    </div>
  );
};

export default ProductCharacteristics;
