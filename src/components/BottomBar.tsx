// src/components/BottomBar.tsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Heart, User } from "lucide-react";

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
      icon: Users,
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

      className={`fixed bottom-0 left-0 right-0 z-50 bg-[#211C49] p-1 md:hidden ${className}`}
    >
      <div className="flex w-full items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}

              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-transform duration-200 ease-in-out active:scale-95"
            >

              <div
                className={`flex h-[32px] w-[64px] items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive ? "bg-[#4A448C]" : "bg-transparent" 
                }`}
              >
                <IconComponent
                  className="h-6 w-6 text-[#edecf7]"
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </div>


              <span
                className={`text-xs font-medium text-[#edecf7] transition-all duration-300 ${
                  isActive ? "font-semibold" : "font-normal"
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