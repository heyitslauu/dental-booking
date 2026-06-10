import type { Clinic } from "../../booking/types";
import { adminApi, getApiErrorMessage } from "../apiClient";

export type GlobalUserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "STAFF" | "PATIENT";
export type ClinicAccessRole =
  | "CLINIC_ADMIN"
  | "RECEPTIONIST"
  | "DENTIST"
  | "ASSISTANT";

export type AdminUserClinicAccess = {
  id: string;
  clinicId: string;
  role: ClinicAccessRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  clinic: Clinic;
};

export type AdminUser = {
  id: string;
  email: string;
  role: GlobalUserRole;
  createdAt: string;
  updatedAt: string;
  staffProfile?: {
    id: string;
    firstName: string;
    lastName: string;
    title?: string | null;
    isActive: boolean;
  } | null;
  clinicAccess: AdminUserClinicAccess[];
};

export type ClinicAccessPayload = {
  clinicId: string;
  role: ClinicAccessRole;
  isActive?: boolean;
};

export type CreateAdminUserPayload = {
  email: string;
  password: string;
  role: GlobalUserRole;
  firstName?: string;
  lastName?: string;
  title?: string;
  clinicAccess?: ClinicAccessPayload[];
};

export async function listAdminUsers() {
  try {
    const response = await adminApi.get<AdminUser[]>("/admin/users");

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load users."));
  }
}

export async function createAdminUser(payload: CreateAdminUserPayload) {
  try {
    const response = await adminApi.post<AdminUser>("/admin/users", payload);

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create user."));
  }
}

export async function createUserClinicAccess({
  userId,
  payload,
}: {
  userId: string;
  payload: ClinicAccessPayload;
}) {
  try {
    const response = await adminApi.post<AdminUserClinicAccess>(
      `/admin/users/${encodeURIComponent(userId)}/clinic-access`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to add clinic access."));
  }
}

export async function deactivateUserClinicAccess({
  accessId,
  userId,
}: {
  accessId: string;
  userId: string;
}) {
  try {
    const response = await adminApi.delete<AdminUserClinicAccess>(
      `/admin/users/${encodeURIComponent(userId)}/clinic-access/${encodeURIComponent(
        accessId,
      )}`,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to deactivate clinic access."));
  }
}
