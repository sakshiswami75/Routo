import axios, { AxiosError } from "axios";
import type { ApiErrorShape } from "@/types/api";
import { useAuthStore } from "@/store/auth-store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorShape>) => {
    const message = error.response?.data?.message ?? error.message ?? "Request failed";
    return Promise.reject(new Error(message));
  }
);
