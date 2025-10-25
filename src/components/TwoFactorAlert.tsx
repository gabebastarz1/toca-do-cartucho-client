import React from "react";
import { Shield, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TwoFactorAlertProps {
  onClose: () => void;
}

const TwoFactorAlert: React.FC<TwoFactorAlertProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSetup2FA = () => {
    onClose();
    navigate("/meus-dados?tab=seguranca");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
      <div className="bg-gradient-to-r from-[#483d9e] to-[#211C49] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Ícone e Mensagem */}
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg mb-1">
                  Ativar autenticação de dois fatores
                </h3>
                <p className="text-sm sm:text-base text-white/90">
                  Ative a autenticação de dois fatores para maior segurança da
                  sua conta
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleSetup2FA}
                className="px-4 py-2 bg-white text-[#483d9e] rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                Ativar agora
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAlert;

