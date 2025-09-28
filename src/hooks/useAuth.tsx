import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService, User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setCookieAuth: (cookieValue: string) => void;
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Debug dos cookies para diagnóstico
        authService.debugCookies();

        if (authService.isAuthenticated()) {
          const currentUser = authService.getUser();
          if (currentUser) {
            console.log("Usuário encontrado no localStorage:", currentUser);
            setUser(currentUser);
          } else {
            // Tentar obter usuário do servidor (pode haver cookie de sessão válido)
            console.log("Tentando obter usuário do servidor...");
            const serverUser = await authService.getCurrentUser();
            if (serverUser) {
              console.log("Usuário obtido do servidor:", serverUser);
              setUser(serverUser);
              // Salvar dados do usuário no localStorage para próximas verificações
              authService.setAuthData("cookie-based-auth", serverUser);
            } else {
              console.log(
                "Nenhum usuário encontrado no servidor, fazendo logout"
              );
              authService.logout();
            }
          }
        } else {
          console.log("Usuário não autenticado");
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
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
    login,
    register,
    logout,
    setCookieAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
