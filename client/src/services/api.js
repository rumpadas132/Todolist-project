import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Base URL: use VITE_API_URL in production; in dev, `/api` uses Vite proxy to the backend.
 */
const baseURL = import.meta.env.VITE_API_URL?.trim() || '/api';

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
