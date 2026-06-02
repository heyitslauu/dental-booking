export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type Clinic = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClinicService = {
  id: string;
  clinicId: string;
  serviceId: string;
  isActive: boolean;
  service: Service;
  createdAt: string;
  updatedAt: string;
};

export type StaffProfile = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  title: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClinicStaff = {
  id: string;
  clinicId: string;
  staffProfileId: string;
  isActive: boolean;
  staffProfile: StaffProfile;
  createdAt: string;
  updatedAt: string;
};

export type PatientProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateGuestPatientPayload = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
};

export type PatientDetails = {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  birthDate: string;
  notes: string;
};

export type CreateAppointmentPayload = {
  clinicId: string;
  serviceId: string;
  patientId: string;
  staffId?: string;
  startAt: string;
  endAt: string;
  notes?: string;
};

export type Appointment = {
  id: string;
  referenceNumber: string;
  referenceCode?: string | null;
  clinicId: string;
  serviceId: string;
  patientProfileId: string;
  staffProfileId: string | null;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  notes: string | null;
  clinic: Clinic;
  service: Service;
  patientProfile: PatientProfile;
  staffProfile: StaffProfile | null;
  createdAt: string;
  updatedAt: string;
};
