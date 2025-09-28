import React from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

const About: React.FC = () => {
  return (
    <>
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />

      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Sobre a Toca do Cartucho
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Bem-vindo à Toca do Cartucho, o seu destino definitivo para
                jogos retrô e colecionáveis!
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Nossa Missão
              </h2>
              <p className="text-gray-600 mb-6">
                Conectar colecionadores e entusiastas de jogos retrô,
                proporcionando uma plataforma segura e confiável para compra,
                venda e troca de cartuchos, consoles e acessórios vintage.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                O que oferecemos
              </h2>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Catálogo completo de jogos retrô e repro</li>
                <li>Sistema de avaliações de vendedores</li>
                <li>Filtros avançados por gênero, tema e estado</li>
                <li>Comunicação direta via WhatsApp</li>
                <li>Interface intuitiva e responsiva</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Nossa Comunidade
              </h2>
              <p className="text-gray-600 mb-6">
                A Toca do Cartucho é mais que uma plataforma de vendas - é uma
                comunidade de apaixonados por jogos retrô que valorizam a
                qualidade, autenticidade e a experiência nostálgica dos jogos
                clássicos.
              </p>

              <div className="bg-[#211c49] text-white p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold mb-3">
                  Junte-se à nossa comunidade!
                </h3>
                <p className="text-[#edecf7]">
                  Cadastre-se gratuitamente e comece a explorar nossa vasta
                  coleção de jogos retrô. Seja você um colecionador experiente
                  ou um iniciante no mundo dos jogos vintage, você encontrará
                  seu lugar aqui.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer showBackToTopButton={true} />
    </>
  );
};

export default About;
