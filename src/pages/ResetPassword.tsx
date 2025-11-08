import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import { api } from "../services/api";
import PasswordRequirements from "../components/SignUpFrom/PasswordRequirements";

const ResetPassword: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { alertState, showError, showSuccess, hideAlert } = useCustomAlert();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Validação de requisitos da senha
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);


  // Pré-preenche o email da URL ou localStorage quando a página carrega
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
      // Limpar localStorage se encontrou na URL
      localStorage.removeItem("resetPasswordEmail");
    } else {
      // Fallback: tentar pegar do localStorage
      const savedEmail = localStorage.getItem("resetPasswordEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [searchParams]);

  // Limpar email do localStorage quando a senha for resetada com sucesso
  const handleSuccessReset = () => {
    localStorage.removeItem("resetPasswordEmail");
    showSuccess("Senha alterada com sucesso! Redirecionando para o login...");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "A senha deve conter pelo menos uma letra maiúscula";
    }
    if (!/[a-z]/.test(pwd)) {
      return "A senha deve conter pelo menos uma letra minúscula";
    }
    if (!/[0-9]/.test(pwd)) {
      return "A senha deve conter pelo menos um número";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return "A senha deve conter pelo menos um caractere especial";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || email.trim() === "") {
      showError("Email é obrigatório.");
      return;
    }

    if (!resetCode || resetCode.trim() === "") {
      showError("Código de recuperação é obrigatório.");
      return;
    }

    if (!password) {
      showError("A senha é obrigatória.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      showError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      showError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/accounts/reset-password", {
        email: email.trim(),
        resetCode: resetCode.trim(),
        newPassword: password,
      });

      handleSuccessReset();
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Erro ao resetar senha. Verifique se o código está correto ou se não expirou.";

      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Layout Mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] p-6 font-sans">
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          isVisible={alertState.isVisible}
          onClose={hideAlert}
        />

        <div className="max-w-md mx-auto pt-8">
          <button
            onClick={() => navigate("/login")}
            className="mb-4 inline-flex items-center gap-1 text-[#31295F] text-sm hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="text-start mb-8">
            <h1 className="text-3xl max-w-xs font-bold text-[#2B2560]">
              Redefinir senha
            </h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#2B2560]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Digite o email cadastrado"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Digite o mesmo email usado para solicitar a recuperação de
                senha.
              </p>
            </div>

            <div>
              <label
                htmlFor="resetCode"
                className="mb-2 block text-sm font-medium text-[#2B2560]"
              >
                Código de recuperação
              </label>
              <textarea
                id="resetCode"
                name="resetCode"
                required
                rows={3}
                placeholder="Cole o código recebido por email"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F] font-mono text-xs resize-none"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                style={{ wordBreak: "break-all" }}
              />
              <p className="mt-1 text-xs text-gray-500">
                O código foi enviado para o seu email. Copie e cole-o no campo
                acima.
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#2B2560]"
              >
                Nova senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Digite sua nova senha"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#2B2560]"
              >
                Confirmar nova senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Digite a senha novamente"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
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
            <PasswordRequirements password={password} />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#31295F] px-4 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#292250] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Redefinindo..." : "Redefinir senha"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Layout Desktop
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#211C49] p-4 font-sans">
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />

      <main className="relative z-10 w-full max-w-3xl rounded-lg p-6 md:bg-[#F8F8FC] md:p-10 md:shadow-lg">
        <button
          onClick={() => navigate("/login")}
          className="mb-4 inline-flex items-center gap-1 text-white md:text-[#31295F] text-sm hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="text-start">
          <h1 className="text-2xl font-bold text-white md:text-[#2B2560]">
            Redefinir senha
          </h1>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="emailDesktop"
              className="mb-1 block text-sm font-medium text-white md:text-[#2B2560]"
            >
              Email
            </label>
            <input
              id="emailDesktop"
              name="email"
              type="email"
              required
              placeholder="Digite o email cadastrado"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Digite o mesmo email usado para solicitar a recuperação de senha.
            </p>
          </div>

          <div>
            <label
              htmlFor="resetCodeDesktop"
              className="mb-1 block text-sm font-medium text-white md:text-[#2B2560]"
            >
              Código de recuperação
            </label>
            <textarea
              id="resetCodeDesktop"
              name="resetCode"
              required
              rows={3}
              placeholder="Cole o código recebido por email"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F] font-mono text-xs resize-none"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              style={{ wordBreak: "break-all" }}
            />
            <p className="mt-1 text-xs text-gray-500">
              O código foi enviado para o seu email. Copie e cole-o no campo
              acima.
            </p>
          </div>

          <div>
            <label
              htmlFor="passwordDesktop"
              className="mb-1 block text-sm font-medium text-white md:text-[#2B2560]"
            >
              Nova senha
            </label>
            <div className="relative">
              <input
                id="passwordDesktop"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Digite sua nova senha"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPasswordDesktop"
              className="mb-1 block text-sm font-medium text-white md:text-[#2B2560]"
            >
              Confirmar nova senha
            </label>
            <div className="relative">
              <input
                id="confirmPasswordDesktop"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Digite a senha novamente"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

           {/* Requisitos da senha */}
           <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">
                A senha deve conter:
              </p>
              <ul className="space-y-1">
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
              </ul>
            </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#31295F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#292250] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Redefinindo..." : "Redefinir senha"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ResetPassword;
