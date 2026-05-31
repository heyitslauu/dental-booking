export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW"
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
