import React, { useState } from "react";
import {
  CircleStop,
  Loader2,
  ChevronRight,
  CircleX,
  X,
  CircleCheck,
} from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useCustomAlert } from "../hooks/useCustomAlert";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { useNavigate } from "react-router-dom";
import { accountService } from "../services/accountService";

const CancelAccount: React.FC = () => {
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const { userProfile, isLoading: profileLoading, refetch } = useUserProfile();
  const { showSuccess, showError } = useCustomAlert();
  const navigate = useNavigate();

  const isAccountInactive = userProfile?.accountStatus === "Inactive";

  // Função para cancelar conta (desativar temporariamente)
  const handleCancelAccount = async () => {
    setShowCancelModal(false);
    setIsCancelLoading(true);
    try {
      await accountService.deactivateAccount();

      showSuccess(
        "Conta cancelada com sucesso! Você tem 30 dias para reativar."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cancelar conta:", error);
      showError("Erro ao cancelar conta. Tente novamente.");
    } finally {
      setIsCancelLoading(false);
    }
  };

  // Função para ativar conta
  const handleActivateAccount = async () => {
    setShowCancelModal(false);
    setIsCancelLoading(true);
    try {
      await accountService.activateAccount();
      await refetch(); // Recarregar dados do perfil

      showSuccess("Conta reativada com sucesso!");
      setTimeout(() => {
        navigate("/perfil");
      }, 2000);
    } catch (error) {
      console.error("Erro ao reativar conta:", error);
      showError("Erro ao reativar conta. Tente novamente.");
    } finally {
      setIsCancelLoading(false);
    }
  };

  // Função para excluir conta permanentemente
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "EXCLUIR") {
      showError("Confirmação incorreta. A conta não foi excluída.");
      return;
    }

    setShowDeleteModal(false);
    setDeleteConfirmText("");
    setIsDeleteLoading(true);
    try {
      // TODO: Implementar chamada à API para excluir conta
      // await accountService.deleteAccount();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess("Conta excluída permanentemente.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      showError("Erro ao excluir conta. Tente novamente.");
    } finally {
      setIsDeleteLoading(false);
    }
  };
  // Mostrar loading enquanto verifica autenticação
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#f4f3f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483d9e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <>
      <Head title="Cancelar Conta" />
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
      <FilterTopBar />
      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate("/perfil")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Meu perfil
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <button
              onClick={() => navigate("/seguranca")}
              className="text-gray-900 text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Segurança
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">
              Cancelar Conta
            </span>
          </div>

          {/* Seção Cancelar/Ativar Conta */}
          <section className="bg-white rounded-lg shadow-sm p-6 px-12 mb-6">
            <div className="flex items-center justify-between gap-4">
              {isAccountInactive ? (
                <CircleCheck className="w-8 h-8 text-[#2B2560]" />
              ) : (
                <CircleStop className="w-8 h-8 text-[#1E1E1E]" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 -mb-1">
                  {isAccountInactive
                    ? "Reativar sua conta"
                    : "Desativar sua conta"}
                </h3>
                <p className="text-sm text-gray-600">
                  {isAccountInactive
                    ? "Sua conta está desativada. Reative para voltar a usar a plataforma."
                    : "Solicite o desativamento da sua conta. Seu perfil e anúncios não serão mais visíveis para outros usuários."}
                </p>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={isCancelLoading}
                  className={`px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap text-sm font-medium ${
                    isAccountInactive
                      ? "bg-[#EDECF7] text-[#2B2560] hover:bg-[#ddd9f3]"
                      : "bg-[#EDECF7] text-[#2B2560] hover:bg-[#ddd9f3]"
                  }`}
                >
                  {isCancelLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {isCancelLoading
                    ? "Processando..."
                    : isAccountInactive
                    ? "Ativar Conta"
                    : "Desativar Conta"}
                </button>
              </div>
            </div>
          </section>

          {/* Seção Excluir Conta */}
          <section className="bg-white rounded-lg shadow-sm p-6 px-12">
            <div className="flex items-center justify-between gap-4">
              <CircleX className="w-8 h-8 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-600 -mb-1">
                  Excluir Conta
                </h3>
                <p className="text-sm text-red-500">
                  Solicite o encerramento da sua conta permanentemente.
                </p>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleteLoading}
                  className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                >
                  {isDeleteLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {isDeleteLoading ? "Processando..." : "Excluir Conta"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal de Confirmação - Desativar/Ativar Conta */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-md shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {isAccountInactive ? (
                  <CircleCheck className="w-6 h-6 text-[#2B2560]" />
                ) : (
                  <CircleStop className="w-6 h-6 text-[#2B2560]" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {isAccountInactive ? "Reativar Conta" : "Desativar Conta"}
                </h3>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {isAccountInactive
                ? "Tem certeza que deseja reativar sua conta?"
                : "Tem certeza que deseja desativar sua conta?"}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={
                  isAccountInactive
                    ? handleActivateAccount
                    : handleCancelAccount
                }
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isAccountInactive
                    ? "bg-[#2B2560] text-white hover:bg-[#1f1a45]"
                    : "bg-[#2B2560] text-white hover:bg-[#1f1a45]"
                }`}
              >
                {isAccountInactive ? "Ativar" : "Desativar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação - Excluir Conta */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-md shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <CircleX className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-600">
                  Excluir Conta Permanentemente
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-red-600">
                  Esta ação é irreversível!
                </span>
                <br />
                Todos os seus dados, anúncios e histórico serão excluídos
                permanentemente.
              </p>
              <p className="text-sm text-gray-700 mb-2 font-medium">
                Digite <span className="font-bold text-red-600">EXCLUIR</span>{" "}
                para confirmar:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Digite EXCLUIR"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "EXCLUIR"}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Excluir Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BottomBar />
    </>
  );
};

export default CancelAccount;
