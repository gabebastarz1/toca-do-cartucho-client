import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  // Verificar se estamos no lado do cliente antes de acessar window
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false; // Valor padrão para SSR
  });

  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === "undefined") {
      return;
    }

    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    // Definir o estado inicial
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
