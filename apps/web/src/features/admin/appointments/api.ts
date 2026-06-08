import type { Appointment, AppointmentStatus } from "../../booking/types";
import { adminApi, getApiErrorMessage } from "../apiClient";

export type AppointmentFilters = {
  clinicId: string;
  status: string;
  from: string;
  to: string;
};

function getDateBoundary(value: string, endOfDay = false) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  const date = new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );

  return date.toISOString();
}

export async function listAppointments(filters: AppointmentFilters) {
  try {
    const response = await adminApi.get<Appointment[]>("/appointments", {
      params: {
        clinicId: filters.clinicId || undefined,
        status: filters.status || undefined,
        from: getDateBoundary(filters.from),
        to: getDateBoundary(filters.to, true),
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load appointments."));
  }
}

export async function updateAppointmentStatus({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: AppointmentStatus;
}) {
  try {
    const response = await adminApi.patch<Appointment>(
      `/appointments/${encodeURIComponent(appointmentId)}/status`,
      { status },
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to update appointment status."),
    );
  }
}
