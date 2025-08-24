import React, { useState } from "react";

// Dados mockados para demonstração
const mockAdvertisements = [
  {
    id: 1,
    title: "Super Mario 64 - Nintendo 64",
    description: "Jogo em excelente estado, cartucho original",
    price: 150.0,
    isTrade: false,
    game: "Super Mario 64",
    category: "Nintendo 64",
    image:
      "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Super+Mario+64",
  },
  {
    id: 2,
    title: "The Legend of Zelda: Ocarina of Time",
    description: "Cartucho funcionando perfeitamente",
    price: null,
    isTrade: true,
    game: "The Legend of Zelda",
    category: "Nintendo 64",
    image: "https://via.placeholder.com/300x200/059669/FFFFFF?text=Zelda+OOT",
  },
  {
    id: 3,
    title: "Pokemon Red - Game Boy",
    description: "Jogo completo com manual",
    price: 80.0,
    isTrade: true,
    game: "Pokemon Red",
    category: "Game Boy",
    image: "https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Pokemon+Red",
  },
  {
    id: 4,
    title: "Super Metroid - SNES",
    description: "Cartucho em bom estado",
    price: 120.0,
    isTrade: false,
    game: "Super Metroid",
    category: "SNES",
    image:
      "https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Super+Metroid",
  },
];

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredAdvertisements = mockAdvertisements.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !selectedGame || ad.game === selectedGame;
    const matchesCategory =
      !selectedCategory || ad.category === selectedCategory;

    return matchesSearch && matchesGame && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é feita em tempo real através do filtro
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Toca do Cartucho
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            O melhor lugar para comprar, vender e trocar jogos de cartucho
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar jogos, anúncios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                🔍 Buscar
              </button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os jogos</option>
              <option value="Super Mario 64">Super Mario 64</option>
              <option value="The Legend of Zelda">The Legend of Zelda</option>
              <option value="Pokemon Red">Pokemon Red</option>
              <option value="Super Metroid">Super Metroid</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              <option value="Nintendo 64">Nintendo 64</option>
              <option value="Game Boy">Game Boy</option>
              <option value="SNES">SNES</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Anúncios em Destaque
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                Grid
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
                Lista
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAdvertisements.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {ad.game}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {ad.category}
                    </span>
                  </div>
                  <div className="mb-4">
                    {ad.price ? (
                      <span className="text-2xl font-bold text-green-600">
                        R$ {ad.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-blue-600">
                        Aceita Troca
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Ver Detalhes
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAdvertisements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum anúncio encontrado
              </h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </main>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quer vender ou trocar seus jogos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Crie um anúncio e conecte-se com outros colecionadores
          </p>
          <button className="bg-white text-green-600 py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
            Criar Anúncio
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
