import React from "react";
import { StepProps } from "./types";
import { InputCpf } from "../ui/InputCpf";

const StepTwo: React.FC<StepProps> = ({ formData, errors, handleChange }) => {
  return (
    <>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-brand-dark mb-1"
          >
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite seu nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          {errors.nome && (
            <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="sobrenome"
            className="block text-sm font-medium text-brand-dark mb-1"
          >
            Sobrenome
          </label>
          <input
            type="text"
            id="sobrenome"
            name="sobrenome"
            placeholder="Digite seu sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          {errors.sobrenome && (
            <p className="text-red-500 text-xs mt-1">{errors.sobrenome}</p>
          )}
        </div>
      </div>

      <div className="mb-4"></div>

      <div className="mb-4">
        <label
          htmlFor="nomeUsuario"
          className="block text-sm font-medium text-brand-dark mb-1"
        >
          Nome de usuário
        </label>
        <input
          type="text"
          id="nomeUsuario"
          name="nomeUsuario"
          placeholder="Digite seu nome de usuario"
          value={formData.nomeUsuario}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.nomeUsuario && (
          <p className="text-red-500 text-xs mt-1">{errors.nomeUsuario}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="dataNascimento"
          className="block text-sm font-medium text-brand-dark mb-1"
        >
          Data de nascimento
        </label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          placeholder="Digite sua data de nascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.dataNascimento && (
          <p className="text-red-500 text-xs mt-1">{errors.dataNascimento}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="cpf"
          className="block text-sm font-medium text-brand-dark mb-1"
        >
          CPF (Opcional)
        </label>
        <InputCpf
          type="text"
          id="cpf"
          name="cpf"
          placeholder="Digite seu CPF"
          value={formData.cpf}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.cpf && (
          <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
        )}
      </div>
    </>
  );
};

export default StepTwo;
