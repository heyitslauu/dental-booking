import { apiRequest } from "@/lib/api";
import type {
  Appointment,
  CreateAppointmentPayload,
  CreateGuestPatientPayload,
  PatientProfile
} from "./types";

export function createGuestPatient(payload: CreateGuestPatientPayload) {
  return apiRequest<PatientProfile>("/patients", {
    method: "POST",
    body: payload
  });
}

export function createAppointment(payload: CreateAppointmentPayload) {
  return apiRequest<Appointment>("/appointments", {
    method: "POST",
    body: payload
  });
}
