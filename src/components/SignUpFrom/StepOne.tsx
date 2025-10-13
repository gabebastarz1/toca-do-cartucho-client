import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { StepProps } from "./types";
import PasswordRequirements from "./PasswordRequirements";

// Estende a interface para incluir as novas props
interface StepOneProps extends StepProps {
  showPassword?: boolean;
  toggleShowPassword?: () => void;
  showConfirmPassword?: boolean;
  toggleShowConfirmPassword?: () => void;
}

const StepOne: React.FC<StepOneProps> = ({
  formData,
  errors,
  handleChange,
  showPassword,
  toggleShowPassword,
  showConfirmPassword,
  toggleShowConfirmPassword,
}) => {
  return (
    <>
      <div className="mb-4 ">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-brand-dark mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="mb-4 flex-1">
          <label
            htmlFor="senha"
            className="block text-sm font-medium text-brand-dark mb-1"
          >
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              name="senha"
              placeholder="Crie uma senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark text-black"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <label
            htmlFor="confirmeSenha"
            className="block text-sm font-medium text-brand-dark mb-1"
          >
            Repita sua senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmeSenha"
              name="confirmeSenha"
              placeholder="Repita sua senha"
              value={formData.confirmeSenha}
              onChange={handleChange}
              className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark text-black"
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmeSenha && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmeSenha}</p>
          )}
        </div>
      </div>

      <PasswordRequirements password={formData.senha} />
      {errors.senha && (
        <p className="text-red-500 text-xs mt-1">{errors.senha}</p>
      )}
    </>
  );
};

export default StepOne;
