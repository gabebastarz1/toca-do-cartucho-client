import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";

interface AdvertisementCreationGuardProps {
  children: React.ReactNode;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onOkClick: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  message,
  onOkClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Verificação Necessária
        </h2>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onOkClick}
            className="px-4 py-2 bg-[#38307C] text-white rounded hover:bg-[#2a2560] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const AdvertisementCreationGuard: React.FC<AdvertisementCreationGuardProps> = ({
  children,
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [hasCpfIssue, setHasCpfIssue] = useState(false);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    // Usar userProfile se disponível, senão usar user
    const currentUser = userProfile || user;

    if (!currentUser) {
      // Se não há usuário, redirecionar para login
      navigate("/login");
      return;
    }

    // Verificar se email está confirmado
    const emailConfirmed = currentUser.emailConfirmed === true;
    // Verificar se CPF está cadastrado (verificar se existe e não está vazio)
    const hasCpf =
      currentUser.cpf !== null &&
      currentUser.cpf !== undefined &&
      currentUser.cpf.trim() !== "";

    // Verificar requisitos
    if (!emailConfirmed && !hasCpf) {
      // Ambos faltando
      setModalMessage(
        "Para criar anúncios, você precisa:\n\n1. Confirmar seu email\n2. Adicionar seu CPF\n\nConfirme seu email e adicione seu CPF para continuar."
      );
      setHasCpfIssue(true);
      setShowModal(true);
    } else if (!emailConfirmed) {
      // Apenas email não confirmado
      setModalMessage(
        "Para criar anúncios, você precisa confirmar seu email.\n\nPor favor, verifique sua caixa de entrada e confirme seu email para continuar."
      );
      setHasCpfIssue(false);
      setShowModal(true);
    } else if (!hasCpf) {
      // Apenas CPF não cadastrado
      setModalMessage(
        "Para criar anúncios, você precisa adicionar seu CPF.\n\nClique em OK para ser redirecionado para a página de dados pessoais."
      );
      setHasCpfIssue(true);
      setShowModal(true);
    }
  }, [user, userProfile, authLoading, profileLoading, navigate]);

  const handleOkClick = () => {
    setShowModal(false);
    if (hasCpfIssue) {
      // Se falta CPF, redirecionar para /meus-dados
      navigate("/meus-dados");
    } else {
      navigate("/meu-perfil");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    // Ao fechar, voltar para a página anterior ou home
    navigate(-1);
  };

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

  // Se não passar nas verificações, não renderizar conteúdo (só o modal)
  if (!emailConfirmed || !hasCpf) {
    return (
      <>
        {/* Renderizar conteúdo no fundo mesmo com o modal aberto */}
        <div className={showModal ? "opacity-50 pointer-events-none" : ""}>
          {children}
        </div>
        <VerificationModal
          isOpen={showModal}
          onClose={handleClose}
          message={modalMessage}
          onOkClick={handleOkClick}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default AdvertisementCreationGuard;
