import React from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import BottomBar from "../components/BottomBar";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Lock,
  CircleCheckBig,
  CircleX,
  ArrowLeft,
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

const Security: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Layout Mobile - exatamente como a imagem
  if (isMobile) {
    return (
      <>
        <Head title="Segurança" />
        <div className="min-h-screen bg-[#f4f3f5] md:hidden">
          {/* Header roxo escuro */}
          <div className="bg-[#2B2560] text-white">
            <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate("/meu-perfil")}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-light ml-2">Segurança</h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-[#F4F3F5] max-h-screen pt-4 pb-20">
            <div className="space-y-0">
              {/* Alterar senha */}
              <button
                onClick={() => navigate("/alterar-senha")}
                className="w-full  flex items-center px-4 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <Lock className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Alterar senha
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Gerenciar sua senha
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              {/* Autenticação de dois fatores */}
              <button
                onClick={() => navigate("/autenticacao-2fa")}
                className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <CircleCheckBig className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Autenticação de dois fatores
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Ative a autenticação de dois fatores na sua conta
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              {/* Cancelar conta */}
              <button
                onClick={() => navigate("/cancelar-conta")}
                className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <CircleX className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Cancelar conta
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Desativar ou Excluir sua conta
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  // Layout Desktop - mantém o layout original
  return (
    <>
      <Head title="Segurança" />
      <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
      <FilterTopBar />
      <div className="min-h-screen bg-[#f4f3f5] pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/meu-perfil")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Meu perfil
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">Segurança</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <button
              className="px-10 py-4 w-full flex items-center gap-6"
              onClick={() => navigate("/alterar-senha")}
            >
              <Lock className="w-8 h-8 text-[#1E1E1E]" />
              <div className="flex flex-col items-start">
                <h2 className="text-[18px] sm:text-[20px] font-normal text-black -mb-1">
                  Alterar Senha
                </h2>
                <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40]">
                  Gerenciar sua senha
                </p>
              </div>
            </button>
            <button
              className="px-10 py-4 w-full flex items-center gap-6"
              onClick={() => navigate("/autenticacao-2fa")}
            >
              <CircleCheckBig className="w-8 h-8 text-[#1E1E1E]" />
              <div className="flex flex-col items-start">
                <h2 className="text-[18px] sm:text-[20px] font-normal text-black -mb-1">
                  Autenticação de dois fatores
                </h2>
                <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40]">
                  Ative a autenticação de dois fatores em sua conta
                </p>
              </div>
            </button>
            <button
              className="px-10 py-4 w-full flex items-center gap-6"
              onClick={() => navigate("/cancelar-conta")}
            >
              <CircleX className="w-8 h-8 text-[#1E1E1E]" />
              <div className="flex flex-col items-start">
                <h2 className="text-[18px] sm:text-[20px] font-normal text-black -mb-1">
                  Cancelar Conta
                </h2>
                <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40]">
                  Desativar ou Excluir sua conta
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <BottomBar />
      <Footer showBackToTopButton={true} />
    </>
  );
};

export default Security;
