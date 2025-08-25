import React from "react";

interface ConfirmButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children = "Confirmar",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#483D9E] hover:bg-[#211C49] text-white font-medium py-2 px-6 rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default ConfirmButton;
