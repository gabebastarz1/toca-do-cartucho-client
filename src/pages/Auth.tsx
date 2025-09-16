import React, { useState } from "react";
import {
  authService,
  LoginRequest,
  RegisterRequest,
} from "../services/authService";
//import CookieAuth from "../components/CookieAuth";

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    "login"
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickName: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activeTab === "login") {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };

        await authService.login(loginData);
        // Redirecionar para dashboard
        window.location.href = "/";
      } else if (activeTab === "register") {
        if (formData.password !== formData.confirmPassword) {
          setError("As senhas não coincidem");
          return;
        }

        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          firstName: formData.nickName.split(" ")[0] || formData.nickName,
          lastName: formData.nickName.split(" ")[1] || "",
          nickName: formData.nickName,
        };

        await authService.register(registerData);
        setActiveTab("login");
        setError("Registro realizado com sucesso! Faça login.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar solicitação";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Toca do Cartucho
            </h1>
            <p className="text-gray-600">
              {activeTab === "login"
                ? "Faça login na sua conta"
                : activeTab === "register"
                ? "Crie uma nova conta"
                : ""}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Registrar
            </button>
            
          </div>

          {/* Content */}
          
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "register" && (
                <div>
                  <label
                    htmlFor="nickName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    id="nickName"
                    name="nickName"
                    value={formData.nickName}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu nome de usuário"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite seu email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {activeTab === "register" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Confirme sua senha"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {activeTab === "login" ? "Entrando..." : "Registrando..."}
                  </div>
                ) : activeTab === "login" ? (
                  "Entrar"
                ) : (
                  "Registrar"
                )}
              </button>
            </form>
          
        </div>
      </div>
    </div>
  );
};

export default Auth;
