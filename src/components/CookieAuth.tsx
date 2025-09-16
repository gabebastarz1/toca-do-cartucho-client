import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const CookieAuth: React.FC = () => {
  const { setCookieAuth } = useAuth();
  const [cookieValue, setCookieValue] = useState("");
  const [isSet, setIsSet] = useState(false);

  const handleSetCookie = () => {
    if (cookieValue.trim()) {
      setCookieAuth(cookieValue);
      setIsSet(true);
      setTimeout(() => setIsSet(false), 3000);
    }
  };

  const handleUseProvidedCookie = () => {
    const providedCookie =
      "CfDJ8HxCBy7YiRRAjqP5py-nziUXduFSQYiup7hK_6ak_AJpSu4q5atlc47vENoNipJvO17M56pQprkzHDWtTiHLBmPOPy708oze48Vl5Pebtn1KM-6Qpwl-439vqEEimIbUp3zvfqaJ85rs6uDM5O68MRcl5EEoj3nuThQ8upO_BAYuOl1TcXHERz77S_LXXe-18_O83_VT1NNW7r3RksL26--QUg79npMcAV7uMpBdZrOE9gRfSjxuoA0ztzsbmIG7gwNgWq0nX8sSFTsM7JCv4P2_J5s9E8MJyDqk29X5IhiSBMwcwb8ipJSKHrDUdjyfMBa8VkwhjstWhtmpHixoOsCWsuveiTQ-kHyxVDra9WNd_Eay_85Bbr6yiRx8qFsNDXxHW8z6sroZtXMXsmtb1BCKwL4WN7x5nPIUrSvex-w2OZVqeRfLQfUKtKG_M-RewYWxbfjRsGGvPmEmWbDUDKiKU8ESZO_VSDhlmIp2Naw_DgE9B6bg0nBQcJUL4DHXshMLTvQ7PJDuI6sudeBontD24yXm_RGbJFe78AWZ1I7Y4hLWOviNpCdtXszeL09BzgIIrmzdg6GK9dgUSeZd3VHi80nu-aEjlMWIiZqgYT6MLIrWdhLa64wZXK0Forgmji0rze7RpL-h7ckoB3R65tFwOCsupTn_54V-Zwl9Kxz5tOo3TBGJtjXzfj1vzlNGZ1pWy26F13jKmd7dXC1MNi9hKZS_GO5DpPKQZCidEb55n2vTF6FmjJit9KGfITv_Oy4YwFsy5ik4RLoreBsYBj4HmBomqaN9zWATm17ET6MxK2Yz9WWxaDQyfbvNGRQvvXtVrVJimfGePWl8xWCjhXN57G_WjF5k9eVAlXZ5zqdxvQXaPeL8k4HmQlhYvhZT8u6Q7Tz51CLcmtoumo4sjms";
    setCookieAuth(providedCookie);
    setIsSet(true);
    setTimeout(() => setIsSet(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Configurar Autenticação por Cookie
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cookie de Autenticação
        </label>
        <textarea
          value={cookieValue}
          onChange={(e) => setCookieValue(e.target.value)}
          placeholder="Cole aqui o cookie de autenticação..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSetCookie}
          disabled={!cookieValue.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Definir Cookie Personalizado
        </button>

        <button
          onClick={handleUseProvidedCookie}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Usar Cookie Fornecido
        </button>
      </div>

      {isSet && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          ✅ Cookie definido com sucesso! Você está autenticado.
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold text-gray-800 mb-2">Como usar:</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Cole o cookie de autenticação no campo acima</li>
          <li>2. Clique em "Definir Cookie Personalizado"</li>
          <li>
            3. Ou use o botão "Usar Cookie Fornecido" para usar o cookie
            pré-definido
          </li>
          <li>4. Agora você pode navegar pelas páginas protegidas</li>
        </ol>
      </div>
    </div>
  );
};

export default CookieAuth;
