// src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

// Hook customizado para "atrasar" a atualização de um valor.
// Isso é útil para evitar chamadas de API a cada tecla digitada.
function useDebounce<T>(value: T, delay: number): T {
  // Estado para armazenar o valor "atrasado"
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um temporizador que só vai atualizar o estado após o 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Função de limpeza: cancela o temporizador se o valor mudar antes do delay
    // Isso garante que a atualização só aconteça quando o usuário para de digitar.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // O efeito é re-executado se o valor ou o delay mudarem

  return debouncedValue;
}

export default useDebounce;
