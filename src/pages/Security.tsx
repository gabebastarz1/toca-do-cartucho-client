import React from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import BottomBar from "../components/BottomBar";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Lock, CircleCheckBig, CircleX } from "lucide-react";

const Security: React.FC = () => {
  const navigate = useNavigate();
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
              onClick={() => navigate("/perfil")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Meu perfil
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">
            Segurança
            </span>
          </div>
            
          <div className="bg-white rounded-lg shadow-sm p-4">
          <button className="px-10 py-4 w-full flex items-center gap-6"
          onClick={() => navigate("/alterar-senha")}
          >
              <Lock className="w-8 h-8 text-[#1E1E1E]" />
            <div className=" flex flex-col items-start">
              <h2 className="text-[18px] sm:text-[20px] font-normal text-black -mb-1">
                Alterar Senha
              </h2>
              <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40]">
                Gerenciar sua senha
              </p>
            </div>
          </button>
          <button className="px-10 py-4 w-full flex items-center gap-6"
          onClick={() => navigate("/autenticacao-2fa")}>
              <CircleCheckBig className="w-8 h-8 text-[#1E1E1E]" />
            <div className=" flex flex-col items-start ">
              <h2 className="text-[18px] sm:text-[20px] font-normal text-black -mb-1">
                Autenticação de dois fatores
              </h2>
              <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40]">
                Ative a autenticação de dois fatores em sua conta
              </p>
            </div>
          </button>
          <button className="px-10 py-4 w-full flex items-center gap-6 "
           onClick={() => navigate("/cancelar-conta")}>
              <CircleX className="w-8 h-8  text-[#1E1E1E]" />
            <div className=" flex flex-col items-start ">
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