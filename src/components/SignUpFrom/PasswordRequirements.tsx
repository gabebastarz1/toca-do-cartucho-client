import React from "react";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

interface PasswordRequirementsProps {
  password?: string;
}

const Requirement: React.FC<{ met: boolean; text: string }> = ({
  met,
  text,
}) => (
  <li
    className={`flex items-center ${met ? "text-[#47884F]" : "text-[#DC5959]"}`}
  >
    {met ? <FaCheck className="mr-1" /> : <IoCloseSharp className="mr-1" />}
    {text}
  </li>
);

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password = "",
}) => {
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasDigit = /\d/.test(password);

  return (
    <ul className="text-xs md:text-gray-600 mt-2 list-none pl-0">
      A senha deve conter:
      <Requirement met={hasMinLength} text="Mínimo de 6 caracteres" />
      <Requirement met={hasUppercase} text="1 letra maiúscula" />
      <Requirement met={hasLowercase} text="1 letra minúscula" />
      <Requirement met={hasSpecialChar} text="1 caractere especial" />
      <Requirement met={hasDigit} text="1 dígito" />
    </ul>
  );
};

export default PasswordRequirements;
