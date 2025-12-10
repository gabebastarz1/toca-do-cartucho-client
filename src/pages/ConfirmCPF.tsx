import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputCpf } from "../components/ui/InputCpf";
import { api } from "../services/api";
import { useUserProfile } from "../hooks/useUserProfile";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";

const ConfirmCPF: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refetch } = useUserProfile();
  const { alertState, showError, hideAlert } = useCustomAlert();
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Obter a URL de retorno (se houver)
  const returnUrl = location.state?.returnUrl || "/criar-anuncio";

  // Função para validar CPF
  const isValidCPF = (cpfValue: string): boolean => {
    // Remove formatação
    const numbers = cpfValue.replace(/\D/g, "");

    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(numbers[9]) !== firstDigit) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(numbers[10]) === secondDigit;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar CPF
    if (!cpf || cpf.trim() === "") {
      setError("Por favor, informe seu CPF");
      return;
    }

    const cpfNumbers = cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      setError("CPF deve conter 11 dígitos");
      return;
    }

    if (!isValidCPF(cpf)) {
      setError("CPF inválido. Por favor, verifique o número informado");
      return;
    }

    setIsLoading(true);

    try {
      // Atualizar CPF no perfil
      await api.patch("/api/auth/profile", {
        cpf: cpfNumbers, // Enviar apenas números
      });

      // Atualizar dados do perfil
      await refetch();

      // Redirecionar para a página de criação de anúncio
      navigate(returnUrl);
    } catch (err: any) {
      console.error("Erro ao salvar CPF:", err);
      
      const apiError = err as {
        status?: number;
        data?: unknown;
        message?: string;
        response?: { data?: unknown; status?: number };
      };
      
      // Extrair mensagem de erro de diferentes formatos possíveis
      const errorData = (apiError.response?.data || apiError.data || {}) as {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
      };
      
      const errorMessage =
        errorData.message ||
        errorData.error ||
        apiError.message ||
        JSON.stringify(errorData);
      
      // Verificar se o erro é sobre CPF já em uso
      const isCpfAlreadyInUse =
        errorMessage &&
        (errorMessage
          .toLowerCase()
          .includes("is already in use by another user") ||
          errorMessage.toLowerCase().includes("já está em uso")) &&
        (errorMessage.toLowerCase().includes("cpf") ||
          errorMessage.toLowerCase().includes("cpf"));
      
      if (isCpfAlreadyInUse) {
        showError(
          "Este CPF já está cadastrado por outro usuário. Por favor, verifique o CPF informado ou faça login se já possui uma conta."
        );
        setError("Este CPF já está em uso.");
        setIsLoading(false);
        return;
      }
      
      // Tratar outros erros
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao salvar CPF. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />
      <div className="w-full max-w-md">
        {/* Link Voltar */}
        <button
          onClick={() => navigate("/produtos")}
          className="text-blue-600 hover:text-blue-800 mb-4 text-sm"
        >
          ← Voltar
        </button>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Para anunciar na Toca do Cartucho, confirme o seu CPF
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                CPF:
              </label>
              <InputCpf
                id="cpf"
                value={cpf}
                onChange={(e) => {
                  // O InputCpf já aplica a máscara, então só precisamos atualizar o estado
                  setCpf(e.target.value);
                }}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38307C] focus:border-transparent"
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#38307C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2a2560] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Salvando..." : "Começar a anunciar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCPF;
