import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nickName: string;
  roles: string[];
  phoneNumber?: string;
  slug?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nickName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';

  // Login usando endpoint do Identity API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/login', credentials, {
        params: {
          useCookies: true
        }
      });

      // Se o backend retornar um token JWT
      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
        return response.data;
      }

      // Se usar apenas cookies, simular resposta
      const user = await this.getCurrentUser();
      return {
        token: 'cookie-based-auth',
        user: user!
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao fazer login'
        : 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  }

  // Registro usando endpoint do Identity API
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/register', userData);

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
        return response.data;
      }

      const user = await this.getCurrentUser();
      return {
        token: 'cookie-based-auth',
        user: user!
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao registrar usuário'
        : 'Erro ao registrar usuário';
      throw new Error(errorMessage);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/api/users/profile-info');
      return response.data;
    } catch {
      return null;
    }
  }

  // Verificar se existe cookie de sessão válido (melhorado)
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
    
    // Tentar diferentes nomes de cookies
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

  // Verificar se está autenticado (melhorado para incluir verificação de cookies)
  isAuthenticated(): boolean {
    // Primeiro verifica se há dados no localStorage
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    // Se há dados no localStorage, considera autenticado
    if (token && user) {
      return true;
    }
    
    // Se não há dados no localStorage, verifica se há cookie de sessão
    return this.hasSessionCookie();
  }

  // Obter token atual
  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  // Obter usuário atual do localStorage
  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Definir dados de autenticação
  setAuthData(token: string, user: User): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Limpar dados de autenticação
  private clearAuthData(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Definir cookie manualmente (para o cookie fornecido)
  setCookieAuth(cookieValue: string): void {
    // Definir o cookie no navegador
    document.cookie = `Identity.Application=${cookieValue}; path=/; domain=localhost; secure=false; samesite=lax`;
    
    // Simular dados de usuário para desenvolvimento
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'tocadocartucho.contato@gmail.com',
      firstName: 'Toca',
      lastName: 'Do Cartucho',
      nickName: 'admin_tocadocartucho',
      roles: ['Administrator']
    };

    this.setAuthData('cookie-based-auth', mockUser);
  }

  // Verificar se tem permissão específica
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles.includes(role) || false;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    return this.hasRole('Administrator');
  }

  // Função para debug dos cookies
  debugCookies(): void {
    console.log("=== DEBUG COOKIES ===");
    console.log("document.cookie:", document.cookie);
    
    const cookies = document.cookie.split(';');
    console.log("Cookies encontrados:");
    cookies.forEach((cookie, index) => {
      const [name, value] = cookie.trim().split('=');
      console.log(`${index + 1}. ${name}: ${value ? '***' : 'vazio'}`);
    });
    
    const identityCookie = this.getIdentityCookie();
    console.log("Identity.Application cookie:", identityCookie ? 'existe' : 'não existe');
    console.log("hasSessionCookie():", this.hasSessionCookie());
    console.log("isAuthenticated():", this.isAuthenticated());
    console.log("localStorage authToken:", localStorage.getItem(this.AUTH_TOKEN_KEY) ? 'existe' : 'não existe');
    console.log("localStorage user:", localStorage.getItem(this.USER_KEY) ? 'existe' : 'não existe');
    
    // Debug adicional para cookies específicos
    console.log("=== COOKIES ESPECÍFICOS ===");
    const specificCookies = [
      'Identity.Application',
      '.AspNetCore.Identity.Application', 
      '__RequestVerificationToken',
      'ASP.NET_SessionId'
    ];
    
    specificCookies.forEach(cookieName => {
      const cookie = cookies.find(c => c.trim().startsWith(`${cookieName}=`));
      console.log(`${cookieName}:`, cookie ? 'existe' : 'não existe');
    });
    
    console.log("===================");
  }

  // Função para listar todos os cookies com detalhes
  listAllCookies(): void {
    console.log("=== TODOS OS COOKIES DETALHADOS ===");
    console.log("document.cookie completo:", document.cookie);
    
    const cookies = document.cookie.split(';');
    if (cookies.length === 1 && cookies[0].trim() === '') {
      console.log("❌ Nenhum cookie encontrado");
      return;
    }
    
    cookies.forEach((cookie, index) => {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie) {
        const [name, ...valueParts] = trimmedCookie.split('=');
        const value = valueParts.join('=');
        console.log(`${index + 1}. Nome: "${name}"`);
        console.log(`   Valor: ${value ? `"${value.substring(0, 20)}${value.length > 20 ? '...' : ''}"` : 'vazio'}`);
        console.log(`   Tamanho: ${value ? value.length : 0} caracteres`);
        console.log('---');
      }
    });
    
    console.log("=====================================");
  }

  // Função para testar autenticação manualmente
  async testAuthentication(): Promise<void> {
    console.log("=== TESTE DE AUTENTICAÇÃO ===");
    this.debugCookies();
    
    try {
      console.log("Tentando obter usuário do servidor...");
      const user = await this.getCurrentUser();
      if (user) {
        console.log("✅ Usuário obtido com sucesso:", user);
        console.log("Nome completo:", `${user.firstName} ${user.lastName}`.trim());
        console.log("Nickname:", user.nickName);
        console.log("Email:", user.email);
        console.log("Roles:", user.roles);
      } else {
        console.log("❌ Falha ao obter usuário do servidor");
      }
    } catch (error) {
      console.log("❌ Erro ao testar autenticação:", error);
    }
    
    console.log("=============================");
  }

  // Função para testar login com credenciais padrão
  async testLogin(): Promise<void> {
    console.log("=== TESTE DE LOGIN ===");
    
    const credentials = {
      email: "tocadocartucho.contato@gmail.com",
      password: "Admin@123"
    };
    
    try {
      console.log("Tentando fazer login com:", credentials.email);
      const response = await this.login(credentials);
      console.log("✅ Login realizado com sucesso!");
      console.log("Usuário:", response.user);
      console.log("Token:", response.token);
      
      // Verificar cookies após login
      console.log("Verificando cookies após login:");
      this.debugCookies();
      
    } catch (error) {
      console.log("❌ Erro no login:", error);
    }
    
    console.log("=====================");
  }

  // Função para verificar se o cookie está sendo bloqueado por políticas de segurança
  checkCookieAccessibility(): void {
    console.log("=== VERIFICAÇÃO DE ACESSIBILIDADE DE COOKIES ===");
    
    // Tentar acessar document.cookie
    console.log("document.cookie acessível:", typeof document.cookie === 'string');
    console.log("Tamanho do document.cookie:", document.cookie.length);
    
    // Verificar se estamos em contexto seguro (HTTPS)
    console.log("Protocolo atual:", window.location.protocol);
    console.log("É HTTPS:", window.location.protocol === 'https:');
    
    // Verificar se estamos no localhost
    console.log("Hostname:", window.location.hostname);
    console.log("É localhost:", window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    // Tentar criar um cookie de teste
    try {
      document.cookie = "testCookie=testValue; path=/";
      const testCookieExists = document.cookie.includes("testCookie=testValue");
      console.log("Pode criar cookies:", testCookieExists);
      
      // Limpar cookie de teste
      document.cookie = "testCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    } catch (error) {
      console.log("❌ Erro ao criar cookie de teste:", error);
    }
    
    console.log("=============================================");
  }
}

export const authService = new AuthService();

// Interface para debug no console
interface DebugAuth {
  debugCookies: () => void;
  listAllCookies: () => void;
  checkCookieAccessibility: () => void;
  testAuthentication: () => Promise<void>;
  testLogin: () => Promise<void>;
  hasSessionCookie: () => boolean;
  isAuthenticated: () => boolean;
  getCurrentUser: () => Promise<User | null>;
  getIdentityCookie: () => string | null;
}

// Expor funções de debug globalmente para facilitar testes no console
if (typeof window !== 'undefined') {
  (window as { debugAuth?: DebugAuth }).debugAuth = {
    debugCookies: () => authService.debugCookies(),
    listAllCookies: () => authService.listAllCookies(),
    checkCookieAccessibility: () => authService.checkCookieAccessibility(),
    testAuthentication: () => authService.testAuthentication(),
    testLogin: () => authService.testLogin(),
    hasSessionCookie: () => authService.hasSessionCookie(),
    isAuthenticated: () => authService.isAuthenticated(),
    getCurrentUser: () => authService.getCurrentUser(),
    getIdentityCookie: () => authService.getIdentityCookie(),
  };
}

