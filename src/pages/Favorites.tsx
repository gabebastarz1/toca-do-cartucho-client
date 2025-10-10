import React from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { Star, MapPin } from "lucide-react";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, error } = useFavorites();

  const getConditionColor = (condition: string) => {
    const colors = {
      new: "bg-[#EDECF7] text-[#211C49]",
      "semi-new": "bg-[#EDECF7] text-[#211C49]",
      good: "bg-[#EDECF7] text-[#211C49]",
      normal: "bg-[#EDECF7] text-[#211C49]",
      damaged: "bg-[#EDECF7] text-[#211C49]",
    };
    return (
      colors[condition as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getTypeColor = (type: string) => {
    return type === "retro"
      ? "bg-[#EDECF7] text-[#211C49]"
      : "bg-[#DDDDF3] text-[#211C49]";
  };

  const renderStars = (rating: number) => {
    const validRating = Math.max(0, Math.min(5, rating || 0));
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(validRating)
            ? "text-[#1D1B20] fill-current"
            : "text-[#1D1B20]"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <>
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  if (favorites.length === 0) {
    return (
      <>
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
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
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  return (
    <>
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />

      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da página */}
          <h1 className="text-2xl font-medium text-black mb-8 font-lexend">
            Favoritos
          </h1>

          {/* Lista de produtos favoritos */}
          <div className="space-y-4">
            {favorites.map((advertisement) => (
              <div
                key={advertisement.id}
                className="bg-white shadow-[0px_0px_2px_0px_#b2b2b2] rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagem do produto */}
                  <div className="w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {advertisement.images?.[0]?.url ? (
                      <img
                        src={advertisement.images[0].url}
                        alt={advertisement.title}
                        className="max-w-full max-h-full object-contain bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">
                          Sem imagem
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="flex-1">
                    {/* Título */}
                    <h3 className="text-xl font-normal text-black mb-4 font-lexend">
                      {advertisement.title}
                    </h3>

                    {/* Avaliação */}
                    <div className="flex items-center space-x-1 mb-4">
                      <div className="flex items-center">
                        {renderStars(4.0)}
                      </div>
                      <span className="text-sm text-black font-light">4.0</span>
                      <span className="text-sm text-black font-extralight">
                        (1)
                      </span>
                    </div>

                    {/* Desconto */}
                    <div className="text-[#47884F] text-sm font-light mb-2">
                      xx% OFF
                    </div>

                    {/* Preços */}
                    <div className="mb-4">
                      <span className="text-sm text-[#a1a1a1] line-through mr-2">
                        R$ 100,00
                      </span>
                      <span className="text-lg font-normal text-black">
                        R$ 80,00
                      </span>
                    </div>

                    {/* Etiquetas */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getConditionColor(
                          "semi-new"
                        )}`}
                      >
                        Seminovo
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(
                          "repro"
                        )}`}
                      >
                        REPRÔ
                      </span>
                    </div>

                    {/* Localização */}
                    <div className="flex items-center text-sm text-[#6c6c6c]">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Cidade - Estado</span>
                    </div>
                  </div>

                  {/* Botão de favorito */}
                  <div className="flex justify-end">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <div className="w-3 h-3">
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                        >
                          <path
                            d="M6 10.5L5.25 9.75C2.25 7.05 0 5.25 0 3C0 1.35 1.35 0 3 0C3.9 0 4.8 0.45 5.25 1.2C5.7 0.45 6.6 0 7.5 0C9.15 0 10.5 1.35 10.5 3C10.5 5.25 8.25 7.05 5.25 9.75L6 10.5Z"
                            fill="#211C49"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação (se necessário) */}
          {favorites.length > 10 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg
                  className="w-4 h-4 rotate-90"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 1L15 7.5L8.5 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex gap-2">
                <button className="bg-[#4f43ae] text-white px-3 py-2 rounded-lg text-sm">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                  3
                </button>
                <span className="px-4 py-2 text-sm font-bold">...</span>
                <button className="px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                  09
                </button>
                <button className="px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                  10
                </button>
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg
                  className="w-4 h-4 -rotate-90"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 1L15 7.5L8.5 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer showBackToTopButton={true} />
    </>
  );
};

export default Favorites;
