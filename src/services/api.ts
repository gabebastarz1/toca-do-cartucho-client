import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5236",
  withCredentials: true, // Inclui cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação se disponível
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);