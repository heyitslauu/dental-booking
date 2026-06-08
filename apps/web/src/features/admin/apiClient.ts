import axios, { AxiosError } from "axios";
import { clearAdminToken, getAdminToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const adminApi = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      clearAdminToken();

      if (!window.location.pathname.endsWith("/admin/login")) {
        window.location.assign("/admin/login");
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (!error.response) {
      return "Unable to reach the booking server. Please check that the API is running.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
