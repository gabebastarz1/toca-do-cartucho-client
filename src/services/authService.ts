import { api } from './api';
import { userProfileCache } from './userProfileCache';
import { UserDTO } from '../api/types';
import axios from 'axios';
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nickName: string;
  roles: string[];
  phoneNumber?: string;
  slug?: string;
  cpf?: string | null;
  emailConfirmed?: boolean;
  birthdayDate?: string | null;
  age?: number;
  profileImage?: {
    id: number;
    originalFileName: string;
    userId: string;
    preSignedUrl: string;
    urlExpiresIn: string;
    createdAt: string;
  };
  addresses?: Array<{
    id: number;
    isPrimary: boolean;
    userId: string;
    address: {
      id: number;
      zipCode: string;
      street: string;
      number: string;
      complement?: string | null;
      neighborhood: string;
      city: string;
      state: string;
      createdAt: string;
    };
    createdAt: string;
  }>;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  nickName: string;
  cpf?: string | null;
  birthdayDate?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const API_URL =  import.meta.env.VITE_API_URL;

// Helper function to convert User to UserDTO
const convertUserToUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    nickName: user.nickName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    slug: user.slug,
    phoneNumber: user.phoneNumber,
    cpf: user.cpf,
    emailConfirmed: user.emailConfirmed,
    birthdayDate: user.birthdayDate,
    age: user.age,
    addresses: user.addresses,
    roles: user.roles,
    profileImage: user.profileImage
  };
};

export const handleGoogleLogin = () => {
  const finalRedirectUrl = window.location.origin;

  const googleLoginUrl = `${API_URL}/api/accounts/login/google?finalRedirectUrl=${encodeURIComponent(
    finalRedirectUrl
  )}`;
  window.location.href = googleLoginUrl;
};

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';





  // Login usando endpoint do Identity API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/accounts/login', credentials, {
        params: {
          useCookies: true,
          useSessionCookies: false
        }
      });

      // Se o backend retornar um token JWT
      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
        userProfileCache.set(convertUserToUserDTO(response.data.user)); // Cache user data
        return response.data;
      }

      const user = await this.getCurrentUser();
      userProfileCache.set(user ? convertUserToUserDTO(user) : null); // Cache user data
      return {
        token: 'cookie-based-auth',
        user: user!
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response;
      }
      throw new Error("Erro ao fazer login");
    }
  }

  // Registro usando endpoint do Identity API
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/accounts/signup', userData);

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
        userProfileCache.set(convertUserToUserDTO(response.data.user)); // Cache user data
        return response.data;
      }

      const user = await this.getCurrentUser();
      userProfileCache.set(user ? convertUserToUserDTO(user) : null); // Cache user data
      return {
        token: 'cookie-based-auth',
        user: user!
      };
    } catch (error: unknown) {
      // Lança o erro com detalhes para ser tratado no componente
      if (axios.isAxiosError(error) && error.response) {
        throw error.response;
      }
      throw new Error('Erro ao registrar usuário');
    }
  }

  // Verifica se o nome de usuário já existe
  async checkNicknameExists(nickName: string): Promise<boolean> {
    try {
      const response = await api.get("/api/accounts/signup/nickname-exists", {
        params: { nickName },
      });
      return response.data; // A API deve retornar true se existir, false se não
    } catch (error) {
      console.error("Erro ao verificar o nome de usuário:", error);
      // Em caso de erro na verificação, assume que pode prosseguir para não bloquear o usuário
      // mas loga o erro. A validação final do backend ainda vai pegar.
      return false;
    }
  }

  // Confirmação de e-mail
  async confirmEmail(userId: string, code: string, changedEmail?: string): Promise<void> {
    try {
      const params: Record<string, string> = { userId, code };
      if (changedEmail) {
        params.changedEmail = changedEmail;
      }
      await api.get('/api/accounts/confirm-email', {
        params,
      });
    } catch (error) {
      console.error("Erro ao confirmar e-mail:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response;
      }
      throw new Error('Erro ao confirmar e-mail');
    }
  }

  // Verificar se a sessão no servidor ainda está ativa
  async isServerSessionValid(): Promise<boolean> {
    try {
      
      const response = await api.get('/api/accounts/profile');
      
      return response.status === 200;
    } catch (error) {
   
      return false;
    }
  }

  // Logout com verificação de sessão
  async logout(): Promise<void> {
    try {
   
      await api.get('/api/accounts/profile/logout');
  
    } finally {
      this.clearAuthData();
      userProfileCache.clear(); // Clear cache on logout

    }
  }

  // Logout seguro - só limpa se a sessão realmente expirou
  async safeLogout(): Promise<void> {
    const hasValidCookie = this.hasSessionCookie();
    const isServerValid = await this.isServerSessionValid();



    if (!hasValidCookie && !isServerValid) {
      
      await this.logout();
    } 
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
     
      const response = await api.get('/api/accounts/profile');
     
      userProfileCache.set(response.data); // Cache user data
      return response.data;
    } catch {
 
      return null;
    }
  }

  // Verificar se existe cookie de sessão válido 
  hasSessionCookie(): boolean {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => {
      const trimmedCookie = cookie.trim();
      // Verificar diferentes variações do nome do cookie
      return (
        (trimmedCookie.startsWith('Identity.Application=') || 
         trimmedCookie.startsWith('.AspNetCore.Identity.Application=') ||
         trimmedCookie.startsWith('__RequestVerificationToken=')) &&
        trimmedCookie.split('=')[1] && 
        trimmedCookie.split('=')[1] !== ''
      );
    });
  }

  // Obter valor do cookie Identity.Application (melhorado)
  getIdentityCookie(): string | null {
    const cookies = document.cookie.split(';');
    
    const cookieNames = [
      'Identity.Application',
      '.AspNetCore.Identity.Application',
      '__RequestVerificationToken'
    ];
    
    for (const cookieName of cookieNames) {
      const identityCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${cookieName}=`)
      );
      
      if (identityCookie) {
        const value = identityCookie.trim().split('=')[1];
        return value || null;
      }
    }
    
    return null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (token && user) {
      return true;
    }
    
    return this.hasSessionCookie();
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  setAuthData(token: string, user: User): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('Administrator');
  }

  // debugCookies(): void {
  //   console.log("=== DEBUG COOKIES ===");
  //   console.log("document.cookie:", document.cookie);
    
  //   const cookies = document.cookie.split(';');
  //   console.log("Cookies encontrados:");
  //   cookies.forEach((cookie, index) => {
  //     const [name, value] = cookie.trim().split('=');
  //     console.log(`${index + 1}. ${name}: ${value ? '***' : 'vazio'}`);
  //   });
    
  //   const identityCookie = this.getIdentityCookie();
  //   console.log("Identity.Application cookie:", identityCookie ? 'existe' : 'não existe');
  //   console.log("hasSessionCookie():", this.hasSessionCookie());
  //   console.log("isAuthenticated():", this.isAuthenticated());
  //   console.log("localStorage authToken:", localStorage.getItem(this.AUTH_TOKEN_KEY) ? 'existe' : 'não existe');
  //   console.log("localStorage user:", localStorage.getItem(this.USER_KEY) ? 'existe' : 'não existe');
    
  //   // Debug adicional para cookies específicos
  //   console.log("=== COOKIES ESPECÍFICOS ===");
  //   const specificCookies = [
  //     'Identity.Application',
  //     '.AspNetCore.Identity.Application', 
  //     '__RequestVerificationToken',
  //     'ASP.NET_SessionId'
  //   ];
    
  //   specificCookies.forEach(cookieName => {
  //     const cookie = cookies.find(c => c.trim().startsWith(`${cookieName}=`));
  //     console.log(`${cookieName}:`, cookie ? 'existe' : 'não existe');
  //   });
    
  //   console.log("===================");
  // }

  //==================================================== listar todos os cookies com detalhes
  
  // listAllCookies(): void {
  //   console.log("=== TODOS OS COOKIES DETALHADOS ===");
  //   console.log("document.cookie completo:", document.cookie);
    
  //   const cookies = document.cookie.split(';');
  //   if (cookies.length === 1 && cookies[0].trim() === '') {
  //     console.log("❌ Nenhum cookie encontrado");
  //     return;
  //   }
    
  //   cookies.forEach((cookie, index) => {
  //     const trimmedCookie = cookie.trim();
  //     if (trimmedCookie) {
  //       const [name, ...valueParts] = trimmedCookie.split('=');
  //       const value = valueParts.join('=');
  //       console.log(`${index + 1}. Nome: "${name}"`);
  //       console.log(`   Valor: ${value ? `"${value.substring(0, 20)}${value.length > 20 ? '...' : ''}"` : 'vazio'}`);
  //       console.log(`   Tamanho: ${value ? value.length : 0} caracteres`);
  //       console.log('---');
  //     }
  //   });
    
  //   console.log("=====================================");
  // }

  // ================================================ testar autenticação manualmente
  // async testAuthentication(): Promise<void> {
  //   console.log("=== TESTE DE AUTENTICAÇÃO ===");
  //   this.debugCookies();
    
  //   try {
  //     console.log("Tentando obter usuário do servidor...");
  //     const user = await this.getCurrentUser();
  //     if (user) {
  //       console.log("✅ Usuário obtido com sucesso:", user);
  //       console.log("Nome completo:", `${user.firstName} ${user.lastName}`.trim());
  //       console.log("Nickname:", user.nickName);
  //       console.log("Email:", user.email);
  //       console.log("Roles:", user.roles);
  //     } else {
  //       console.log("❌ Falha ao obter usuário do servidor");
  //     }
  //   } catch (error) {
  //     console.log("❌ Erro ao testar autenticação:", error);
  //   }
    
  //   console.log("=============================");
  // }

  // testar login com credenciais padrão
  // async testLogin(): Promise<void> {
  //   console.log("=== TESTE DE LOGIN ===");
    
  //   const credentials = {
  //     email: "tocadocartucho.contato@gmail.com",
  //     password: "Admin@123"
  //   };
    
  //   try {
  //     console.log("Tentando fazer login com:", credentials.email);
  //     const response = await this.login(credentials);
  //     console.log("✅ Login realizado com sucesso!");
  //     console.log("Usuário:", response.user);
  //     console.log("Token:", response.token);
      
  //     // Verificar cookies após login
  //     console.log("Verificando cookies após login:");
  //     this.debugCookies();
      
  //   } catch (error) {
  //     console.log("❌ Erro no login:", error);
  //   }
    
  //   console.log("=====================");
  // }

  // verificar se o cookie está sendo bloqueado por políticas de segurança
  checkCookieAccessibility(): void {
    
    
    // Tentar criar um cookie de teste
    try {
      document.cookie = "testCookie=testValue; path=/";
      document.cookie.includes("testCookie=testValue");
  
      
      // Limpar cookie de teste
      document.cookie = "testCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    } catch (error) {
      console.log(error)
    }
    

  }
}

export const authService = new AuthService();

// Interface para debug no console
interface DebugAuth {
  checkCookieAccessibility: () => void;
  hasSessionCookie: () => boolean;
  isAuthenticated: () => boolean;
  getCurrentUser: () => Promise<User | null>;
  getIdentityCookie: () => string | null;
}

// Expor funções de debug globalmente para facilitar testes no console
if (typeof window !== 'undefined') {
  (window as { debugAuth?: DebugAuth }).debugAuth = {
    checkCookieAccessibility: () => authService.checkCookieAccessibility(),
    hasSessionCookie: () => authService.hasSessionCookie(),
    isAuthenticated: () => authService.isAuthenticated(),
    getCurrentUser: () => authService.getCurrentUser(),
    getIdentityCookie: () => authService.getIdentityCookie(),
  };
}

