import React from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";
import TopBar from "../components/TopBar";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import {
  User,
  Lock,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { UserDTO } from "../api/types";
import { User as AuthUser } from "../services/authService";

// Tipo union para incluir profileImage
type UserWithProfileImage = (AuthUser | UserDTO) & {
  profileImage?: {
    id: number;
    originalFileName: string;
    userId: string;
    preSignedUrl: string;
    urlExpiresIn: string;
    createdAt: string;
  };
};

const MyProfile: React.FC = () => {
  const { userProfile } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const displayUser = userProfile || user;
  const displayName =
    displayUser?.firstName && displayUser?.lastName
      ? `${displayUser.firstName} ${displayUser.lastName}`
      : displayUser?.nickName || "Usuário";

  const displayEmail = displayUser?.email || "";

  const displayInitial =
    displayUser?.firstName?.charAt(0) ||
    displayUser?.nickName?.charAt(0) ||
    "U";

  // Usar foto do perfil se disponível
  const profileImageUrl = (displayUser as UserWithProfileImage)?.profileImage
    ?.preSignedUrl;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Layout Mobile - exatamente como a imagem
  if (isMobile) {
    return (
      <>
        <Head title="Meu Perfil" />
        <div className="min-h-screen bg-[#f4f3f5] md:hidden">
          {/* Header roxo escuro */}
          <div className="bg-[#2B2560] text-white">
            <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate("/perfil")}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-light ml-2">Meu Perfil</h1>
            </div>

            {/* Informações do perfil */}
            <div className="flex flex-col items-center pb-8 pt-6">
              {/* Foto do perfil */}
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover mb-4 bg-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
              ) : null}
              <div
                className={`w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 ${
                  profileImageUrl ? "hidden" : ""
                }`}
              >
                <span className="text-gray-500 text-4xl font-semibold">
                  {displayInitial}
                </span>
              </div>

              {/* Nome do usuário */}
              <h2 className="text-xl font-normal text-white mb-1">
                {displayName}
              </h2>

              {/* Email do usuário */}
              <p className="text-sm text-white/90">{displayEmail}</p>
            </div>
          </div>

          {/* Lista de opções */}
          <div className="bg-[#F4F3F5] flex-1 max-h-screen pt-4">
            <div className="space-y-0">
              {/* Meus Dados */}
              <button
                onClick={() => navigate("/meus-dados")}
                className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <User className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Meus Dados
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Gerenciar seus dados pessoais
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              {/* Segurança */}
              <button
                onClick={() => navigate("/seguranca")}
                className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <Lock className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Segurança
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Gerenciar segurança da sua conta e senha
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              {/* Meus Anúncios */}
              <button
                onClick={() => navigate("/meus-anuncios")}
                className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <Tag className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-black text-base font-semibold">
                    Meus Anúncios
                  </p>
                  <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                    Gerenciar seus anúncios
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

  // Layout Desktop
  return (
    <>
      <Head title="Meu Perfil" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      {/* 1. Container principal: Usa Flexbox para centralizar o conteúdo vertical e horizontalmente */}
      <main className="bg-[#f4f3f5] flex justify-center py-8 md:py-16 px-4 font-lexend min-h-screen">
        <div className="w-full max-w-fit">
          {/* 2. Cabeçalho do Perfil: Responsivo - horizontal no desktop, vertical no mobile */}
          <header className="flex flex-col sm:flex-row items-center sm:items-start mb-8 md:mb-10">
            {/* Imagem de Perfil */}
            <div className="w-[80px] h-[80px] sm:w-[64px] sm:h-[64px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0 overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para inicial se a imagem falhar
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden"
                    );
                  }}
                />
              ) : null}
              <span
                className={`text-white text-2xl sm:text-xl font-bold ${
                  profileImageUrl ? "hidden" : ""
                }`}
              >
                {getInitials(displayName)}
              </span>
            </div>

            {/* Nome e Email */}
            <div className="sm:ml-5 text-center sm:text-left">
              <h1 className="text-[24px] sm:text-[28px] md:text-[30px] font-normal text-black leading-tight">
                {displayName || "Usuário"}
              </h1>
              <p className="text-[18px] sm:text-[20px] md:text-[24px] font-light text-black leading-tight mt-1">
                {displayEmail || "email@exemplo.com"}
              </p>
            </div>
          </header>

          {/* 3. Container dos Cards: Responsivo - cards empilhados no mobile */}
          <section className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-[22px]">
            {/* Card: Meus Dados */}
            <button
              onClick={() => navigate("/meus-dados")}
              className="bg-white border border-[#908a99]/50 rounded-[10px] w-full sm:w-[379px] h-[140px] sm:h-[160px] p-4 sm:p-6 flex flex-col justify-start hover:shadow-md transition-shadow"
            >
              <User className="w-6 h-6 sm:w-5 sm:h-5" />
              <div className="mt-2 text-left">
                <h3 className="text-[18px] sm:text-[20px] font-normal text-black">
                  Meus Dados
                </h3>
                <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40] mt-2">
                  Gerenciar seus dados pessoais
                </p>
              </div>
            </button>

            {/* Card: Segurança */}
            <button
              onClick={() => navigate("/seguranca")}
              className="bg-white border border-[#908a99]/50 rounded-[10px] w-full sm:w-[379px] h-[140px] sm:h-[160px] p-4 sm:p-6 flex flex-col justify-start hover:shadow-md transition-shadow"
            >
              <Lock className="w-6 h-6 sm:w-5 sm:h-5" />
              <div className="mt-2 text-left">
                <h3 className="text-[18px] sm:text-[20px] font-normal text-black">
                  Segurança
                </h3>
                <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40] mt-2">
                  Gerenciar segurança da sua conta e senha
                </p>
              </div>
            </button>

            {/* Card: Meus Anúncios */}
            <button
              onClick={() => navigate("/meus-anuncios")}
              className="bg-white border border-[#908a99]/50 rounded-[10px] w-full sm:w-[379px] h-[140px] sm:h-[160px] p-4 sm:p-6 flex flex-col justify-start hover:shadow-md transition-shadow"
            >
              <ShoppingBag className="w-6 h-6 sm:w-5 sm:h-5" />
              <div className="mt-2 text-left">
                <h3 className="text-[18px] sm:text-[20px] font-normal text-black">
                  Meus Anúncios
                </h3>
                <p className="text-[12px] sm:text-[14px] font-normal text-[#3c3a40] mt-2">
                  Gerenciar seus anúncios
                </p>
              </div>
            </button>
          </section>
        </div>
      </main>
      <Footer />
      <BottomBar />
    </>
  );
};

export default MyProfile;
