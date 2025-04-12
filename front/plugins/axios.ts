import http from 'http';
import https from 'https';

import axios from 'axios';

import { STORAGE_KEYS } from '@/config/constant';
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

export const setHeaderToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, `Bearer ${token}`);
};

export const removeHeaderToken = () => {
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
    return Promise.reject(e);
  },
);

export { apiClient };
