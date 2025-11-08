import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import { api } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";
import PasswordRequirements from "../components/SignUpFrom/PasswordRequirements";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  // Layout Mobile - seguindo o padrão
  if (isMobile) {
    return (
      <>
        <Head title="Alterar Senha" />
        <div className="min-h-screen bg-[#f4f3f5] md:hidden">
          {/* Header roxo escuro */}
          <div className="bg-[#2B2560] text-white">
            <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate("/seguranca")}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-light ml-2">Alterar Senha</h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-[#F4F3F5] max-h-screen  px-4 pt-6">
            {/* Campo: Digite sua senha antiga */}
            <h1 className="text-lg font-normal mb-3 ">Alterar Senha</h1>
            <div className="mb-6">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-normal text-black mb-2"
              >
                Digite sua senha antiga
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A2C7C] text-black"
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
            <div className="mb-6">
              <label
                htmlFor="newPassword"
                className="block text-sm font-normal text-black mb-2"
              >
                Digite a nova senha
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A2C7C] text-black"
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
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-normal text-black mb-2"
              >
                Confirme a nova senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A2C7C] text-black"
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
            <PasswordRequirements password={newPassword} />
              {/* <p className="text-sm font-medium text-gray-700 mb-3">
                A senha deve conter:
              </p>
              <ul className="space-y-2">
                <li
                  className={`text-sm flex items-center gap-2 ${
                    hasMinLength ? "text-green-600" : "text-[#DC5959]"
                  }`}
                >
                  <span className="text-lg">{hasMinLength ? "✓" : "×"}</span>
                  Mínimo de 6 caracteres
                </li>
                <li
                  className={`text-sm flex items-center gap-2 ${
                    hasUppercase ? "text-green-600" : "text-[#DC5959]"
                  }`}
                >
                  <span className="text-lg">{hasUppercase ? "✓" : "×"}</span>1
                  letra maiúscula
                </li>
                <li
                  className={`text-sm flex items-center gap-2 ${
                    hasLowercase ? "text-green-600" : "text-[#DC5959]"
                  }`}
                >
                  <span className="text-lg">{hasLowercase ? "✓" : "×"}</span>1
                  letra minúscula
                </li>
                <li
                  className={`text-sm flex items-center gap-2 ${
                    hasSpecialChar ? "text-green-600" : "text-[#DC5959]"
                  }`}
                >
                  <span className="text-lg">{hasSpecialChar ? "✓" : "×"}</span>1
                  caractere especial
                </li>
                <li
                  className={`text-sm flex items-center gap-2 ${
                    hasNumber ? "text-green-600" : "text-[#DC5959]"
                  }`}
                >
                  <span className="text-lg">{hasNumber ? "✓" : "×"}</span>1
                  número
                </li>
              </ul> */}
            </div>

            {/* Botão Salvar Senha */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-3 rounded-md text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                isSaving
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#4A2C7C] text-white hover:bg-[#3a2260]"
              }`}
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Salvando..." : "Salvar Senha"}
            </button>
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
      </>
    );
  }

  // Layout Desktop - mantém o layout original
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
              onClick={() => navigate("/meu-perfil")}
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
            <PasswordRequirements password={newPassword} />
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
