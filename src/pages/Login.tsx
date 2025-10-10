import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSymbol from "../../public/Icons/google_symbol.svg";
import GameControllerImage from "../assets/controller.png";
import CustomCheckbox from "../components/ui/CustomCheckbox";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authService.login({ email, password });
      loginContext(user, token); // Atualiza o contexto de autenticação
      navigate("/"); // Redireciona para a home page
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const frontendRedirectUrl = window.location.origin;
    const googleLoginUrl = `http://localhost:5236/api/accounts/login/google?finalRedirectUrl=${encodeURIComponent(
      frontendRedirectUrl
    )}`;
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2B2560] p-4 font-sans">
      {/* Game controller is now hidden on mobile and appears on medium screens and up */}
      <img
        src={GameControllerImage}
        alt="Controle"
        className="absolute bottom-16 left-[calc(53%-480px)] z-50 hidden w-80 transform md:block"
      />

      {/* The <main> element now has padding for mobile, 
        and the card styles (background, shadow, more padding) are applied only on medium screens and up.
      */}
      <main className="relative z-10 w-full max-w-md rounded-lg p-6 md:bg-[#E8E6F1] md:p-10 md:shadow-lg">
        <div className="text-center">
          {/* Text colors change based on screen size for readability */}
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
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Digite sua senha"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#31295F] focus:outline-none focus:ring-1 focus:ring-[#31295F]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full justify-center rounded-md bg-[#31295F] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#292250] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Acessando..." : "Acessar"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          {/* Separator line color adjusted for dark background */}
          <hr className="flex-grow border-t border-gray-500 md:border-gray-300" />
          <span className="mx-4 text-xs text-gray-400 md:text-gray-500">Ou</span>
          <hr className="flex-grow border-t border-gray-500 md:border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 text-sm font-medium text-[#2B2560] shadow-sm transition-colors hover:bg-gray-50"
        >
          <img src={GoogleSymbol} alt="Google Symbol" className="h-5 w-5" />
          Entrar com o Google
        </button>
      </main>
    </div>
  );
};

export default Login;