import axios, { AxiosError } from "axios";
import type { Clinic, ClinicStaff, StaffProfile } from "../../booking/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const adminApi = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
});

export type AdminStaffProfile = StaffProfile & {
  clinicStaff: Array<ClinicStaff & { clinic: Clinic }>;
};

export type StaffFormPayload = {
  firstName: string;
  lastName: string;
  title?: string | null;
};

export type ClinicStaffPayload = {
  clinicId: string;
  staffProfileId: string;
  isActive?: boolean;
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

export async function listAdminStaff() {
  try {
    const response = await adminApi.get<AdminStaffProfile[]>("/staff/admin");

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load staff."));
  }
}

export async function createStaff(payload: StaffFormPayload) {
  try {
    const response = await adminApi.post<AdminStaffProfile>(
      "/staff/admin",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create staff profile."));
  }
}

export async function updateStaff({
  staffProfileId,
  payload,
}: {
  staffProfileId: string;
  payload: Partial<StaffFormPayload> & { isActive?: boolean };
}) {
  try {
    const response = await adminApi.patch<AdminStaffProfile>(
      `/staff/admin/${encodeURIComponent(staffProfileId)}`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update staff profile."));
  }
}

export async function createClinicStaff(payload: ClinicStaffPayload) {
  try {
    const response = await adminApi.post<ClinicStaff & { clinic: Clinic }>(
      "/clinic-staff",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to assign staff."));
  }
}

export async function updateClinicStaff({
  clinicStaffId,
  payload,
}: {
  clinicStaffId: string;
  payload: Pick<ClinicStaffPayload, "isActive">;
}) {
  try {
    const response = await adminApi.patch<ClinicStaff & { clinic: Clinic }>(
      `/clinic-staff/${encodeURIComponent(clinicStaffId)}`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update staff assignment."));
  }
}
