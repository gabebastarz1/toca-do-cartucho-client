import { useEffect, useRef } from "react";

/**
 * Hook para detectar cliques fora de um elemento
 * @param callback - Função a ser executada quando clicar fora
 * @returns Ref para ser atribuído ao elemento que queremos monitorar
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Adiciona o listener quando o componente monta
    document.addEventListener("mousedown", handleClickOutside);

    // Remove o listener quando o componente desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}


