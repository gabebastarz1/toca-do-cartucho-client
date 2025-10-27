import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import GameControllerImage from "../assets/controller.png";
import CustomCheckbox from "../components/ui/CustomCheckbox";
import { useAuth } from "../hooks/useAuth";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import { handleGoogleLogin } from "../services/authService";

const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const { alertState, showError, hideAlert } = useCustomAlert();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Chamar login com os códigos 2FA se necessário
      await loginContext(
        email,
        password,
        !useRecoveryCode ? twoFactorCode : undefined,
        useRecoveryCode ? twoFactorCode : undefined
      );
      navigate("/"); // Redireciona para a home page
    } catch (err: unknown) {
      console.log("🔍 [Login] Erro capturado:", err);

      const error = err as {
        status?: number;
        data?:
          | { detail?: string; title?: string; [key: string]: unknown }
          | string;
      };

      console.log("🔍 [Login] Status:", error.status);
      console.log("🔍 [Login] Data:", error.data);

      // Detectar se necessita de 2FA - verificar múltiplos formatos de resposta
      const dataString =
        typeof error.data === "string"
          ? error.data
          : JSON.stringify(error.data);
      const requires2FADetected =
        error.status === 401 &&
        (dataString.includes("RequiresTwoFactor") ||
          dataString.includes("requires") ||
          (typeof error.data === "object" &&
            error.data !== null &&
            "title" in error.data &&
            typeof error.data.title === "string" &&
            error.data.title.includes("RequiresTwoFactor")));

      if (requires2FADetected && !requires2FA) {
        console.log("✅ [Login] 2FA detectado - mostrando campo");
        setRequires2FA(true);
        showError(
          "Esta conta possui autenticação de dois fatores. Por favor, insira seu código."
        );
      } else if (
        error.status === 401 &&
        typeof error.data === "object" &&
        error.data !== null &&
        "detail" in error.data &&
        error.data.detail === "NotAllowed"
      ) {
        showError("Confirme seu email antes de continuar.");
      } else if (requires2FA) {
        showError("Código de verificação inválido. Tente novamente.");
        setTwoFactorCode("");
      } else {
        showError("Email ou senha inválidos. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#211C49] p-4 font-sans">
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />
      {/* Game controller is now hidden on mobile and appears on medium screens and up */}
      <img
        src={GameControllerImage}
        alt="Controle"
        className="absolute bottom-16 left-[calc(53%-480px)] z-50 hidden w-80 transform md:block"
      />

      <main className="relative z-10 w-full max-w-md rounded-lg p-6 md:bg-[#E8E6F1] md:p-10 md:shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white md:text-[#2B2560]">
            Seja Bem Vindo de Volta!
          </h1>
          <p className="mt-2 text-white md:text-[#2B2560]">Faça seu login!</p>
          <p className="mt-6 text-sm text-white md:text-[#2B2560]">
            Ainda não tem uma conta?
            <Link
              to="/cadastro"
              className="ml-1 font-semibold text-white hover:underline md:text-[#2B2560]"
            >
              Cadastrar
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-white md:text-[#2B2560]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Digite seu email"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-white md:text-gray-700"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Digite sua senha"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={requires2FA}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                disabled={requires2FA}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Campo de Código 2FA */}
          {requires2FA && (
            <div className="rounded-lg  p-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-[#31295F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <label
                  htmlFor="twoFactorCode"
                  className="block text-sm font-semibold text-[#31295F]"
                >
                  {useRecoveryCode
                    ? "Código de Recuperação"
                    : "Código de Autenticação"}
                </label>
              </div>
              <input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                required
                placeholder={
                  useRecoveryCode ? "Digite o código de recuperação" : "000000"
                }
                className="w-full rounded-md border-2 border-[#31295F] bg-white px-3 py-3 text-center text-2xl font-mono tracking-widest text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#483d9e] focus:outline-none focus:ring-2 focus:ring-[#483d9e]"
                value={twoFactorCode}
                onChange={(e) => {
                  const value = useRecoveryCode
                    ? e.target.value
                    : e.target.value.replace(/\D/g, "").slice(0, 6);
                  setTwoFactorCode(value);
                }}
                maxLength={useRecoveryCode ? undefined : 6}
                autoFocus
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  {useRecoveryCode
                    ? "Digite um dos seus códigos de recuperação"
                    : "Digite o código do seu aplicativo autenticador"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setUseRecoveryCode(!useRecoveryCode);
                    setTwoFactorCode("");
                  }}
                  className="text-xs text-[#31295F] font-medium hover:underline whitespace-nowrap ml-2"
                >
                  {useRecoveryCode ? "Usar app" : "Usar recuperação"}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <CustomCheckbox
              id="remember-me"
              label="Lembre-se de mim"
              checked={rememberMe}
              onChange={setRememberMe}
              labelClassName="text-white md:text-gray-700"
            />
            <a
              href="#"
              className="font-medium text-white hover:underline md:text-[#31295F]"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full justify-center rounded-md bg-[#31295F] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#292250] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Acessando..." : "Acessar"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-t border-gray-500 md:border-gray-300" />
          <span className="mx-4 text-xs text-gray-400 md:text-gray-500">
            Ou
          </span>
          <hr className="flex-grow border-t border-gray-500 md:border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white md:bg-transparent py-3 text-md text-white md:text-[#2B2560] font-bold shadow-sm transition-colors hover:bg-gray-50"
        >
          <FaGoogle size={20} />
          Entrar com o Google
        </button>
      </main>
    </div>
  );
};

export default Login;
