import React, { useState } from "react";
import { useParams } from "react-router-dom";

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

const AdvertisementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [advertisement] = useState(mockAdvertisement); // Usando dados mockados

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-gray-500 ml-1 md:ml-2">
                  Anúncio #{id}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Imagens */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img
                  src={advertisement.images[selectedImage].imageUrl}
                  alt={advertisement.title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Thumbnails */}
              {advertisement.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {advertisement.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg transition-all ${
                        selectedImage === index
                          ? "ring-2 ring-blue-500 scale-105"
                          : "hover:scale-105"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${advertisement.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {advertisement.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {advertisement.description}
                </p>
              </div>

              {/* Preço */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                {advertisement.price ? (
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-600">
                      R$ {advertisement.price.toFixed(2)}
                    </span>
                    <p className="text-gray-500 mt-1">Preço</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">
                      Aceita Troca
                    </span>
                    <p className="text-gray-500 mt-1">Modalidade</p>
                  </div>
                )}
              </div>

              {/* Detalhes do Jogo */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Detalhes do Jogo
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block mb-1">
                      Jogo
                    </span>
                    <p className="font-medium text-gray-900">
                      {advertisement.game.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block mb-1">
                      Categoria
                    </span>
                    <p className="font-medium text-gray-900">
                      {advertisement.cartridgeType.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block mb-1">
                      Estado
                    </span>
                    <p className="font-medium text-gray-900">
                      {advertisement.preservationState.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block mb-1">
                      Estoque
                    </span>
                    <p className="font-medium text-gray-900">
                      {advertisement.availableStock} unidade
                    </p>
                  </div>
                </div>
              </div>

              {/* Localização */}
              {advertisement.gameLocalization && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500 block mb-1">
                    Região
                  </span>
                  <p className="font-medium text-gray-900">
                    {advertisement.gameLocalization.region}
                  </p>
                </div>
              )}

              {/* Suporte de Idiomas */}
              {advertisement.languageSupports &&
                advertisement.languageSupports.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500 block mb-1">
                      Idiomas Suportados
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {advertisement.languageSupports.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                        >
                          {lang.language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Ações */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                  Entrar em Contato
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  ❤️ Adicionar aos Favoritos
                </button>
                <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium">
                  📤 Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Vendedor */}
        {advertisement.seller && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Sobre o Vendedor
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {advertisement.seller.nickName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-lg">
                  {advertisement.seller.nickName}
                </p>
                <p className="text-sm text-gray-500">Membro desde 2024</p>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    4.9 (127 avaliações)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementDetail;
