import React from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";

const UserProfileTest: React.FC = () => {
  const { userProfile, isLoading, error, refetch } = useUserProfile();
  const { user } = useAuth();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-4">
        Teste de Integração - Dados do Usuário
      </h3>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-700">Status da API:</h4>
          <p className="text-sm">
            {isLoading
              ? "Carregando..."
              : error
              ? `Erro: ${error}`
              : "Dados carregados com sucesso!"}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">
            Dados do Contexto de Auth:
          </h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">
            Dados da API /api/accounts/profile:
          </h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>

        <button
          onClick={refetch}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Recarregar Dados
        </button>
      </div>
    </div>
  );
};

export default UserProfileTest;
