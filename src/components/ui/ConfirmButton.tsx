import React from "react";

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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#483D9E] hover:bg-[#211C49] text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#483D9E] ${className}`}
    >
      {children}
    </button>
  );
};

export default ConfirmButton;
