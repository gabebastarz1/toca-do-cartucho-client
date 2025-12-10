import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService, User, RegisterRequest } from "../services/authService";
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
    twoFactorRecoveryCode?: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setCookieAuth: (cookieValue: string) => void;
  hide2FAAlert: () => void;
  check2FAStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
        // 1. Estratégia Otimista: Verificar LocalStorage
        // Isso garante que a UI carregue logada instantaneamente se o usuário já logou antes
        const storedUser = authService.getUser();
        
        if (storedUser) {
          setUser(storedUser);
          
          // Opcional: Validar se a sessão no servidor ainda é válida em background
          // Se der erro 401, o interceptor (agora configurado corretamente) lidará com isso
          authService.getCurrentUser().catch(() => {
             // Se falhar silenciosamente, ok. Se o token expirou, o interceptor
             // cuidará do logout na próxima interação do usuário.
          });
        } else {
          // 2. Estratégia de Persistência (Cookie):
          // Se não tem nada no LocalStorage, pode ser que o usuário fechou o navegador
          // mas o Cookie ainda está válido. Tentamos pegar o usuário silenciosamente.
          try {
            // Passamos 'true' para pular o interceptor e não gerar erros de console/redirects
            // caso o usuário seja apenas um visitante anônimo.
            const serverUser = await authService.getCurrentUser();
            
            if (serverUser) {
              setUser(serverUser);
              authService.setAuthData("cookie-based-auth", serverUser);
            }
          } catch {
            // Visitante anônimo ou cookie expirado. Não fazemos nada.
          }
        }
      } catch (error) {
        console.error("Erro na inicialização da autenticação:", error);
        // Em caso de erro crítico, garantimos estado limpo
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const check2FAStatus = async () => {
    if (!user) return; // Não verifica se não estiver logado

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
    twoFactorRecoveryCode?: string,
    rememberMe?: boolean
  ) => {
    // O authService.login agora já cuida do retry e da espera do cookie
    const response = await authService.login({
      email,
      password,
      twoFactorCode,
      twoFactorRecoveryCode,
      rememberMe,
    });
    
    setUser(response.user);

    // Verificar status de 2FA após login bem-sucedido
    // Pequeno delay para garantir que estado propagou
    setTimeout(() => check2FAStatus(), 1000);
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authService.register(userData);
    // Se o registro retornar usuário (sem confirmação de email), setamos
    if (response.user) {
        setUser(response.user);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setShow2FAAlert(false);
    sessionStorage.removeItem(ALERT_SHOWN_KEY);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setCookieAuth = (cookieValue: string) => {
    // Atualiza o estado se for detectado login externo
    const user = authService.getUser();
    if (!user) {
      authService.getCurrentUser().then((serverUser) => {
        if (serverUser) {
          setUser(serverUser);
          authService.setAuthData("cookie-based-auth", serverUser);
        }
      });
    } else {
      setUser(user);
    }
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