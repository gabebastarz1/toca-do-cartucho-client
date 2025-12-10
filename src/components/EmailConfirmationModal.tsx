import React, { useState } from "react";
import { X } from "lucide-react";
import { api } from "../services/api";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "./ui/CustomAlert";

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onEmailConfirmed?: () => void;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onEmailConfirmed,
}) => {
  const [isResending, setIsResending] = useState(false);
  const { alertState, showSuccess, showError, hideAlert } = useCustomAlert();

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await api.post("/api/accounts/resend-confirmation-email", {
        email: userEmail,
      });
      showSuccess(
        "Email de confirmação reenviado com sucesso! Verifique sua caixa de entrada."
      );
    } catch (error: unknown) {
      console.error("Erro ao reenviar email:", error);
      showError("Erro ao reenviar email de confirmação. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className="absolute inset-0 bg-black bg-opacity-40 pointer-events-auto"
          onClick={onClose}
        ></div>
        <div className="bg-white rounded-lg shadow-xl p-6 mx-4 w-full max-w-md pointer-events-auto relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Confirme seu Email
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Para continuar, você precisa confirmar seu endereço de email.
              Enviamos um link de confirmação para:
            </p>
            <p className="font-semibold text-gray-900 mb-4">{userEmail}</p>
            <p className="text-sm text-gray-500 mb-4">
              Verifique sua caixa de entrada e clique no link de confirmação. Se
              não recebeu o email, verifique também a pasta de spam.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="flex-1 bg-[#2B2560] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1f1a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Reenviando..." : "Reenviar Email"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmationModal;
