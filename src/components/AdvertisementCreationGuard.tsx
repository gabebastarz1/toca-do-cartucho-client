import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import EmailConfirmationModal from "./EmailConfirmationModal";

interface AdvertisementCreationGuardProps {
  children: React.ReactNode;
}

const AdvertisementCreationGuard: React.FC<AdvertisementCreationGuardProps> = ({
  children,
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { userProfile, isLoading: profileLoading, refetch } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    // Usar userProfile se disponível, senão usar user
    const currentUser = userProfile || user;

    if (!currentUser) {
      // Se não há usuário, redirecionar para login
      navigate("/login", { state: { returnUrl: location.pathname } });
      return;
    }

    // Verificar se email está confirmado
    const emailConfirmed = currentUser.emailConfirmed === true;
    // Verificar se CPF está cadastrado (verificar se existe e não está vazio)
    const hasCpf =
      currentUser.cpf !== null &&
      currentUser.cpf !== undefined &&
      currentUser.cpf.trim() !== "";

    // Se não tem CPF, redirecionar para página de confirmação de CPF
    if (!hasCpf) {
      navigate("/confirmar-cpf", {
        state: { returnUrl: location.pathname },
      });
      return;
    }

    // Se email não está confirmado, mostrar modal
    if (!emailConfirmed) {
      setShowEmailModal(true);
      return;
    }
  }, [user, userProfile, authLoading, profileLoading, navigate, location]);

  // Se ainda está carregando, mostrar loading
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  // Verificar novamente antes de renderizar (redundância de segurança)
  const currentUser = userProfile || user;
  const emailConfirmed = currentUser?.emailConfirmed === true;
  const hasCpf =
    currentUser?.cpf !== null &&
    currentUser?.cpf !== undefined &&
    currentUser.cpf.trim() !== "";

  // Se não passar nas verificações, renderizar conteúdo com modal sobreposto
  if (!emailConfirmed || !hasCpf) {
    return (
      <>
        {children}
        {!emailConfirmed && currentUser?.email && (
          <EmailConfirmationModal
            isOpen={showEmailModal}
            onClose={() => {
              // Redirecionar para a tela inicial ao fechar o modal
              navigate("/");
            }}
            userEmail={currentUser.email}
            onEmailConfirmed={async () => {
              await refetch();
              setShowEmailModal(false);
            }}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default AdvertisementCreationGuard;
