import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import AdDetails from "../components/AdDetails";
import RecommendedProducts from "../components/RecommendedProducts";
import { AdvertisementDTO } from "../api/types";
import { advertisementService } from "../services/advertisementService";

const Advertisement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advertisement, setAdvertisement] = useState<AdvertisementDTO | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdvertisement = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const ad = await advertisementService.getById(parseInt(id));
        setAdvertisement(ad);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar anúncio";
        setError(errorMessage);
        console.error("Erro ao carregar anúncio:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdvertisement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F3F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando anúncio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F3F5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar anúncio
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar
        logoPosition="left"
        showSearchBar
        searchPlaceholder="Pesquisa na Toca do Cartucho"
        showUserMenu
        userName="Nome Sobrenome"
      />
      <FilterTopBar />
      <div className="min-h-screen bg-[#F4F3F5] py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <AdDetails advertisement={advertisement || undefined} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendedProducts />
        </div>
      </div>

      <Footer
        showBackToTopButton={true}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </>
  );
};

export default Advertisement;
