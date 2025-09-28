import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ChevronUp } from "lucide-react";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-[#f1edf5] border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="relative p-4 pb-0">
        {/* Header com foto e nome */}
        <button onClick={() => handleMenuItemClick("/perfil")} className="w-full">    
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            <span className="text-gray-600 text-lg font-semibold">
              {user?.firstName?.charAt(0) || user?.nickName?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-black text-base font-normal leading-6">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.nickName || "Usuário"}
            </p>
            <p className="text-black text-xs font-light leading-4 mt-1 flex items-center gap-1">
              Meu Perfil <ChevronUp className="w-3.5 h-3.5 text-black rotate-90" />
            </p>     
          </div>
        </div>
        </button>

        {/* Separador */}
        <div className="border-t border-black/20 "></div>

        {/* Menu items */}
        <div className="space-y-0">
          <button
            onClick={() => handleMenuItemClick("/perfil")}
            className="w-full text-center py-3 px-0 text-black text-sm font-normal hover:bg-black/5 transition-colors"
          >
            Meus Dados
          </button>

          <div className="border-t border-black/20"></div>

          <button
            onClick={() => handleMenuItemClick("/favoritos")}
            className="w-full text-center py-3 px-0 text-black text-sm font-normal hover:bg-black/5 transition-colors"
          >
            Meus Favoritos
          </button>

          <div className="border-t border-black/20"></div>

          <button
            onClick={() => handleMenuItemClick("/criar-anuncio")}
            className="w-full text-center py-3 px-0 text-black text-sm font-normal hover:bg-black/5 transition-colors"
          >
            Vender
          </button>

          <div className="border-t border-black/20"></div>

          <button
            onClick={handleLogout}
            className="w-full text-center py-3 px-0 text-black text-sm font-normal hover:bg-black/5 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
