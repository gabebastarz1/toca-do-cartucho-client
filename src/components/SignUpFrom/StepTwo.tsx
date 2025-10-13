import React from 'react';
import { StepProps } from './types';
import { InputCpf } from '../ui/InputCpf';

const StepTwo: React.FC<StepProps> = ({ formData, errors, handleChange }) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="nome" className="block text-sm font-medium text-brand-dark mb-1">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Seu nome"
          value={formData.nome}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="sobrenome" className="block text-sm font-medium text-brand-dark mb-1">
          Sobrenome
        </label>
        <input
          type="text"
          id="sobrenome"
          name="sobrenome"
          placeholder="Seu sobrenome"
          value={formData.sobrenome}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.sobrenome && <p className="text-red-500 text-xs mt-1">{errors.sobrenome}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="nomeUsuario" className="block text-sm font-medium text-brand-dark mb-1">
          Nome de usuário
        </label>
        <input
          type="text"
          id="nomeUsuario"
          name="nomeUsuario"
          placeholder="Escolha um nome de usuário"
          value={formData.nomeUsuario}
          onChange={handleChange}
          className="w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        />
        {errors.nomeUsuario && <p className="text-red-500 text-xs mt-1">{errors.nomeUsuario}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="cpf" className="block text-sm font-medium text-brand-dark mb-1">
          CPF (Opcional)
        </label>
        <InputCpf
          type="text"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={handleChange}
          className='w-full p-3 bg-brand-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-dark'
        />
      </div>
    </>
  );
};

export default StepTwo;