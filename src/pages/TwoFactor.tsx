import React, { useState, useEffect } from "react";
import {
  CircleCheckBig,
  Loader2,
  ChevronRight,
  X,
  ShieldOff,
  ArrowLeft,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { twoFactorAuthService } from "../services/twoFactorAuthService";
import { TwoFactorResponse } from "../api/api";
import TwoFactorSetup from "../components/TwoFactorSetup";
import { useUserProfile } from "../hooks/useUserProfile";
import { useCustomAlert } from "../hooks/useCustomAlert";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";

const TwoFactor: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [twoFactorInfo, setTwoFactorInfo] = useState<TwoFactorResponse | null>(
    null
  );
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useCustomAlert();
  const { logout } = useAuth();

  // useEffect para carregar informações de 2FA
  useEffect(() => {
    const load2FAInfo = async () => {
      // Verificar se usuário está autenticado
      if (!userProfile) {
        window.location.href = "/login?redirect=/2fa";
        return;
      }

      try {
       
        const info = await twoFactorAuthService.get2FAInfo();
        
        setTwoFactorInfo(info);
      } catch (error) {
        console.error(
         
          error
        );
        showError(
          "Erro ao carregar informações de autenticação de dois fatores"
        );
      }
    };

    // Aguardar carregamento do perfil antes de tentar carregar 2FA
    if (!profileLoading) {
      if (userProfile) {
        load2FAInfo();
      }

      // Verificar se deve abrir o modal de 2FA pela URL
      const tab = searchParams.get("tab");
      if (tab === "seguranca" && userProfile) {
        setShow2FASetup(true);
      }
    }
  }, [userProfile, profileLoading, searchParams, showError]);

  // Funções para gerenciar 2FA
  const handle2FASuccess = async () => {
    setShow2FASetup(false);
    showSuccess("Autenticação de dois fatores ativada com sucesso!");

    // Recarregar informações de 2FA
    try {
      const info = await twoFactorAuthService.get2FAInfo();
      setTwoFactorInfo(info);
    } catch (error) {
      console.error("Erro ao recarregar informações de 2FA:", error);
    }
  };

  const handleDisable2FA = async () => {
    setShowDisableModal(false);
    setIs2FALoading(true);
    try {
      await twoFactorAuthService.disable2FA();
      showSuccess(
        "Autenticação de dois fatores desativada com sucesso! Você será deslogado."
      );

      // Aguardar um momento para mostrar a mensagem antes de deslogar
      setTimeout(async () => {
        await logout();
        // Recarregar a página após logout
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Erro ao desativar 2FA:", error);
      showError(
        "Erro ao desativar autenticação de dois fatores. Tente novamente."
      );
      setIs2FALoading(false);
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

  // Não mostrar nada se não estiver autenticado (vai redirecionar)
  if (!userProfile) {
    return null;
  }

  // Layout Mobile - seguindo o padrão
  if (isMobile) {
    return (
      <>
        <Head title="Autenticação de Dois Fatores" />
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
              <h1 className="text-lg font-light ml-2">
                Autenticação de dois fatores
              </h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-[#F4F3F5] max-h-screen pb-20 pt-4">
            {twoFactorInfo?.isTwoFactorEnabled ? (
              <div className="space-y-0">
                {/* 2FA Ativado */}
                <div className="flex items-center px-4 py-4">
                  <CircleCheckBig className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-black text-base font-semibold">
                      Autenticação 2FA ativada
                    </p>
                    <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                      Sua conta está protegida com autenticação de dois fatores
                    </p>
                  </div>
                </div>

                {/* Desativar 2FA */}
                <button
                  onClick={() => setShowDisableModal(true)}
                  disabled={is2FALoading}
                  className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  <ShieldOff className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="text-black text-base font-semibold">
                      Desativar autenticação 2FA
                    </p>
                    <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                      {is2FALoading
                        ? "Processando..."
                        : "Remover a proteção de dois fatores"}
                    </p>
                  </div>
                  {is2FALoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShow2FASetup(true)}
                className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <CircleCheckBig className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Ativar autenticação de dois fatores
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Ative a autenticação de dois fatores para maior segurança da
                    sua conta
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Modal de Configuração de 2FA - Tela cheia no mobile */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <TwoFactorSetup
              userEmail={userProfile?.email || undefined}
              onSuccess={handle2FASuccess}
              onCancel={() => setShow2FASetup(false)}
            />
          </div>
        )}

        {/* Modal de Confirmação - Desativar 2FA */}
        {showDisableModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ShieldOff className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Desativar 2FA
                  </h3>
                </div>
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold text-red-600">
                    ⚠️ Atenção!
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Tem certeza que deseja desativar a autenticação de dois
                  fatores? Sua conta ficará menos segura.
                </p>
                <p className="text-sm text-orange-600 font-medium">
                  Você será deslogado automaticamente após desativar o 2FA.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDisable2FA}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Desativar
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomBar />
      </>
    );
  }

  // Layout Desktop - mantém o layout original
  return (
    <>
      <Head title="Autenticação de Dois Fatores" />
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
      <FilterTopBar />
      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="text-gray-900 text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Segurança
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">
              Autenticação de Dois Fatores
            </span>
          </div>

          <section className="bg-white rounded-lg shadow-sm p-6 px-12">
            <div className="flex items-center justify-between gap-4">
              <CircleCheckBig className="w-8 h-8 text-[#1E1E1E]" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 -mb-1">
                  Ativar autenticação de dois fatores{" "}
                </h3>
                <p className="text-sm text-gray-600">
                  Ative a autenticação de dois fatores para maior segurança da
                  sua conta
                </p>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {twoFactorInfo?.isTwoFactorEnabled ? (
                  <button
                    onClick={() => setShowDisableModal(true)}
                    disabled={is2FALoading}
                    className="px-4 py-2 bg-[#EDECF7] text-[#2B2560] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  >
                    {is2FALoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {is2FALoading ? "Processando..." : "Desativar"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShow2FASetup(true)}
                    className="px-6 py-2 bg-[#EDECF7] text-[#2B2560] rounded-lg transition-colors text-sm whitespace-nowrap"
                  >
                    Ativar
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal de Configuração de 2FA */}
      {show2FASetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <TwoFactorSetup
              userEmail={userProfile?.email || undefined}
              onSuccess={handle2FASuccess}
              onCancel={() => setShow2FASetup(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Confirmação - Desativar 2FA */}
      {showDisableModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-md shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldOff className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Desativar Autenticação de Dois Fatores
                </h3>
              </div>
              <button
                onClick={() => setShowDisableModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-red-600">⚠️ Atenção!</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Tem certeza que deseja desativar a autenticação de dois fatores?
                Sua conta ficará menos segura sem essa camada extra de proteção.
              </p>
              <p className="text-sm text-orange-600 font-medium">
                Você será deslogado automaticamente após desativar o 2FA e
                precisará fazer login novamente.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDisableModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisable2FA}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Desativar 2FA
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

export default TwoFactor;
