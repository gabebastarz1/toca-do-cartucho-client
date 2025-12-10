import React, { useMemo, useState } from "react";
import NavigationHistoryBar from "./NavigationHistoryBar";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import SellerInfo from "./SellerInfo";
import ProductDescription from "./ProductDescription";
import ProductVariations from "./ProductVariations";
import ProductCharacteristics from "./ProductCharacteristics";
import { AdvertisementDTO, AdvertisementImageDTO } from "../api/types";

interface AdDetailsProps {
  advertisement?: AdvertisementDTO;
}

// Dados mockados (sem alterações)
const mockAdData = {
  id: 1,
  title: "Cartucho Super Mario World - Usado - Vendo ou Troco",
  price: 89.99,
  originalPrice: 120.0,
  discount: 25,
  rating: 4.2,
  reviewCount: 13,
  seller: {
    name: "GameCollectorBR",
    avatar: "👤",
    rating: 4.8,
    memberSince: "2023",
  },
  images: {
    main: "https://placehold.co/400x300/4F46E5/FFFFFF?text=Super+Mario+World",
    thumbnails: [
      "https://placehold.co/80x60/4F46E5/FFFFFF?text=Front",
      "https://placehold.co/80x60/059669/FFFFFF?text=Back",
      "https://placehold.co/80x60/DC2626/FFFFFF?text=Cartridge",
      "https://placehold.co/80x60/7C3AED/FFFFFF?text=Box",
      "https://placehold.co/80x60/F59E0B/FFFFFF?text=Manual",
      "https://placehold.co/80x60/EF4444/FFFFFF?text=Gameplay",
    ],
  },
  productInfo: {
    genres: ["Ação", "Aventura", "Plataforma"],
    themes: ["Fantasia", "Reinos"],
    gameModes: ["Um jogador"],
    preservationState: "Bom",
    preservationDescription: "Pequenas marcas de uso",
    cartridgeType: "Repro",
    region: "Europa",
  },
  description: `Olá, fã do clássico Super Nintendo (SNES)!

Temos à disposição uma ampla variedade de cartuchos para Super Nintendo, todos com chips originais da Nintendo, conforme ilustrado nas fotos do anúncio. Os cartuchos foram reprogramados e contam com a função de salvamento de progresso funcionando perfeitamente.

Não perca a oportunidade de reviver momentos nostálgicos inesquecíveis! Estamos a disposição para esclarecer quaisquer dúvidas.

Boa compra!

Produto sem garantia.`,
  variations: {
    preservation: ["Novo", "Seminovo", "Bom"],
    cartridgeType: ["Normal", "Danificado", "Repro"],
    region: ["Australia", "Brasil", "Europe", "North America", "Korea"],
    audioLanguages: ["Inglês", "Português BR", "Japonês"],
    interfaceLanguages: ["Inglês", "Português BR", "Japonês"],
    stock: 3,
  },
  navigation: {
    breadcrumbs: [
      "Voltar",
      "Plataforma",
      "Ação",
      "Usado",
      "Repro",
      "Super Mario World",
    ],
  },
};

const AdDetails: React.FC<AdDetailsProps> = ({ advertisement }) => {
  // Usar dados reais se disponíveis, senão usar mock compatível
  const adData = advertisement;

  // ✅ NOVO: Estado para a variação selecionada
  const [selectedVariation, setSelectedVariation] = useState<
    AdvertisementDTO | undefined
  >(undefined);

  // ✅ NOVO: Callback para quando uma variação for selecionada
  const handleVariationChange = (variation: AdvertisementDTO | undefined) => {
    setSelectedVariation(variation);
  };

  // ✅ NOVO: Coletar todas as imagens do anúncio principal e suas variações
  const allImages = useMemo(() => {
    if (!adData) return [];

    const images: AdvertisementImageDTO[] = [];

    // Adicionar imagens do anúncio principal
    if (adData.images && Array.isArray(adData.images)) {
      images.push(...adData.images);
    }

    // Adicionar imagens das variações
    if (adData.variations && Array.isArray(adData.variations)) {
      adData.variations.forEach((variation) => {
        if (variation.images && Array.isArray(variation.images)) {
          images.push(...variation.images);
        }
      });
    }

    //console.log("=== ALL IMAGES COLLECTED ===");
    // console.log("Main ad images:", adData.images?.length || 0);
    /*console.log(
      "Variation images:",
      adData.variations?.reduce(
        (total, v) => total + (v.images?.length || 0),
        0
      ) || 0
    );*/
    //console.log("Total images:", images.length);
    //console.log("===========================");

    return images;
  }, [adData]);

  // Criar breadcrumb dinâmico baseado no anúncio
  const createBreadcrumb = () => {
    if (adData) {
      const breadcrumbs = ["Voltar"];
      const breadcrumbData: Array<{
        text: string;
        type:
          | "genre"
          | "theme"
          | "preservation"
          | "cartridgeType"
          | "game"
          | "back"
          | "platform";
        id?: string | number;
      }> = [{ text: "Voltar", type: "back" }];

      // console.log("=== CREATING BREADCRUMB ===");
      // console.log("adData:", adData);
      // console.log("adData.game:", adData.game);
      // console.log("adData.game?.genres:", adData.game?.genres);
      // console.log("adData.preservationState:", adData.preservationState);
      // console.log("adData.cartridgeType:", adData.cartridgeType);

      // Adicionar plataforma do jogo se disponível
      if (adData.game?.name) {
        breadcrumbs.push("Plataforma");
        breadcrumbData.push({ text: "Plataforma", type: "platform" });
        // console.log("Added Plataforma");
      }

      // Adicionar gêneros se disponível
      if (adData.game?.genres && adData.game.genres.length > 0) {
        const genreData = adData.game.genres[0];
        // Baseado no log, o gênero está em genreData.genre
        const genre = (
          genreData as unknown as { genre: { id: number; name: string } }
        ).genre;
        breadcrumbs.push(genre.name);
        breadcrumbData.push({
          text: genre.name,
          type: "genre",
          id: genre.id,
        });
        // console.log("Added genre:", genre.name);
      } else {
        // console.log("No genres found for game");
      }

      // Adicionar estado de preservação
      if (adData.preservationState?.name) {
        breadcrumbs.push(adData.preservationState.name);
        breadcrumbData.push({
          text: adData.preservationState.name,
          type: "preservation",
          id: adData.preservationState.id,
        });
        // console.log("Added preservation:", adData.preservationState.name);
      } else {
        // console.log("No preservation state found");
      }

      // Adicionar tipo de cartucho
      if (adData.cartridgeType?.name) {
        breadcrumbs.push(adData.cartridgeType.name);
        breadcrumbData.push({
          text: adData.cartridgeType.name,
          type: "cartridgeType",
          id: adData.cartridgeType.id,
        });
        // console.log("Added cartridge type:", adData.cartridgeType.name);
      } else {
        // console.log("No cartridge type found");
      }

      // Adicionar nome do jogo
      if (adData.game?.name) {
        breadcrumbs.push(adData.game.name);
        breadcrumbData.push({
          text: adData.game.name,
          type: "game",
          id: adData.game.id,
        });
        // console.log("Added game:", adData.game.name);
      } else {
        // Extrair nome do jogo do título se não estiver disponível
        const title = adData.title || "";
        const gameName = title.split(" - ")[0] || title;
        breadcrumbs.push(gameName);
        breadcrumbData.push({
          text: gameName,
          type: "game",
        });
        // console.log("Added game from title:", gameName);
      }

      // console.log("Final breadcrumbs:", breadcrumbs);
      // console.log("Final breadcrumbData:", breadcrumbData);
      // console.log("=== BREADCRUMB CREATION COMPLETED ===");

      return { breadcrumbs, breadcrumbData };
    }
    return mockAdData.navigation;
  };

  const navigationData = createBreadcrumb();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block">
          <NavigationHistoryBar data={navigationData} />
        </div>

        <div className="max-w-7xl mx-auto bg-white font-sans rounded-lg p-4">
          {/* Container Principal: Coluna em mobile, linha em telas grandes */}
          <div className="flex flex-col lg:flex-row lg:gap-2">
            {/* Coluna Principal de Conteúdo (Esquerda) */}
            <div className="flex-1 flex flex-col gap-2">
              {/* Seção Superior: Imagem e Informações do Produto */}
              <div className="flex flex-col md:flex-row md:gap-2">
                {/* Galeria de Imagens */}
                <div className="w-full md:w-2/3">
                  <ProductImageGallery images={allImages} />
                </div>

                {/* Informações do Produto (título, preço, etc.) */}
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <ProductInfo
                    advertisement={adData}
                    selectedVariation={selectedVariation}
                  />
                </div>
              </div>

              {/* Informações do Vendedor */}
              <div className="w-full">
                <SellerInfo advertisement={adData} />
              </div>
            </div>

            {/* Coluna da Direita: Variações do Produto */}
            <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
              <ProductVariations
                variations={
                  Array.isArray(adData.variations) ? adData.variations : []
                }
                mainAdvertisement={adData}
                onVariationChange={handleVariationChange}
              />
            </div>
          </div>
        </div>
        {/* Descrição do Produto */}
        <div className="w-full">
          <ProductDescription advertisement={adData} />
          <ProductCharacteristics
            advertisement={adData}
            selectedVariation={selectedVariation}
          />
        </div>
      </div>
    </>
  );
};

export default AdDetails;
