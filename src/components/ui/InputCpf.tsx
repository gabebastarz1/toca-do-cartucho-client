import React, { InputHTMLAttributes } from 'react';
import { cpfMask } from '../../utils/masks';

// Extendemos as propriedades padrão de um input
interface InputCpfProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  // O onChange agora retorna o valor sem máscara para o estado pai
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputCpf: React.FC<InputCpfProps> = ({ value, onChange, ...rest }) => {
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = cpfMask(event.target.value);
    onChange(event);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleInputChange}
      placeholder="000.000.000-00"
      maxLength={14}
      {...rest}
    />
  );
};