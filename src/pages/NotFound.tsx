import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone/Ilustração */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
            <span className="text-6xl">🎮</span>
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          Ops! Parece que você se perdeu no caminho. Esta página não existe ou
          foi movida.
        </p>

        {/* Botões de Ação */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar para Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Voltar para Página Anterior
          </button>
        </div>

        {/* Links Úteis */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Ou navegue para:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/anuncios"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver Anúncios
            </Link>
            <Link
              to="/criar-anuncio"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Criar Anúncio
            </Link>
            <Link
              to="/perfil"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Meu Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
