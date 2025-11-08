import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { twoFactorAuthService } from "../services/twoFactorAuthService";
import { useAuth } from "../hooks/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import QRCode from "qrcode";

interface TwoFactorSetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userEmail?: string;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  onSuccess,
  onCancel,
  userEmail,
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const email = userEmail || user?.email;
  const [step, setStep] = useState<"loading" | "setup" | "verify" | "success">(
    "loading"
  );
  const [sharedKey, setSharedKey] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const initialize2FA = useCallback(async () => {
    if (initialized) return; // Prevenir múltiplas chamadas

    try {
      setStep("loading");
      const response = await twoFactorAuthService.setup2FA();

      if (response.sharedKey && email) {
        setSharedKey(response.sharedKey);
        const url = twoFactorAuthService.generateQRCodeUrl(
          email,
          response.sharedKey
        );

        // Gerar QR Code como imagem
        const dataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
        });
        setQrCodeDataUrl(dataUrl);

        setStep("setup");
        setInitialized(true);
      } else {
        setError(
          "Erro: Dados incompletos para configurar autenticação de dois fatores"
        );
        setStep("setup");
      }
    } catch (err: unknown) {
      const error = err as {
        message?: string;
        response?: { data?: unknown; status?: number };
      };
      console.error(
        "❌ [TwoFactorSetup] Erro ao inicializar autenticação de dois fatores:",
        err
      );
      console.error("❌ [TwoFactorSetup] Erro detalhado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Mensagem específica para erro de autenticação
      if (error.response?.status === 401) {
        setError(
          "Sua sessão expirou. Por favor, faça logout e login novamente para ativar a autenticação de dois fatores."
        );
      } else {
        setError(
          "Erro ao configurar autenticação de dois fatores. Tente novamente."
        );
      }
      setStep("setup");
    }
  }, [email, initialized]);

  useEffect(() => {
    // Só inicializar se o email estiver disponível e ainda não foi inicializado
    if (email && !initialized) {
      initialize2FA();
    } else if (!email && !initialized) {
      console.warn("⚠️ [TwoFactorSetup] Email não disponível");
      setError("Erro: Email não encontrado. Por favor, faça login novamente.");
      setStep("setup");
    }
  }, [email, initialized, initialize2FA]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Por favor, insira um código de 6 dígitos.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 [TwoFactorSetup] Verificando código:", verificationCode);
      const response = await twoFactorAuthService.enable2FA(verificationCode);

      console.log("✅ [TwoFactorSetup] Resposta da verificação:", response);
      console.log(
        "✅ [TwoFactorSetup] Recovery codes:",
        response.recoveryCodes
      );

      if (response.recoveryCodes && response.recoveryCodes.length > 0) {
        setRecoveryCodes(response.recoveryCodes);
        setStep("success");
      } else {
        console.warn(
          "⚠️ [TwoFactorSetup] Nenhum código de recuperação retornado"
        );
        setError("Erro ao obter códigos de recuperação.");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: {
          status?: number;
          data?: unknown;
        };
        message?: string;
      };
      console.error("❌ [TwoFactorSetup] Erro ao verificar código 2FA:", err);
      console.error("❌ [TwoFactorSetup] Status:", error.response?.status);
      console.error("❌ [TwoFactorSetup] Data:", error.response?.data);
      console.error("❌ [TwoFactorSetup] Message:", error.message);

      if (error.response?.status === 400) {
        setError("Código inválido. Por favor, verifique e tente novamente.");
      } else if (error.response?.status === 401) {
        setError("Sessão expirada. Por favor, faça login novamente.");
      } else {
        setError("Erro ao verificar código. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "key" | "recovery") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else {
        setCopiedRecovery(true);
        setTimeout(() => setCopiedRecovery(false), 2000);
      }
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const downloadRecoveryCodes = () => {
    const content = `Toca do Cartucho - Códigos de Recuperação 2FA\n\n${recoveryCodes.join(
      "\n"
    )}\n\nGuarde estes códigos em um local seguro. Cada código só pode ser usado uma vez.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toca-do-cartucho-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-[#483d9e] mb-4" />
        <p className="text-gray-600">
          Configurando autenticação de dois fatores...
        </p>
      </div>
    );
  }

  // Layout Mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header roxo escuro */}
        <div className="bg-[#2B2560] text-white">
          <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
            <button
              onClick={onCancel}
              className="p-2 -ml-2 focus:outline-none"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-lg font-light ml-2">
              {step === "setup" ? "Configurar 2FA" : "2FA Ativado"}
            </h1>
          </div>
        </div>

        {/* Conteúdo Mobile */}
        <div className="bg-[#F4F3F5] min-h-screen px-4 pt-6 pb-20">
          {step === "setup" && (
            <div className="space-y-6">
              {/* Passo 1: Escanear QR Code */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#4A2C7C] text-white rounded-full text-sm">
                    1
                  </span>
                  Escaneie o QR Code
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use seu aplicativo autenticador para escanear:
                </p>

                {qrCodeDataUrl && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code"
                      className="border-4 border-white rounded-lg shadow-lg w-64 h-64"
                    />
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Ou insira manualmente:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-white px-2 py-2 rounded border border-gray-200 break-all">
                      {twoFactorAuthService.formatSharedKey(sharedKey)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(sharedKey, "key")}
                      className="flex items-center gap-1 px-3 py-2 bg-[#4A2C7C] text-white rounded-lg text-sm"
                    >
                      {copiedKey ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Passo 2: Verificar */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#4A2C7C] text-white rounded-full text-sm">
                    2
                  </span>
                  Código de verificação
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Digite o código de 6 dígitos:
                </p>

                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                    setError("");
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A2C7C]"
                  maxLength={6}
                />

                {error && (
                  <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full px-6 py-3 bg-[#4A2C7C] text-white rounded-lg hover:bg-[#3a2260] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Ativar"
                  )}
                </button>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  2FA Ativado!
                </h2>
                <p className="text-sm text-gray-600">
                  Sua conta está protegida
                </p>
              </div>

              {/* Códigos de Recuperação */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-base text-center mb-4">
                  Códigos de Recuperação
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-gray-900"
                    >
                      {showRecoveryCodes ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    {recoveryCodes.map((code, index) => (
                      <div
                        key={index}
                        className="px-2 py-2 rounded text-center"
                      >
                        {showRecoveryCodes ? code : "••••••••••••"}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4">
                  Guarde esses códigos em local seguro. Eles são essenciais para
                  recuperar o acesso à sua conta.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      copyToClipboard(recoveryCodes.join("\n"), "recovery")
                    }
                    disabled={!showRecoveryCodes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#4A2C7C] bg-white text-[#4A2C7C] hover:bg-[#4A2C7C] hover:text-white transition-colors rounded-lg disabled:opacity-50"
                  >
                    {copiedRecovery ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadRecoveryCodes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#4A2C7C] bg-white text-[#4A2C7C] hover:bg-[#4A2C7C] hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full px-6 py-3 bg-[#4A2C7C] text-white rounded-lg hover:bg-[#3a2260] transition-colors font-medium"
              >
                Concluir
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Layout Desktop
  return (
    <div className="max-w-2xl mx-auto">
      {step === "setup" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#483d9e]/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-[#483d9e]" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Autenticação de Dois Fatores
            </h2>
            <p className="text-gray-600">
              Siga os passos abaixo para ativar a autenticação de dois fatores
            </p>
          </div>

          {/* Passo 1: Instalar App
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 bg-[#483d9e] text-white rounded-full text-sm">
                1
              </span>
              Instale o aplicativo
            </h3>
            <p className="text-gray-600 mb-3">
              Baixe e instale o Google Authenticator no seu celular:
            </p>
            <div className="flex gap-3">
              <a
                href="https://apps.apple.com/br/app/google-authenticator/id388497605"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5M13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#483d9e] text-white rounded-lg hover:bg-[#3a2f7a] transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </a>
            </div>
          </div> */}

          {/* Passo 1: Escanear QR Code */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 bg-[#483d9e] text-white rounded-full text-sm">
                1
              </span>
              Escaneie o QR Code
            </h3>
            <p className="text-gray-600 mb-4">
              Abra o aplicativo autenticador de sua preferência e escaneie o QR
              Code exibido.{" "}
            </p>

            {qrCodeDataUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="border-4 border-white rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                Ou insira manualmente a chave:
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200 break-all">
                  {twoFactorAuthService.formatSharedKey(sharedKey)}
                </code>
                <button
                  onClick={() => copyToClipboard(sharedKey, "key")}
                  className="flex items-center gap-2 px-3 py-2 bg-[#483d9e] text-white rounded-lg hover:bg-[#3a2f7a] transition-colors text-sm whitespace-nowrap"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Passo 2: Verificar */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 bg-[#483d9e] text-white rounded-full text-sm">
                2
              </span>
              Insira o código de verificação
            </h3>
            <p className="text-gray-600 mb-4">
              Digite o código de 6 dígitos mostrado no aplicativo:
            </p>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                setError("");
              }}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483d9e] focus:border-transparent"
              maxLength={6}
            />

            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || isLoading}
              className="flex-1 px-6 py-3 bg-[#483d9e] text-white rounded-lg hover:bg-[#3a2f7a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ativar"
              )}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Autenticação de dois fatores ativada com sucesso!
            </h2>
            <p className="text-gray-600">
              Sua conta agora está protegida com autenticação de dois fatores
            </p>
          </div>

          {/* Códigos de Recuperação */}
          <div className=" border rounded-lg p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-1 text-center text-xl font-bold ">
                  Salve seus Códigos de Recuperação
                </h3>
              </div>
            </div>

            <div className="bg-[#F8F8FC] rounded-lg p-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 rounded-lg"
                >
                  {showRecoveryCodes ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {recoveryCodes.map((code, index) => (
                  <div key={index} className="px-3 py-2 rounded text-center">
                    {showRecoveryCodes ? code : "••••••••••••"}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg p-4  mb-4">
              <p className="text-sm text-gray-900 text-start mt-4">
                Lembre-se de anotar e guardar seus códigos de backup em um local
                seguro. Eles são gerados apenas uma vez e serão essenciais para
                recuperar o acesso à sua conta caso você perca o acesso ao seu
                dispositivo principal.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() =>
                  copyToClipboard(recoveryCodes.join("\n"), "recovery")
                }
                disabled={!showRecoveryCodes}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2  border border-[#483D9E] bg-white text-[#483D9E]  hover:bg-[#483D9E] hover:text-white transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#483D9E]"
              >
                {copiedRecovery ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
              <button
                onClick={downloadRecoveryCodes}
                className="flex-1 flex items-center justify-center gap-2  px-4 py-2 rounded-lg border border-[#483D9E] bg-white text-[#483D9E]  hover:bg-[#483D9E] hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full px-6 py-3 bg-[#483d9e] text-white rounded-lg hover:bg-[#3a2f7a] transition-colors font-medium"
          >
            Concluir
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
