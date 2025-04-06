import axios from "axios";

import { LOCAL_STORAGE_KEYS } from "@/config/constant";
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setHeaderToken = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, `Bearer ${token}`);
};

export const removeHeaderToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
};

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    config.headers.Authorization = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    );
  }

  return config;
});

apiClient.interceptors.response.use(
  async (res) => {
    return res;
  },
  (e) => {
    Promise.reject(e);
  },
);

export { apiClient };
