import axios, { AxiosError } from "axios";
import type { Clinic } from "../../booking/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const adminApi = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
});

export type ClinicFormPayload = {
  name: string;
  slug?: string;
  address?: string;
  phone?: string;
};

function getApiErrorMessage(error: unknown, fallback: string) {
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

export async function listAdminClinics() {
  try {
    const response = await adminApi.get<Clinic[]>("/clinics/admin");

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load clinic branches."));
  }
}

export async function createClinic(payload: ClinicFormPayload) {
  try {
    const response = await adminApi.post<Clinic>("/clinics/admin", payload);

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create clinic branch."));
  }
}

export async function updateClinic({
  clinicId,
  payload,
}: {
  clinicId: string;
  payload: Partial<ClinicFormPayload> & { isActive?: boolean };
}) {
  try {
    const response = await adminApi.patch<Clinic>(
      `/clinics/admin/${encodeURIComponent(clinicId)}`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update clinic branch."));
  }
}
