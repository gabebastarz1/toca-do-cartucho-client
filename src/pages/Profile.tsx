import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { UserDTO } from "../api/types";
import { User as AuthUser } from "../services/authService";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { useIsMobile } from "../hooks/useIsMobile";

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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const { userProfile } = useUserProfile();

  // Usar dados do perfil se disponível, senão do contexto de autenticação
  const displayUser = userProfile || user;
  const displayName =
    displayUser?.firstName && displayUser?.lastName
      ? `${displayUser.firstName} ${displayUser.lastName}`
      : displayUser?.nickName || "Usuário";

  const displayUsername = displayUser?.nickName || "";
  const displayEmail = displayUser?.email || "";

  const displayInitial =
    displayUser?.firstName?.charAt(0) ||
    displayUser?.nickName?.charAt(0) ||
    "U";

  // Usar foto do perfil se disponível
  const profileImageUrl = (displayUser as UserWithProfileImage)?.profileImage
    ?.preSignedUrl;

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  // Redirecionar para /meu-perfil se não estiver no mobile
  useEffect(() => {
    if (!isMobile) {
      navigate("/meu-perfil", { replace: true });
    }
  }, [isMobile, navigate]);

  // Layout Mobile 
  return (
    <>
      <Head title="Meu Perfil" />
      <div className="min-h-screen bg-[#f4f3f5] md:hidden">
        {/* Header roxo escuro */}
        <div className="bg-[#2B2560] text-white">
          <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
            <button
              onClick={() => navigate("/")}
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
              className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 ${
                profileImageUrl ? "hidden" : ""
              }`}
            >
              <span className="text-gray-600 text-4xl font-semibold">
                {displayInitial}
              </span>
            </div>

            {/* Nome do usuário */}
            <h2 className="text-xl font-normal text-white mb-1">
              {displayName}
            </h2>

            {/* Nome de usuário (nickName) */}
            {displayUsername && (
              <p className="text-sm text-white/90 mb-1">{displayUsername}</p>
            )}

            {/* Email do usuário */}
            {displayEmail && (
              <p className="text-sm text-white/90">{displayEmail}</p>
            )}
          </div>
        </div>

        {/* Lista de opções */}
        <div className="bg-[#f4f3f5] flex-1 max-h-screen pt-4 pb-20">
          <div className="space-y-0">
            {/* Meu Perfil */}
            <button
              onClick={() => handleMenuItemClick("/meu-perfil")}
              className="w-full flex items-center px-4 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <User className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-black text-base font-semibold">
                  Meu Perfil
                </p>
                <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                  Gerenciar seu perfil
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>

            {/* Meus Favoritos */}
            <button
              onClick={() => handleMenuItemClick("/favoritos")}
              className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <Heart className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-black text-base font-semibold">
                  Meus Favoritos
                </p>
                <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                  Ver seus produtos favoritos
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>

            {/* Vender */}
            <button
              onClick={() => handleMenuItemClick("/criar-anuncio")}
              className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-black text-base font-semibold">Vender</p>
                <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                  Criar um novo anúncio
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>

            {/* Sair */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-4 mt-1 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <LogOut className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-black text-base font-semibold">Sair</p>
                <p className="text-black text-sm font-light text-gray-600 mt-0.5">
                  Fazer logout da sua conta
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
};

export default Profile;
