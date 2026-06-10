import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const ADMIN_TOKEN_KEY = "dental-booking-admin-token";
const ADMIN_USER_KEY = "dental-booking-admin-user";

export type AdminRole = "SUPER_ADMIN" | "ORG_ADMIN" | "STAFF" | "PATIENT";

export type AdminUser = {
  email: string;
  firstName?: string | null;
  id: string;
  lastName?: string | null;
  role: AdminRole;
};

export type LoginResponse = {
  accessToken: string;
  user: AdminUser;
};

const authApi = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
});

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminUser() {
  const storedUser = window.localStorage.getItem(ADMIN_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AdminUser;
  } catch {
    window.localStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
}

export function setAdminUser(user: AdminUser) {
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

function getAuthErrorMessage(error: unknown) {
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

  return "Unable to sign in.";
}

export async function loginAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await authApi.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    setAdminToken(response.data.accessToken);
    setAdminUser(response.data.user);

    return response.data;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}
