// src/components/BottomBar.tsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Heart, User } from "lucide-react"; // ✅ Ícone 'Info' trocado por 'Users'

interface BottomBarProps {
  className?: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: "about",
      label: "Sobre",
      icon: Users, // ✅ Ícone ajustado para corresponder à imagem
      path: "/sobre",
    },
    {
      id: "favorites",
      label: "Favoritos",
      icon: Heart,
      path: "/favoritos",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      path: "/perfil",
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div
      // ✅ Container principal com a cor de fundo e padding
      className={`fixed bottom-0 left-0 right-0 z-50 bg-[#211c49] p-2 md:hidden ${className}`}
    >
      <div className="flex w-full items-center justify-around">
        {" "}
        {/* ✅ Flex container para distribuir os itens igualmente */}
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              // ✅ Botão como um container flexível vertical com espaçamento
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-transform duration-200 ease-in-out active:scale-95"
            >
              {/* ✅ Container do Ícone: Onde a mágica do estado ativo acontece */}
              <div
                className={`flex h-[32px] w-[64px] items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive ? "bg-[#4A448C]" : "bg-transparent" // ✅ Cor de fundo condicional
                }`}
              >
                <IconComponent
                  className="h-6 w-6 text-[#edecf7]"
                  strokeWidth={isActive ? 2.5 : 2} // ✅ Deixa o ícone mais grosso quando ativo
                />
              </div>

              {/* ✅ Label do item */}
              <span
                className={`text-xs font-medium text-[#edecf7] transition-all duration-300 ${
                  isActive ? "font-semibold" : "font-normal" // ✅ Ajuste no peso da fonte
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;