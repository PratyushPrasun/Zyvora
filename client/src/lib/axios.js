import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request Interceptor — inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — handle 401, 409, 429
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    } else if (status === 429) {
      toast.error(
        message || "You're making requests too quickly. Please wait a moment and try again.",
        { id: 'rate-limit-toast' }
      );
    } else if (status === 409) {
      // Dispatch custom event for 409 Conflict handling
      window.dispatchEvent(
        new CustomEvent('api-conflict-error', {
          detail: {
            message:
              message ||
              'This product was modified by another administrator. Please refresh to view the latest version before making additional changes.',
            data: error.response?.data,
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;
