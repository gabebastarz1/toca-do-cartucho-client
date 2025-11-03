import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import { api } from "../services/api";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { alertState, showSuccess, showError, hideAlert } = useCustomAlert();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validação de requisitos da senha
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword !== "";

  const handleSave = async () => {
    // Validações
    if (!oldPassword) {
      showError("Por favor, digite sua senha atual.");
      return;
    }

    if (!newPassword) {
      showError("Por favor, digite sua nova senha.");
      return;
    }

    if (!isPasswordValid) {
      showError("A nova senha não atende aos requisitos de segurança.");
      return;
    }

    if (!confirmPassword) {
      showError("Por favor, confirme sua nova senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("As senhas não coincidem.");
      return;
    }

    if (oldPassword === newPassword) {
      showError("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setIsSaving(true);

    try {
      await api.post("/api/accounts/profile", {
        newEmail: null,
        newPassword: newPassword,
        oldPassword: oldPassword,
      });

      showSuccess("Senha alterada com sucesso!");

      // Limpar campos após sucesso
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/seguranca");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);

      if (error.response?.status === 400) {
        showError("Senha atual incorreta. Tente novamente.");
      } else if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Erro ao alterar senha. Tente novamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Head title="Alterar Senha" />
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
      <FilterTopBar />

      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/perfil")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Meu perfil
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <button
              onClick={() => navigate("/seguranca")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Segurança
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">
              Alterar Senha
            </span>
          </div>

          {/* Card do Formulário */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-normal text-black mb-8">
              Alterar minha senha
            </h1>

            {/* Campo: Digite sua senha antiga */}
            <div className="mb-6 w-full md:max-w-96">
              <label
                htmlFor="oldPassword"
                className="block text-base font-normal text-black mb-2"
              >
                Digite sua senha antiga
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#483d9e] focus:border-transparent"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo: Digite a nova senha */}
            <div className="mb-6 w-full md:max-w-96">
              <label
                htmlFor="newPassword"
                className="block text-base font-normal text-black mb-2"
              >
                Digite a nova senha
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#483d9e] focus:border-transparent"
                  placeholder="Digite sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo: Confirme a nova senha */}
            <div className="mb-4 w-full md:max-w-96">
              <label
                htmlFor="confirmPassword"
                className="block text-base font-normal text-black mb-2"
              >
                Confirme a nova senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#483d9e] focus:border-transparent"
                  placeholder="Confirme sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Requisitos da senha */}
            <div className="mb-8">
              <p className="text-sm text-gray-700 mb-2">A senha deve conter:</p>
              <ul className="">
                <li
                  className={`text-sm flex items-center gap-2  ${
                    hasMinLength ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-lg ">{hasMinLength ? "✓" : "×"}</span>
                  Mínimo de: 6 caracteres
                </li>
                <li
                  className={`text-sm flex items-center gap-2  ${
                    hasUppercase ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-lg ">{hasUppercase ? "✓" : "×"}</span>1
                  letra maiúscula
                </li>
                <li
                  className={`text-sm flex items-center gap-2  ${
                    hasLowercase ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-lg ">{hasLowercase ? "✓" : "×"}</span>1
                  letra minúscula
                </li>
                <li
                  className={`text-sm flex items-center gap-2  ${
                    hasSpecialChar ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-lg">{hasSpecialChar ? "✓" : "×"}</span>1
                  caractere especial
                </li>
                <li
                  className={`text-sm flex items-center gap-2  ${
                    hasNumber ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-lg">{hasNumber ? "✓" : "×"}</span>1
                  número
                </li>
              </ul>
            </div>

            {/* Botão Salvar Senha */}
            <div className="flex justify-start">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-8 py-3 rounded-md text-base font-normal transition-colors flex items-center gap-2 ${
                  isSaving
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#483d9e] text-white hover:bg-[#3a2f7a]"
                }`}
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Salvando..." : "Salvar Senha"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
        duration={5000}
      />

      <BottomBar />
      <Footer showBackToTopButton={true} />
    </>
  );
};

export default ChangePassword;
