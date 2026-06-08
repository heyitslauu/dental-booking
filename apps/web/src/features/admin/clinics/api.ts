import type { Clinic } from "../../booking/types";
import { adminApi, getApiErrorMessage } from "../apiClient";

export type ClinicFormPayload = {
  name: string;
  slug?: string;
  address?: string;
  phone?: string;
};

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
