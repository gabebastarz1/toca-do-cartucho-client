import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import AdDetails from "../components/AdDetails";
import RecommendedProducts from "../components/RecommendedProducts";
// Dados mockados para demonstração
const mockAdvertisement = {
  id: 1,
  title: "Super Mario 64 - Nintendo 64",
  description:
    "Jogo em excelente estado, cartucho original com manual. Funcionando perfeitamente, sem arranhões na carcaça. Inclui caixa original em bom estado.",
  price: 150.0,
  isTrade: true,
  availableStock: 1,
  createdAt: "2024-01-15",
  status: "Ativo",

  // Relacionamentos
  game: {
    id: 1,
    name: "Super Mario 64",
    description: "Plataforma 3D",
    franchise: "Super Mario",
  },
  cartridgeType: {
    id: 1,
    name: "Nintendo 64",
    description: "Cartucho de 32 bits",
  },
  preservationState: { id: 1, name: "Excelente", description: "Como novo" },
  gameLocalization: {
    id: 1,
    region: "NTSC-U",
    description: "Região americana",
  },
  seller: {
    id: "1",
    nickName: "GameCollector",
    email: "collector@email.com",
    firstName: "João",
    lastName: "Silva",
  },
  images: [
    {
      id: 1,
      imageUrl:
        "https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Super+Mario+64+Front",
      advertisementId: 1,
    },
    {
      id: 2,
      imageUrl:
        "https://via.placeholder.com/600x400/059669/FFFFFF?text=Super+Mario+64+Back",
      advertisementId: 1,
    },
    {
      id: 3,
      imageUrl:
        "https://via.placeholder.com/600x400/DC2626/FFFFFF?text=Super+Mario+64+Cartridge",
      advertisementId: 1,
    },
  ],
  languageSupports: [
    { id: 1, language: "Inglês", description: "Idioma principal" },
    { id: 2, language: "Espanhol", description: "Idioma secundário" },
  ],
};

const Advertisement: React.FC = () => {
  

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
          <AdDetails />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendedProducts />
        </div>
          
      </div>

        
      <Footer showBackToTopButton={true} onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
    </>
  );
};

export default Advertisement;
