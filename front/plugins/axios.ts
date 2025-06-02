import axios from 'axios';
import Cookies from 'js-cookie';

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
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  // trigger custom event to force login
  const event = new CustomEvent('forceLogin');

  window.dispatchEvent(event);
};

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const locale = Cookies.get('NEXT_LOCALE');
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.headers.lang = locale;
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
