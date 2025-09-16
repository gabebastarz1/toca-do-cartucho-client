import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  roles: string[];
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
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
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
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
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
      const response = await api.get('/manage/info');
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    return !!(token && user);
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
  private setAuthData(token: string, user: User): void {
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
}

export const authService = new AuthService();
