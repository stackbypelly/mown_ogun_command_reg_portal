import axios from 'axios';

const DEFAULT_API = 'https://mown-ogun-command-reg-portal.onrender.com/api';
const apiBase = import.meta.env.VITE_API_BASE || DEFAULT_API;

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mow-token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
