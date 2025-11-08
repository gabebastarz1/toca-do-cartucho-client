import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const ConfirmEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { alertState, showSuccess, showError, hideAlert } = useCustomAlert();

  useEffect(() => {
    const confirmEmail = async () => {
      const userId = searchParams.get("userId");
      const code = searchParams.get("code");
      const changedEmail = searchParams.get("changedEmail");

      if (!userId || !code) {
        setError("Parâmetros inválidos. Verifique o link do email.");
        setIsConfirming(false);
        return;
      }

      try {
        await authService.confirmEmail(userId, code, changedEmail || undefined);
        setIsSuccess(true);
        showSuccess("Email confirmado com sucesso! Você já pode fazer login.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err: unknown) {
        const apiError = err as { status?: number; data?: unknown };
        console.error("Erro ao confirmar email:", apiError);
        
        let errorMessage = "Erro ao confirmar email. O link pode ter expirado ou ser inválido.";
        
        if (apiError.status === 401) {
          errorMessage = "Link de confirmação inválido ou expirado. Solicite um novo link.";
        }
        
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setIsConfirming(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate, showSuccess, showError]);

  return (
    <>
      <Head title="Confirmar Email" />
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={false} />
      <FilterTopBar />
      
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />

      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {isConfirming ? (
              <>
                <Loader2 className="w-16 h-16 text-[#2B2560] animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirmando seu email...
                </h2>
                <p className="text-gray-600">
                  Por favor, aguarde enquanto confirmamos seu endereço de email.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Email Confirmado!
                </h2>
                <p className="text-gray-600 mb-4">
                  Seu email foi confirmado com sucesso. Você será redirecionado para a página de login em instantes.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-4 px-6 py-2 bg-[#2B2560] text-white rounded-lg hover:bg-[#1f1a45] transition-colors"
                >
                  Ir para Login
                </button>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Erro ao Confirmar Email
                </h2>
                <p className="text-gray-600 mb-4">
                  {error || "Ocorreu um erro ao confirmar seu email."}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ir para Login
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-[#2B2560] text-white rounded-lg hover:bg-[#1f1a45] transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <BottomBar />
    </>
  );
};

export default ConfirmEmail;

