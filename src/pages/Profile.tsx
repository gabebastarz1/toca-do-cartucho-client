import React from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";
import TopBar from "../components/TopBar";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import { User, Lock, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const Profile: React.FC = () => {
  const { userProfile } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName =
    userProfile?.firstName && userProfile?.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "";

  const displayEmail = userProfile?.email || user?.email;

  // Usar foto do perfil se disponível
  const profileImageUrl = (userProfile as UserWithProfileImage)?.profileImage
    ?.preSignedUrl;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

export default Profile;
