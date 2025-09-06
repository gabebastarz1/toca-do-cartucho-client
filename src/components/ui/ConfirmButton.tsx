import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";


interface ConfirmButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children = "Confirmar",
  onClick,
  className = "",
  disabled = false,
}) => {
  const isMobile = useIsMobile();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#483D9E] hover:bg-[#211C49] ${
        isMobile ? "w-full py-4" : "px-6 py-2"
      } text-white font-medium  rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#483D9E] ${className}`}
    >
      {children}
    </button>
  );
};

export default ConfirmButton;
