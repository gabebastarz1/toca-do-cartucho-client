import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService, User } from "../services/authService";
import { twoFactorAuthService } from "../services/twoFactorAuthService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  show2FAAlert: boolean;
  login: (
    email: string,
    password: string,
    twoFactorCode?: string,
    twoFactorRecoveryCode?: string
  ) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setCookieAuth: (cookieValue: string) => void;
  hide2FAAlert: () => void;
  check2FAStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show2FAAlert, setShow2FAAlert] = useState(false);

  // Chave para controlar se o usuário já foi notificado nesta sessão
  const ALERT_SHOWN_KEY = "2fa_alert_shown";

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getUser();
          if (currentUser) {
            console.log(
              "✅ [useAuth] Usuário encontrado no localStorage:",
              currentUser.email
            );
            setUser(currentUser);
          } else {
            // Tentar obter usuário do servidor (pode haver cookie de sessão válido)
            console.log("🔍 [useAuth] Tentando obter usuário do servidor...");
            try {
              const serverUser = await authService.getCurrentUser();
              if (serverUser) {
                console.log(
                  "✅ [useAuth] Usuário obtido do servidor:",
                  serverUser.email
                );
                setUser(serverUser);
                // Salvar dados do usuário no localStorage para próximas verificações
                authService.setAuthData("cookie-based-auth", serverUser);
              } else {
                console.log(
                  "⚠️ [useAuth] Nenhum usuário retornado pelo servidor"
                );
                // Não fazer logout automaticamente - pode ser erro temporário
                // Apenas não definir o usuário
              }
            } catch (serverError) {
              console.error(
                "❌ [useAuth] Erro ao buscar usuário do servidor:",
                serverError
              );
              // Não fazer logout em erro de rede - deixar o cookie válido
              // O usuário pode estar offline temporariamente
            }
          }
        } else {
          console.log(
            "ℹ️ [useAuth] Usuário não autenticado (sem cookie ou localStorage)"
          );
        }
      } catch (error) {
        console.error("❌ [useAuth] Erro ao inicializar autenticação:", error);
        // Não fazer logout automático em erro genérico
        // Pode ser erro de rede ou temporário
        console.log(
          "⚠️ [useAuth] Mantendo estado atual - não fazer logout automático"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const check2FAStatus = async () => {
    try {
      // Verificar se já mostrou o alerta nesta sessão
      const alreadyShown = sessionStorage.getItem(ALERT_SHOWN_KEY);
      if (alreadyShown) {
        return;
      }

      const info = await twoFactorAuthService.get2FAInfo();

      // Se 2FA não está habilitado, mostrar alerta
      if (!info.isTwoFactorEnabled) {
        setShow2FAAlert(true);
        sessionStorage.setItem(ALERT_SHOWN_KEY, "true");
      }
    } catch (error) {
      console.error("Erro ao verificar status de 2FA:", error);
    }
  };

  const hide2FAAlert = () => {
    setShow2FAAlert(false);
  };

  const login = async (
    email: string,
    password: string,
    twoFactorCode?: string,
    twoFactorRecoveryCode?: string
  ) => {
    const response = await authService.login({
      email,
      password,
      twoFactorCode,
      twoFactorRecoveryCode,
    });
    setUser(response.user);

    // Verificar status de 2FA após login bem-sucedido
    await check2FAStatus();
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setShow2FAAlert(false);
    sessionStorage.removeItem(ALERT_SHOWN_KEY);
  };

  const setCookieAuth = (cookieValue: string) => {
    authService.setCookieAuth(cookieValue);
    const user = authService.getUser();
    setUser(user);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    show2FAAlert,
    login,
    register,
    logout,
    setCookieAuth,
    hide2FAAlert,
    check2FAStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
