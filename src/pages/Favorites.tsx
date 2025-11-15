import React from "react";
import TopBar from "../components/TopBar";
import FilterTopBar from "@/components/FilterTopBar";
import Footer from "../components/Footer";
import Head from "../components/Head";
import BottomBar from "@/components/BottomBar";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import ProductGrid from "../components/ProductGrid";
import { advertisementImageService } from "../services/advertisementImageService";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, error } = useFavorites();

  // ✅ Garantir que favorites seja sempre um array
  const favoritesList = Array.isArray(favorites) ? favorites : [];

  // ✅ Mapear os favoritos para o formato esperado pelo ProductGrid
  const products = favoritesList.map((advertisement) => {
    // Determinar o tipo de venda
    let saleType: "sale" | "trade" | "sale-trade" | undefined;
    if (advertisement.sale && advertisement.trade) {
      saleType = "sale-trade";
    } else if (advertisement.sale) {
      saleType = "sale";
    } else if (advertisement.trade) {
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

    // ✅ Função para obter URL da imagem usando o serviço
    const getImageUrl = (): string => {
      if (advertisement.images && advertisement.images.length > 0) {
        const firstImage = advertisement.images[0];
        // Usar o serviço para obter a URL de exibição correta
        const imageUrl = advertisementImageService.getDisplayUrl(firstImage);
        if (imageUrl) {
          return imageUrl;
        }
      }
      return ""; // Retorna string vazia se não houver imagem
    };

    const imageUrl = getImageUrl();

    // Log para debug

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
    ;

    const advertisement = favoritesList.find(
      (ad) => ad.id?.toString() === productId
    );

    if (advertisement?.id) {
      navigate(`/anuncio/${advertisement.id}`);
    } else {
      console.error(
        
        advertisement
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <Head title="Favoritos" />
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
