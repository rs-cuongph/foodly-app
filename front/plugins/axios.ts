import axios from 'axios';

import { STORAGE_KEYS } from '@/config/constant';
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setHeaderToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, `Bearer ${token}`);
};

export const removeHeaderToken = () => {
  // trigger custom event to force login
  const event = new CustomEvent('forceLogin');

  window.dispatchEvent(event);

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config;
});

apiClient.interceptors.response.use(
  async (res) => {
    return res;
  },
  (e) => {
    const statusCode = e.response?.status;

    if (statusCode === 401) {
      removeHeaderToken();
    }

    return Promise.reject(e);
  },
);

export { apiClient };
