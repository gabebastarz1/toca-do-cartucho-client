import React from "react";
import NavigationHistoryBar from "./NavigationHistoryBar";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import SellerInfo from "./SellerInfo";
import ProductDescription from "./ProductDescription";
import ProductVariations from "./ProductVariations";
import ProductCharacteristics from "./ProductCharacteristics";

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

const AdDetails: React.FC = () => {
  return (
    <>
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <NavigationHistoryBar data={mockAdData.navigation} />
      <div className="max-w-7xl mx-auto bg-white font-sans rounded-lg p-4">
        
        {/* Container Principal: Coluna em mobile, linha em telas grandes */}
        <div className="flex flex-col lg:flex-row lg:gap-2">
          
          {/* Coluna Principal de Conteúdo (Esquerda) */}
          <div className="flex-1 flex flex-col gap-2">
            
            {/* Seção Superior: Imagem e Informações do Produto */}
            <div className="flex flex-col md:flex-row md:gap-2">
              {/* Galeria de Imagens */}
              <div className="w-full md:w-2/3">
                <ProductImageGallery data={mockAdData.images} />
              </div>
              
              {/* Informações do Produto (título, preço, etc.) */}
              <div className="w-full md:w-1/3 mt-4 md:mt-0">
                <ProductInfo data={mockAdData} />
              </div>
            </div>

            {/* Informações do Vendedor */}
            <div className="w-full">
              <SellerInfo data={mockAdData.seller} />
            </div>
            
            
          </div>

          {/* Coluna da Direita: Variações do Produto */}
          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <ProductVariations data={mockAdData.variations} />
          </div>
          
        </div>
      </div>
      {/* Descrição do Produto */}
      <div className="w-full">
               <ProductDescription data={mockAdData.description} />
               <ProductCharacteristics />
      </div>

      </div>
    </>
  );
};

export default AdDetails;