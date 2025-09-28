import React from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />

      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Meus Favoritos
            </h1>

            <div className="text-center py-12">
              <div className="text-6xl mb-4">❤️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Nenhum favorito ainda
              </h2>
              <p className="text-gray-600 mb-6">
                Os jogos que você marcar como favoritos aparecerão aqui.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-[#211c49] text-white px-6 py-3 rounded-lg hover:bg-[#38307c] transition-colors"
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
};

export default Favorites;
