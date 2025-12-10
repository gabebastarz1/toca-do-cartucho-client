import React from "react";
import TopBar from "../components/TopBar";
import FilterTopBar from "@/components/FilterTopBar";
import Footer from "../components/Footer";
import Head from "../components/Head";
import BottomBar from "@/components/BottomBar";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import ProductGrid from "../components/ProductGrid";
import { AdvertisementDTO, AdvertisementImageDTO } from "../api/types";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, error } = useFavorites();

  // ✅ Garantir que favorites seja sempre um array
  const favoritesList = Array.isArray(favorites) ? favorites : [];

  // ✅ Mapear os favoritos para o formato esperado pelo ProductGrid
  const products = favoritesList.map((advertisement) => {
    // Determinar o tipo de venda (usando mesma lógica do advertisementMapper)
    // A API pode retornar Sale/Trade (maiúsculo) ou sale/trade (minúsculo)
    const ad = advertisement as AdvertisementDTO & {
      Sale?: { price?: number | null };
      Trade?: { [key: string]: unknown } | null;
      IsTrade?: boolean;
      isTrade?: boolean;
    };

    const sale = ad.Sale !== undefined ? ad.Sale : advertisement.sale;
    const trade = ad.Trade !== undefined ? ad.Trade : advertisement.trade;
    const isTrade = ad.IsTrade !== undefined ? ad.IsTrade : ad.isTrade;

    // Verificar se realmente tem venda (precisa ter price válido)
    const hasSale =
      sale !== null &&
      sale !== undefined &&
      sale.price !== null &&
      sale.price !== undefined;
    // Verificar se tem troca (objeto trade existe OU isTrade é true)
    const hasTrade =
      isTrade === true || (trade !== null && trade !== undefined);

    // Determinar o tipo de venda
    let saleType: "sale" | "trade" | "sale-trade" | undefined;
    if (hasSale && hasTrade) {
      saleType = "sale-trade";
    } else if (hasSale) {
      saleType = "sale";
    } else if (hasTrade) {
      saleType = "trade";
    }

    // Obter localização
    const location = advertisement.seller?.addresses?.[0]?.address
      ? `${advertisement.seller.addresses[0].address.city} - ${advertisement.seller.addresses[0].address.state}`
      : "Localização não informada";

    // Mapear condition
    const conditionMap: {
      [key: string]: "new" | "semi-new" | "good" | "normal" | "damaged";
    } = {
      new: "new",
      "semi-new": "semi-new",
      seminovo: "semi-new",
      good: "good",
      bom: "good",
      normal: "normal",
      damaged: "damaged",
      danificado: "damaged",
    };

    const conditionName =
      advertisement.preservationState?.name?.toLowerCase() || "normal";
    const condition = conditionMap[conditionName] || "normal";

    // Mapear type
    const typeName =
      advertisement.cartridgeType?.name?.toLowerCase() || "retro";
    const type: "retro" | "repro" =
      typeName === "repro" || typeName === "reprô" ? "repro" : "retro";

    // ✅ Função para obter URL da imagem (usando mesma lógica do advertisementMapper)
    // Aceita tanto 'images' (minúsculo) quanto 'Images' (maiúsculo) para compatibilidade
    const getImageUrl = (): string => {
      // Tentar acessar images (minúsculo) ou Images (maiúsculo) - API pode retornar em ambos os formatos
      const ad = advertisement as AdvertisementDTO & {
        Images?: AdvertisementImageDTO[];
      };
      const images = ad.images || ad.Images;

      if (images && Array.isArray(images) && images.length > 0) {
        const firstImage = images[0] as AdvertisementImageDTO & {
          PreSignedUrl?: string;
          Url?: string;
        };
        // Priorizar preSignedUrl (minúsculo), depois PreSignedUrl (maiúsculo), depois url (minúsculo), depois Url (maiúsculo)
        // A API pode retornar em diferentes formatos (camelCase ou PascalCase)
        const imageUrl =
          firstImage?.preSignedUrl ||
          firstImage?.PreSignedUrl ||
          firstImage?.url ||
          firstImage?.Url;
        if (imageUrl) {
          return imageUrl;
        }

        // Log temporário para debug - verificar estrutura completa da imagem
        console.log("Imagem encontrada mas URL vazia:", {
          advertisementId: advertisement.id,
          firstImage: firstImage,
          firstImageKeys: Object.keys(firstImage || {}),
          preSignedUrl: firstImage?.preSignedUrl,
          url: firstImage?.url,
          PreSignedUrl: firstImage?.PreSignedUrl,
          Url: firstImage?.Url,
        });
      }
      return ""; // Retorna string vazia se não houver imagem
    };

    const imageUrl = getImageUrl();

    return {
      id: advertisement.id?.toString() || "0",
      title: advertisement.title || "Sem título",
      image: imageUrl,
      rating: 4.0, // Valor padrão, pode ser substituído quando tiver rating real
      reviewCount: 1, // Valor padrão, pode ser substituído quando tiver reviews reais
      originalPrice:
        advertisement.sale?.previousPrice &&
        advertisement.sale.previousPrice > 0
          ? advertisement.sale.previousPrice
          : undefined,
      currentPrice: advertisement.sale?.price || 0,
      discount: advertisement.sale?.discountPercentage
        ? parseFloat(advertisement.sale.discountPercentage)
        : undefined,
      condition,
      type,
      location,
      saleType,
      sellerId: advertisement.seller?.id,
    };
  });

  // ✅ Handler para clique no produto
  const handleProductClick = (productId: string) => {
    const advertisement = favoritesList.find(
      (ad) => ad.id?.toString() === productId
    );

    if (advertisement?.id) {
      navigate(`/anuncio/${advertisement.id}`);
    } else {
      console.error(advertisement);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head title="Favoritos" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#211C49] mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando favoritos...</p>
              </div>
            </div>
          </div>
        </div>
        <BottomBar />
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head title="Favoritos" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Erro ao carregar favoritos
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#38307c] text-white px-6 py-3 rounded-lg hover:bg-[#211C49] transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomBar />
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  if (favoritesList.length === 0) {
    return (
      <>
        <Head title="Favoritos" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhum favorito ainda
                </h2>
                <p className="text-gray-600 mb-6">
                  Os jogos que você marcar como favoritos aparecerão aqui.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#38307c] text-white px-6 py-3 rounded-lg hover:bg-[#211C49] transition-colors"
                >
                  Explorar Jogos
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomBar />
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  return (
    <>
      <Head title="Favoritos" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      <div className="min-h-screen bg-[#f4f3f5] md:pt-20 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da página */}
          <h1 className="text-2xl font-medium text-black mb-8 font-lexend">
            Favoritos ({favoritesList.length})
          </h1>

          {/* Grid de produtos favoritos usando ProductGrid */}
          <ProductGrid
            products={products}
            onProductClick={handleProductClick}
            loading={false}
          />
        </div>
      </div>

      <BottomBar />
      <Footer showBackToTopButton={true} />
    </>
  );
};

export default Favorites;
