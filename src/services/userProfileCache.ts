import { UserDTO } from "../api/types";

let cachedUserProfile: UserDTO | null = null;

// Sistema de eventos para notificar componentes quando o cache é atualizado
type CacheUpdateListener = (userProfile: UserDTO | null) => void;
const listeners: Set<CacheUpdateListener> = new Set();

export const userProfileCache = {
  get: (): UserDTO | null => {
    return cachedUserProfile;
  },
  set: (userProfile: UserDTO | null): void => {
    cachedUserProfile = userProfile;
    // Notificar todos os listeners sobre a atualização
    listeners.forEach(listener => listener(userProfile));
  },
  clear: (): void => {
    cachedUserProfile = null;
    // Notificar todos os listeners sobre a limpeza
    listeners.forEach(listener => listener(null));
  },
  // Adicionar listener para mudanças no cache
  subscribe: (listener: CacheUpdateListener): (() => void) => {
    listeners.add(listener);
    // Retornar função para remover o listener
    return () => {
      listeners.delete(listener);
    };
  },
};

