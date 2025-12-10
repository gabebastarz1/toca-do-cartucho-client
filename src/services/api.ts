import axios from "axios";



const API_URL =  import.meta.env.VITE_API_URL;



export const api = axios.create({

  baseURL: API_URL,

  withCredentials: true,

  headers: {

    'Content-Type': 'application/json',

  }

});



// Interceptor para requisições

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('authToken');

    const url = config.url || '';

    const isAuthRoute = url.includes('/two-factor-authentication')

                       || url.includes('/autenticacao-2')

                       || url.includes('/login')

                       || url.includes('/manage');

   

    // Só adicionar Authorization header se o token for um JWT válido

    // Se for 'cookie-based-auth', os cookies já são enviados automaticamente com withCredentials: true

    if (token && !isAuthRoute && token !== 'cookie-based-auth') {

      config.headers.Authorization = `Bearer ${token}`;

    }

   

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);



// Helper para verificar se deve manter a sessão em caso de 401

const shouldKeepSession = (url: string): boolean => {

  const protectedRoutes = [

    '/two-factor-authentication',

    '/2fa',

    '/login',

    '/register',

    '/manage',

    '/accounts/profile', // Não deslogar ao buscar perfil

    '/confirmEmail',

    '/resendConfirmationEmail',

    // Rotas de categorias - podem falhar temporariamente após login

    '/genres',

    '/themes',

    '/gamemodes',

    '/languages',

    '/game-localizations',

  ];

 

  return protectedRoutes.some(route => url.includes(route));

};



// Helper para verificar se ainda existe cookie de sessão válido

const hasValidSessionCookie = (): boolean => {

  const cookies = document.cookie.split(';');

  return cookies.some(cookie => {

    const trimmedCookie = cookie.trim();

    return (

      (trimmedCookie.startsWith('Identity.Application=') ||

       trimmedCookie.startsWith('.AspNetCore.Identity.Application=')) &&

      trimmedCookie.split('=')[1] &&

      trimmedCookie.split('=')[1] !== ''

    );

  });

};



// Interceptor para lidar com respostas de erro de autenticação

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    if (error.response?.status === 401) {

      const url = error.config?.url || '';

     

      // Verificar se há cookie válido ou dados no localStorage

      const hasCookie = hasValidSessionCookie();

      const hasLocalAuth = localStorage.getItem('authToken') && localStorage.getItem('user');

     

      // ✅ Verificar se é uma rota de favoritos - não redirecionar se estiver na página de produtos
      const isFavoritesRoute = url.includes('/favorites');
      const isOnProductsPage = window.location.pathname === '/produtos';
      
      // Só limpar e redirecionar se realmente não houver autenticação válida
      // e não for uma rota protegida que deve manter a sessão
      // e não for uma rota de favoritos quando estiver na página de produtos (usuário não logado pode navegar)
      if (!shouldKeepSession(url) && !hasCookie && !hasLocalAuth && !(isFavoritesRoute && isOnProductsPage)) {

        localStorage.removeItem('authToken');

        localStorage.removeItem('user');

       

        if (window.location.pathname !== '/login' && window.location.pathname !== '/cadastro') {

          window.location.href = '/login';

        }

      }

    }

   

    return Promise.reject(error);

  }

);