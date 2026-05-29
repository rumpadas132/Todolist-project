import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiUrl = import.meta.env.VITE_API_URL?.trim();
const apiOrigin = import.meta.env.VITE_API_ORIGIN?.trim();

/**
 * Base URL:
 * - VITE_API_URL can point directly to the API path, e.g. https://api.example.com/api
 * - VITE_API_ORIGIN can point to the API origin, e.g. https://api.example.com
 * - local dev falls back to Vite's /api proxy
 */
const baseURL = apiUrl || (apiOrigin ? `${apiOrigin.replace(/\/$/, '')}/api` : '/api');

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Request failed';
    const err = new Error(message);
    err.status = error.response?.status;
    err.details = error.response?.data?.details;
    return Promise.reject(err);
  }
);
