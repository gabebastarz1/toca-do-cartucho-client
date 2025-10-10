import React from "react";
import { Link } from "react-router-dom";

// Ícones (substitua pelos seus ícones ou de uma biblioteca como lucide-react)
const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Caminho do ícone do Google */}
  </svg>
);

const Register: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#211c49] overflow-hidden flex items-center justify-center font-lexend py-10">
      {/* Background gradient */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background:
            "linear-gradient(150.27deg, rgba(33, 28, 73, 0) 24.08%, #212C49 50.13%, rgba(33, 28, 73, 0) 77.93%)",
        }}
      ></div>

      {/* Placeholder para a imagem do controle */}
      <div className="absolute bottom-[-50px] left-[calc(50%-450px)] w-[335px] h-[335px] bg-gray-500 opacity-20 rounded-full">
        {/* <img src="/path/to/controle-nintendo.png" alt="Controle Nintendo"/> */}
      </div>

      <main className="relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-lg p-8 mx-4">
        <div className="text-center text-white w-full">
          <h1 className="text-4xl font-normal leading-tight">Cadastre-se</h1>
          <p className="mt-4 text-base font-light">
            Já tem uma conta?
            <Link
              to="/login"
              className="font-semibold text-[#f0f0f0] hover:underline ml-2"
            >
              Login
            </Link>
          </p>
        </div>

        <form className="mt-8 w-full space-y-6">
          <div className="relative">
            <label
              htmlFor="fullName"
              className="absolute -top-3 left-4 px-1 bg-[#2b2560] text-sm font-light text-white rounded"
            >
              Nome Completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full h-14 bg-transparent border-2 border-white/50 rounded-lg text-white px-4 focus:outline-none focus:border-white"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-3 left-4 px-1 bg-[#2b2560] text-sm font-light text-white rounded"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full h-14 bg-transparent border-2 border-white/50 rounded-lg text-white px-4 focus:outline-none focus:border-white"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-3 left-4 px-1 bg-[#2b2560] text-sm font-light text-white rounded"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full h-14 bg-transparent border-2 border-white/50 rounded-lg text-white px-4 focus:outline-none focus:border-white"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="absolute -top-3 left-4 px-1 bg-[#2b2560] text-sm font-light text-white rounded"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full h-14 bg-transparent border-2 border-white/50 rounded-lg text-white px-4 focus:outline-none focus:border-white"
            />
          </div>

          <div className="text-white text-xs font-light space-y-1">
            <p>A senha deve conter:</p>
            <ul className="list-disc list-inside pl-2">
              <li>Mínimo de 6 caracteres</li>
              <li>1 letra maiúscula</li>
              <li>1 letra minúscula</li>
              <li>1 caractere especial</li>
              <li>1 dígito</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-[#f0f0f0] text-[#211c49] text-lg font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            CADASTRAR
          </button>
        </form>

        <div className="flex items-center w-full my-6">
          <hr className="flex-grow border-t border-white/50" />
          <span className="mx-4 text-white font-light text-center">Ou</span>
          <hr className="flex-grow border-t border-white/50" />
        </div>

        <button
          type="button"
          className="w-full h-14 bg-[#f0f0f0] text-[#211c49] text-lg font-normal rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <GoogleIcon />
          Cadastrar com Google
        </button>
      </main>
    </div>
  );
};

export default Register;
