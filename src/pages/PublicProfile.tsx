import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import TopBar from "../components/TopBar";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import ProductCard from "../components/ProductCard";
import { UserDTO, AdvertisementDTO } from "../api/types";
import { api } from "../services/api";
import { advertisementService } from "../services/advertisementService";
import {
  sellerRatingsService,
  SellerRatingDTO,
} from "../services/sellerRatingsService";

type TabType = "anuncios" | "avaliacoes" | "contato";

const PublicProfile: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("anuncios");
  const [advertisements, setAdvertisements] = useState<AdvertisementDTO[]>([]);
  const [ratings, setRatings] = useState<SellerRatingDTO[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOVO: Estado para armazenar a distribuição das avaliações
  const [ratingsDistribution, setRatingsDistribution] = useState<{
    [key: number]: number;
  }>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!identifier) return;

      try {
        setLoading(true);
        setError(null);

        // Tentar buscar usuário por ID
        let response;
        try {
          response = await api.get(`/api/users/${identifier}`);
        } catch {
          // Se falhar, tentar por slug
          response = await api.get(`/api/users/slug/${identifier}`);
        }

        const userData = response.data;
        setUser(userData);

        // Buscar anúncios do usuário
        if (userData?.id) {
          const adsResponse = await advertisementService.getAll({
            sellerIds: [userData.id],
          });
          setAdvertisements(adsResponse.advertisements || []);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil do usuário:", err);
        setError("Usuário não encontrado");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [identifier]);

  // Buscar avaliações quando a tab for ativada
  useEffect(() => {
    const loadRatings = async () => {
      if (!user?.id || activeTab !== "avaliacoes") return;

      try {
        setLoadingRatings(true);
        const response = await sellerRatingsService.getSellerRatings(user.id);
        setRatings(response.ratings || []);
        setAverageRating(response.averageRating || 0);
        setTotalRatings(response.totalRatings || 0);
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
      } finally {
        setLoadingRatings(false);
      }
    };

    loadRatings();
  }, [user?.id, activeTab]);

  // NOVO: useEffect para calcular a distribuição das avaliações
  useEffect(() => {
    if (ratings.length === 0) {
      setRatingsDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      return;
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach((rating) => {
      // Converte a nota 0-10 para 1-5, arredondando
      // (ex: 10 e 9 -> 5 estrelas; 8 e 7 -> 4 estrelas, etc.)
      const normalized = Math.round(rating.rating / 2);
      if (normalized >= 1 && normalized <= 5) {
        distribution[normalized]++;
      }
    });

    setRatingsDistribution(distribution);
  }, [ratings]);

  const handleProductClick = (
    productId: string,
    parentAdvertisementId?: number
  ) => {
    if (parentAdvertisementId) {
      navigate(`/anuncio/${parentAdvertisementId}?variation=${productId}`);
    } else {
      navigate(`/anuncio/${productId}`);
    }
  };

  // Função para renderizar estrelas ROXAS com suporte a meia estrela
  const renderPurpleStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Estrela completa
        stars.push(
          <Star key={i} className="w-5 h-5 text-[#4f43ae] fill-[#4f43ae]" />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Meia estrela (usando SVG com clip-path)
        stars.push(
          <div key={i} className="relative w-5 h-5">
            {/* Estrela vazia (fundo) */}
            <Star className="absolute w-5 h-5 text-gray-300" />
            {/* Estrela preenchida pela metade */}
            <div
              className="absolute w-5 h-5 overflow-hidden"
              style={{ width: "50%" }}
            >
              <Star className="w-5 h-5 text-[#4f43ae] fill-[#4f43ae]" />
            </div>
          </div>
        );
      } else {
        // Estrela vazia
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }

    return stars;
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Head title="Perfil do Usuário" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4f43ae] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        </div>
        <Footer
          showBackToTopButton={true}
          onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <BottomBar />
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Head title="Perfil não encontrado" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Perfil não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "O usuário que você procura não existe."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-[#4f43ae] text-white rounded-lg hover:bg-[#3d3487] transition-colors"
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
        <Footer
          showBackToTopButton={true}
          onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <BottomBar />
      </>
    );
  }

  const displayName = user.nickName || user.email || "Usuário";

  // Mapear anúncios para ProductCard
  const products = advertisements.map((ad) => {
    // Determinar o tipo de venda
    let saleType: "sale" | "trade" | "sale-trade" | undefined;
    const hasSale =
      ad.sale && ad.sale.price !== null && ad.sale.price !== undefined;
    const hasTrade = ad.trade !== null && ad.trade !== undefined;

    if (hasSale && hasTrade) {
      saleType = "sale-trade";
    } else if (hasSale) {
      saleType = "sale";
    } else if (hasTrade) {
      saleType = "trade";
    }

    // Mapear condição
    const preservationStateName =
      ad.preservationState?.name?.toLowerCase() || "normal";
    let condition: "new" | "semi-new" | "good" | "normal" | "damaged" =
      "normal";
    if (
      preservationStateName.includes("novo") ||
      preservationStateName.includes("lacrado")
    ) {
      condition = "new";
    } else if (preservationStateName.includes("seminovo")) {
      condition = "semi-new";
    } else if (preservationStateName.includes("bom")) {
      condition = "good";
    } else if (preservationStateName.includes("danificado")) {
      condition = "damaged";
    }

    // Mapear localização
    const city = ad.seller?.addresses?.[0]?.address?.city || "";
    const state = ad.seller?.addresses?.[0]?.address?.state || "";
    const location =
      city && state ? `${city} - ${state}` : "Localização não informada";

    // Mapear tipo de cartucho
    const typeName = ad.cartridgeType?.name?.toLowerCase() || "retro";
    const type: "retro" | "repro" =
      typeName === "repro" || typeName === "reprô" ? "repro" : "retro";

    const imageUrl = ad.images?.[0]?.preSignedUrl || ad.images?.[0]?.url || "";

    return {
      id: ad.id?.toString() || "0",
      title: ad.title || "Sem título",
      image: imageUrl,
      rating: 4.0,
      reviewCount: 1,
      originalPrice:
        ad.sale?.previousPrice && ad.sale.previousPrice > 0
          ? ad.sale.previousPrice
          : undefined,
      currentPrice: ad.sale?.price || 0,
      discount: ad.sale?.discountPercentage
        ? parseFloat(ad.sale.discountPercentage)
        : undefined,
      condition,
      type,
      location,
      saleType,
      sellerId: ad.seller?.id,
      parentAdvertisementId: ad.parentAdvertisementId,
    };
  });

  // NOVO: Arredondar a nota média para destacar a barra correta
  const roundedAverageRating = Math.round(averageRating);

  return (
    <>
      <Head title={`Perfil de ${displayName}`} />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      <main className="bg-[#f4f3f5] min-h-screen py-6 px-4 md:px-8 font-lexend">
        <div className="max-w-7xl mx-auto">
          {/* Nome do usuário com foto */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Foto do perfil */}
            <div className="w-5 h-5 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
              {user.profileImage?.preSignedUrl ? (
                <img
                  src={user.profileImage.preSignedUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#4f43ae] to-[#38307C] flex items-center justify-center">
                  <span className="text-white text-2xl md:text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Nome do usuário */}
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {displayName}
            </h1>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-300 mb-6">
            <div className="flex justify-center gap-8">
              <button
                onClick={() => setActiveTab("anuncios")}
                className={`pb-3 px-4 text-base font-medium transition-colors relative ${
                  activeTab === "anuncios"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Anúncios
                {activeTab === "anuncios" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("avaliacoes")}
                className={`pb-3 px-4 text-base font-medium transition-colors relative ${
                  activeTab === "avaliacoes"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Avaliações
                {activeTab === "avaliacoes" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("contato")}
                className={`pb-3 px-4 text-base font-medium transition-colors relative ${
                  activeTab === "contato"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contato
                {activeTab === "contato" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            </div>
          </div>

          {/* Conteúdo das tabs */}
          <div className="mt-6">
            {activeTab === "anuncios" && (
              <div>
                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">
                      Este usuário ainda não possui anúncios
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
                        onClick={() =>
                          handleProductClick(
                            product.id,
                            product.parentAdvertisementId
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "avaliacoes" && (
              <div>
                {loadingRatings ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f43ae]"></div>
                  </div>
                ) : ratings.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">
                      Este usuário ainda não possui avaliações
                    </p>
                  </div>
                ) : (
                  // NOVO LAYOUT DE GRID
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Avaliações do Vendedor
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Coluna Esquerda: Resumo e Barras */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-3">
                          {/* Nota Média */}
                          <div className="text-6xl font-bold text-[#4f43ae]">
                            {averageRating.toFixed(1)}
                          </div>
                          {/* Estrelas e Total */}
                          <div>
                            <div className="flex">
                              {/* Estrelas Roxas com suporte a meia estrela */}
                              {renderPurpleStars(averageRating)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {totalRatings}{" "}
                              {totalRatings === 1 ? "avaliação" : "avaliações"}
                            </div>
                          </div>
                        </div>

                        {/* Gráfico de Barras */}
                        <div className="space-y-3 mt-6">
                          {[5, 4, 3, 2, 1].map((starLevel) => {
                            const count = ratingsDistribution[starLevel] || 0;
                            const percentage =
                              totalRatings > 0
                                ? (count / totalRatings) * 100
                                : 0;
                            const isHighlighted =
                              starLevel === roundedAverageRating;

                            return (
                              <div
                                key={starLevel}
                                className="flex items-center gap-3"
                              >
                                {/* Número da estrela */}
                                <div className="flex items-center gap-1 w-12">
                                  <span className="text-sm font-medium text-gray-700">
                                    {starLevel}
                                  </span>
                                  <Star className="w-3 h-3 text-gray-400" />
                                </div>

                                {/* Track da barra (fundo) */}
                                <div
                                  className={`flex-1 rounded-full transition-all ${
                                    isHighlighted
                                      ? "h-3 bg-gray-200"
                                      : "h-2 bg-gray-200"
                                  }`}
                                >
                                  {/* Barra de progresso */}
                                  <div
                                    className={`rounded-full transition-all ${
                                      isHighlighted
                                        ? "h-3 bg-[#4f43ae]" // Barra roxa e grossa
                                        : "h-2 bg-gray-400" // Barra cinza e fina
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>

                                {/* Contador de avaliações */}
                                <span className="text-sm text-gray-500 w-8 text-right">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Coluna Direita: Lista de Avaliações */}
                      <div className="lg:col-span-2 space-y-4">
                        {ratings.map((rating) => (
                          <div
                            key={rating.id}
                            className="bg-white rounded-lg shadow-sm p-6"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {/* Estrelas Roxas com suporte a meia estrela */}
                                  {renderPurpleStars(rating.rating / 2)}
                                  <span className="text-sm text-gray-600">
                                    {(rating.rating / 2).toFixed(1)}
                                  </span>
                                </div>
                                {rating.title && (
                                  <h3 className="font-semibold text-gray-900 mb-2">
                                    {rating.title}
                                  </h3>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(rating.createdAt)}
                              </div>
                            </div>
                            {rating.description && (
                              <p className="text-gray-700 leading-relaxed">
                                {rating.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "contato" && (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">
                  🔨 Seção de contato em construção
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        showBackToTopButton={true}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <BottomBar />
    </>
  );
};

export default PublicProfile;
