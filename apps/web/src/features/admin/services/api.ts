import type { Clinic, ClinicService, Service } from "../../booking/types";
import { adminApi, getApiErrorMessage } from "../apiClient";

export type AdminService = Service & {
  clinicServices: Array<ClinicService & { clinic: Clinic }>;
};

export type ServiceFormPayload = {
  name: string;
  description?: string | null;
};

export type ClinicServicePayload = {
  clinicId: string;
  serviceId: string;
  priceCents: number;
  durationMinutes: number;
  isActive?: boolean;
};

export async function listAdminServices() {
  try {
    const response = await adminApi.get<AdminService[]>("/services/admin");

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load services."));
  }
}

export async function createService(payload: ServiceFormPayload) {
  try {
    const response = await adminApi.post<AdminService>("/services/admin", payload);

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create service."));
  }
}

export async function updateService({
  serviceId,
  payload,
}: {
  serviceId: string;
  payload: Partial<ServiceFormPayload> & { isActive?: boolean };
}) {
  try {
    const response = await adminApi.patch<AdminService>(
      `/services/admin/${encodeURIComponent(serviceId)}`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update service."));
  }
}

export async function createClinicService(payload: ClinicServicePayload) {
  try {
    const response = await adminApi.post<ClinicService & { clinic: Clinic }>(
      "/clinic-services",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to assign service."));
  }
}

export async function updateClinicService({
  clinicServiceId,
  payload,
}: {
  clinicServiceId: string;
  payload: Partial<Pick<ClinicServicePayload, "durationMinutes" | "isActive" | "priceCents">>;
}) {
  try {
    const response = await adminApi.patch<ClinicService & { clinic: Clinic }>(
      `/clinic-services/${encodeURIComponent(clinicServiceId)}`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update clinic service."));
  }
}
