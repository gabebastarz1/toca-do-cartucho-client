import axios from "axios";

const API_URL =  import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação se disponível
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const cookies = document.cookie;
    const cookieList = cookies.split(';').map(c => c.trim().split('=')[0]);
    const url = config.url || '';
    const isAuthRoute = url.includes('/two-factor-authentication') 
                       || url.includes('/2fa')
                       || url.includes('/login') // Adicione outras rotas de auth/cookie se houver
                       || url.includes('/manage');
    // Log para debug de autenticação
    console.log(`🔐 [API] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔐 [API] Token no localStorage?:`, !!token);
    console.log(`🔐 [API] Cookies presentes:`, cookieList.length > 0 ? cookieList.join(', ') : "Nenhum");
    console.log(`🔐 [API] withCredentials:`, config.withCredentials);
    
    // Procurar cookies de autenticação específicos
    const identityCookie = cookies.split(';').find(c => 
      c.trim().startsWith('Identity.Application=') || 
      c.trim().startsWith('.AspNetCore.Identity.Application=')
    );
    console.log(`🔐 [API] Cookie de autenticação Identity?:`, !!identityCookie);
    
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 [API] Authorization header (Bearer) definido`);
    } else if (token && isAuthRoute) {
      console.log(`⚠️ [API] Token Bearer existe, mas NÃO será enviado para rota de auth.`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas de erro de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // ⚠️ NÃO deslogar automaticamente em rotas de 2FA
      // O código inválido ou outras validações podem retornar 401
      const is2FARoute = url.includes('/two-factor-authentication') || url.includes('/2fa');
      
      console.log(`❌ [API] 401 Unauthorized em: ${url}`);
      console.log(`❌ [API] É rota de 2FA?:`, is2FARoute);
      
      if (!is2FARoute) {
        // Token expirado ou inválido - deslogar apenas se NÃO for 2FA
        console.log(`❌ [API] Deslogando usuário...`);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Só redirecionar se não estiver já na página de auth
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        console.log(`⚠️ [API] 401 em rota 2FA - mantendo sessão`);
      }
    }
    return Promise.reject(error);
  }
);