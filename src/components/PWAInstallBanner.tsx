import React, { useState } from "react";
import { Download, X } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  // Não mostrar se já estiver instalado ou foi dispensado
  if (isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  const handleInstall = () => {
    installApp();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:hidden">
      <div className="bg-[#211c49] text-white rounded-lg shadow-lg p-4 border border-[#38307c]">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              <img
                src="/logo-icon.svg"
                alt="Toca do Cartucho"
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">
                Instalar Toca do Cartucho
              </h3>
              <p className="text-xs text-[#edecf7] mb-3">
                Instale nosso app para acesso rápido e melhor experiência!
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstall}
                  className="bg-[#4A448C] hover:bg-[#5A549C] text-white text-xs px-3 py-2 rounded-md flex items-center space-x-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Instalar</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-[#edecf7] hover:text-white text-xs px-3 py-2 transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-[#edecf7] hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
