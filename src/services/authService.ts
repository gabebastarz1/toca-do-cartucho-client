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
  rememberMe?: boolean;
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

const API_BACKEND_URL = 'https://d2w2owe4ytg90n.cloudfront.net';

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



  if (!API_BACKEND_URL) {

    console.error("VITE_API_BACKEND_URL ou VITE_API_URL não está definido. Verifique as variáveis de ambiente.");

    alert("Erro de configuração: URL da API não encontrada. Por favor, recarregue a página.");

    return;

  }

  const timestamp = new Date().getTime();

  // Usar API_BACKEND_URL para garantir que o redirecionamento vá direto para o backend

  // e não passe pelo CloudFront do frontend (que serve apenas arquivos estáticos)

  const googleLoginUrl = `${API_BACKEND_URL}/api/auth/login/google?finalRedirectUrl=${encodeURIComponent(

    finalRedirectUrl

  )}`;

 

  console.log("Redirecionando para Google Login:", googleLoginUrl);

  window.location.href = googleLoginUrl;

};



class AuthService {

  private readonly AUTH_TOKEN_KEY = 'authToken';

  private readonly USER_KEY = 'user';











  // Login usando endpoint do Identity API

  async login(credentials: LoginRequest): Promise<AuthResponse> {

    let lastError: unknown = null;

    let retryCount = 0;

    const maxLoginRetries = 2; // Tentar até 2 vezes o login em caso de 401

   

    while (retryCount <= maxLoginRetries) {

      try {
        const response = await api.post('/api/accounts/login', credentials, {
          params: {
            useCookies: credentials.rememberMe,
            useSessionCookies: !credentials.rememberMe
          }
        });

        // Se o backend retornar um token JWT
        if (response.data.token) {
          this.setAuthData(response.data.token, response.data.user);
          userProfileCache.set(convertUserToUserDTO(response.data.user)); // Cache user data
          return response.data;
        }

       

        // Se chegou aqui, o login foi bem-sucedido (status 200) mas sem token JWT

        // Isso significa que está usando cookie-based auth

        break; // Sair do loop de retry e continuar com o fluxo normal

      } catch (error: unknown) {

        lastError = error;

       

        // Se for 401 e ainda tiver tentativas, aguardar e tentar novamente

        if (axios.isAxiosError(error) && error.response?.status === 401 && retryCount < maxLoginRetries) {

          retryCount++;

          // Aguardar um pouco antes de tentar novamente (delay progressivo)

          await new Promise(resolve => setTimeout(resolve, 500 * retryCount));

          continue; // Tentar novamente

        }

       

        // Se não for 401 ou já esgotou as tentativas, lançar o erro

        if (axios.isAxiosError(error) && error.response) {

          throw error.response;

        }

        throw new Error("Erro ao fazer login");

      }

    }

   

    try {



      // Aguardar um pouco para garantir que o cookie seja processado pelo navegador

      // Isso resolve problemas de race condition onde o cookie ainda não foi definido

      // Aumentado para 500ms para dar mais tempo ao cookie ser processado, especialmente após registro

      await new Promise(resolve => setTimeout(resolve, 500));



      // Tentar obter o usuário com retry em caso de falha inicial

      let user: User | null = null;

      let retries = 0;

      const maxRetries = 5; // Aumentado de 3 para 5 tentativas

      let getUserError: unknown = null;

     

      while (!user && retries < maxRetries) {

        try {

          user = await this.getCurrentUser();

          if (!user && retries < maxRetries - 1) {

            // Aguardar mais um pouco antes de tentar novamente

            // Delay progressivo: 500ms, 700ms, 900ms, 1100ms

            await new Promise(resolve => setTimeout(resolve, 500 + (retries * 200)));

          }

        } catch (error) {

          getUserError = error;

          // Se houver erro, aguardar antes de tentar novamente

          if (retries < maxRetries - 1) {

            // Delay progressivo também para erros

            await new Promise(resolve => setTimeout(resolve, 500 + (retries * 200)));

          }

        }

        retries++;

      }



      if (!user) {

        // Se não conseguiu obter o usuário, mas o login foi bem-sucedido (status 200),

        // pode ser um problema temporário. Tentar uma última vez após um delay maior

        if (retries >= maxRetries) {

          await new Promise(resolve => setTimeout(resolve, 1000));

          try {

            user = await this.getCurrentUser();

          } catch {

            // Se ainda falhar, lançar o erro original

            if (axios.isAxiosError(getUserError) && getUserError.response) {

              throw getUserError.response;

            }

            throw new Error("Não foi possível obter os dados do usuário após o login. Tente fazer login novamente.");

          }

        }

       

        if (!user) {

          if (axios.isAxiosError(getUserError) && getUserError.response) {

            throw getUserError.response;

          }

          throw new Error("Não foi possível obter os dados do usuário após o login. Tente fazer login novamente.");

        }

      }



      // Salvar dados de autenticação no localStorage para persistência

      this.setAuthData('cookie-based-auth', user);

      userProfileCache.set(convertUserToUserDTO(user)); // Cache user data

      return {

        token: 'cookie-based-auth',

        user: user

      };

    } catch (error: unknown) {

      // Se houve erro ao obter o usuário, mas o login foi bem-sucedido,

      // pode ser um problema temporário. Tentar uma última vez após um delay maior

      if (retryCount < maxLoginRetries) {

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {

          const user = await this.getCurrentUser();

          if (user) {

            this.setAuthData('cookie-based-auth', user);

            userProfileCache.set(convertUserToUserDTO(user));

            return {

              token: 'cookie-based-auth',

              user: user

            };

          }

        } catch {

          // Se ainda falhar, lançar o erro original

        }

      }

     

      if (axios.isAxiosError(error) && error.response) {

        throw error.response;

      }

      if (lastError && axios.isAxiosError(lastError) && lastError.response) {

        throw lastError.response;

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



      // Após o registro, não tentar obter o usuário automaticamente

      // porque o backend não cria uma sessão até que o email seja confirmado

      // Tentar obter o usuário aqui causaria erros 401 desnecessários

      // O usuário precisará fazer login após confirmar o email

      return {

        token: 'cookie-based-auth',

        user: null as any

      };

    } catch (error: unknown) {

      // Se o erro for do axios e tiver response, verificar se foi sucesso (200/201)

      if (axios.isAxiosError(error) && error.response) {

        const status = error.response.status;

        // Se o registro foi bem-sucedido (200/201), mas houve erro ao obter usuário,

        // ainda consideramos sucesso (normal quando email precisa ser confirmado)

        if (status === 200 || status === 201) {

          return {

            token: 'cookie-based-auth',

            user: null as any

          };

        }

        throw error.response;

      }

      throw new Error('Erro ao registrar usuário');

    }

  }



  // Verifica se o nome de usuário já existe

  async checkNicknameExists(nickName: string): Promise<boolean> {

    try {

      const response = await api.get("/api/auth/signup/nickname-exists", {

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

     

      const response = await api.get('/api/auth/profile');

     

      return response.status === 200;

    } catch (error) {

   

      return false;

    }

  }



  // Logout com verificação de sessão

  async logout(): Promise<void> {

    try {

   

      await api.get('/api/auth/profile/logout');

 

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

     

      const response = await api.get('/api/auth/profile');

     

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