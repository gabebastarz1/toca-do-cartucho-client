import React from "react";
import { AdvertisementDTO } from "../api/types";

interface WhatsAppLinkProps {
  mainAdvertisement?: AdvertisementDTO;
  selectedVariation?: AdvertisementDTO;
  selection?: { [key: string]: string };
  quantity?: number;
}

const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({
  mainAdvertisement,
  selectedVariation,
  selection = {},
  quantity = 1,
}) => {
  // Função para gerar a mensagem personalizada
  const generateWhatsAppMessage = () => {
    if (!mainAdvertisement) return "";

    const gameName =
      mainAdvertisement.game?.name || mainAdvertisement.title || "Produto";
    const price =
      selectedVariation?.sale?.price || mainAdvertisement.sale?.price || 0;
    const sellerName = mainAdvertisement.seller?.firstName || "Vendedor";

    // Construir detalhes da variação selecionada
    const variationDetails = [];

    if (selection.preservation) {
      variationDetails.push(`Estado: ${selection.preservation}`);
    }

    if (selection.cartridgeType) {
      variationDetails.push(`Tipo: ${selection.cartridgeType}`);
    }

    if (selection.region) {
      variationDetails.push(`Região: ${selection.region}`);
    }

    if (selection.audioLanguages) {
      const audioValue = Array.isArray(selection.audioLanguages)
        ? selection.audioLanguages.join(", ")
        : selection.audioLanguages;
      if (audioValue) {
        variationDetails.push(`Áudio: ${audioValue}`);
      }
    }

    if (selection.subtitleLanguages) {
      const subtitleValue = Array.isArray(selection.subtitleLanguages)
        ? selection.subtitleLanguages.join(", ")
        : selection.subtitleLanguages;
      if (subtitleValue) {
        variationDetails.push(`Legendas: ${subtitleValue}`);
      }
    }

    if (selection.interfaceLanguages) {
      const interfaceValue = Array.isArray(selection.interfaceLanguages)
        ? selection.interfaceLanguages.join(", ")
        : selection.interfaceLanguages;
      if (interfaceValue) {
        variationDetails.push(`Interface: ${interfaceValue}`);
      }
    }

    const detailsText =
      variationDetails.length > 0
        ? `\n\nDetalhes da variação:\n${variationDetails.join("\n")}`
        : "";

    // Mensagem base
    const message = `Olá ${sellerName}! 

Tenho interesse no jogo *${gameName}* que você está anunciando com as seguintes características:
${detailsText}
${quantity > 1 ? `Quantidade: ${quantity} unidades\n` : ""}Preço: R$ ${price
      .toFixed(2)
      .replace(".", ",")}

Gostaria de saber mais informações sobre disponibilidade e condições de pagamento.

Obrigado!`;

    return message;
  };

  // Função para gerar o link do WhatsApp
  const generateWhatsAppLink = () => {
    if (!mainAdvertisement?.seller?.phoneNumber) {
      console.warn("Número do WhatsApp não disponível para este vendedor");
      return "#";
    }

    const message = generateWhatsAppMessage();
    const phoneNumber = mainAdvertisement.seller.phoneNumber.replace(/\D/g, ""); // Remove caracteres não numéricos

    // Formato do WhatsApp: https://wa.me/5511999999999?text=mensagem
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/55${phoneNumber}?text=${encodedMessage}`;
  };

  const handleWhatsAppClick = () => {
    const link = generateWhatsAppLink();
    if (link !== "#") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const isWhatsAppAvailable = mainAdvertisement?.seller?.phoneNumber;

  return (
    <button
      onClick={handleWhatsAppClick}
      disabled={!isWhatsAppAvailable}
      className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ${
        isWhatsAppAvailable
          ? "border border-[#2B2560] bg-[#483d9e] text-white hover:bg-[#2B2560] cursor-pointer"
          : "border border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Comprar pelo WhatsApp
    </button>
  );
};

export default WhatsAppLink;
