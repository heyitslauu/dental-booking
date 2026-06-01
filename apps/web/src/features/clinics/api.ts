import { apiRequest } from "@/lib/api";
import type { Clinic, ClinicService, ClinicStaff } from "@/features/booking/types";

export function getClinics() {
  return apiRequest<Clinic[]>("/clinics");
}

export function getClinicServices(clinicId: string) {
  return apiRequest<ClinicService[]>(
    `/clinics/${encodeURIComponent(clinicId)}/services`
  );
}

export function getClinicStaff(clinicId: string) {
  return apiRequest<ClinicStaff[]>(
    `/clinics/${encodeURIComponent(clinicId)}/staff`
  );
}
