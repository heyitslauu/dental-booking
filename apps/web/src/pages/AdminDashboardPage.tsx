import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Smile,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { listAppointments } from "../features/admin/appointments/api";
import { listAdminClinics } from "../features/admin/clinics/api";
import { listAdminServices } from "../features/admin/services/api";
import { listAdminStaff } from "../features/admin/staff/api";
import type { Appointment, AppointmentStatus } from "../features/booking/types";

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  NO_SHOW: "No show",
  PENDING: "Pending",
};

const emptyAppointmentFilters = {
  clinicId: "",
  status: "",
  from: "",
  to: "",
};

export function AdminDashboardPage() {
  const appointmentsQuery = useQuery({
    queryKey: ["admin", "dashboard", "appointments"],
    queryFn: () => listAppointments(emptyAppointmentFilters),
  });

  const clinicsQuery = useQuery({
    queryKey: ["admin", "dashboard", "clinics"],
    queryFn: listAdminClinics,
  });

  const servicesQuery = useQuery({
    queryKey: ["admin", "dashboard", "services"],
    queryFn: listAdminServices,
  });

  const staffQuery = useQuery({
    queryKey: ["admin", "dashboard", "staff"],
    queryFn: listAdminStaff,
  });

  const appointments = appointmentsQuery.data ?? [];
  const clinics = clinicsQuery.data ?? [];
  const services = servicesQuery.data ?? [];
  const staffProfiles = staffQuery.data ?? [];
  const isRefreshing =
    appointmentsQuery.isFetching ||
    clinicsQuery.isFetching ||
    servicesQuery.isFetching ||
    staffQuery.isFetching;

  const appointmentCounts = useMemo(() => {
    const now = new Date();
    const todayKey = toDateKey(now);

    return {
      today: appointments.filter(
        (appointment) => toDateKey(new Date(appointment.startAt)) === todayKey,
      ).length,
      upcoming: appointments.filter(
        (appointment) =>
          new Date(appointment.startAt) >= now &&
          appointment.status !== "CANCELLED" &&
          appointment.status !== "NO_SHOW",
      ).length,
      pending: appointments.filter((appointment) => appointment.status === "PENDING")
        .length,
      completed: appointments.filter(
        (appointment) => appointment.status === "COMPLETED",
      ).length,
    };
  }, [appointments]);

  const recentAppointments = useMemo(
    () =>
      [...appointments]
        .sort(
          (first, second) =>
            new Date(second.startAt).getTime() - new Date(first.startAt).getTime(),
        )
        .slice(0, 6),
    [appointments],
  );

  const activeClinics = clinics.filter((clinic) => clinic.isActive).length;
  const activeServices = services.filter((service) => service.isActive).length;
  const activeOfferings = services.reduce(
    (total, service) =>
      total +
      service.clinicServices.filter((offering) => offering.isActive).length,
    0,
  );
  const activeStaff = staffProfiles.filter((staff) => staff.isActive).length;
  const activeStaffAssignments = staffProfiles.reduce(
    (total, staff) =>
      total +
      staff.clinicStaff.filter((assignment) => assignment.isActive).length,
    0,
  );

  const summaryCards = [
    {
      description: `${appointmentCounts.upcoming} upcoming, ${appointmentCounts.pending} pending`,
      href: "/admin/appointments",
      icon: CalendarDays,
      label: "Appointments",
      value: String(appointments.length),
    },
    {
      description: `${activeClinics} active branches`,
      href: "/admin/clinics",
      icon: Smile,
      label: "Clinics",
      value: String(clinics.length),
    },
    {
      description: `${activeOfferings} active clinic offerings`,
      href: "/admin/services",
      icon: Stethoscope,
      label: "Services",
      value: String(activeServices),
    },
    {
      description: `${activeStaffAssignments} active clinic assignments`,
      href: "/admin/staff",
      icon: Users,
      label: "Staff",
      value: String(activeStaff),
    },
  ];

  return (
    <AdminLayout
      description="View a quick operational snapshot for appointments, clinics, staff, and services."
      isRefreshing={isRefreshing}
      onRefresh={() => {
        void appointmentsQuery.refetch();
        void clinicsQuery.refetch();
        void servicesQuery.refetch();
        void staffQuery.refetch();
      }}
      title="Dashboard"
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const IconComponent = item.icon;

            return (
              <Link className="block" key={item.label} to={item.href}>
                <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
                  <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                    <div>
                      <CardDescription>{item.label}</CardDescription>
                      <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconComponent aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-3">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-primary"
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        <DashboardError
          errors={[
            appointmentsQuery.error,
            clinicsQuery.error,
            servicesQuery.error,
            staffQuery.error,
          ]}
        />

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Recent appointments</CardTitle>
                  <CardDescription>
                    Latest appointment records from clinics you can access.
                  </CardDescription>
                </div>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-surface hover:text-primary"
                  to="/admin/appointments"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentAppointments.length > 0 ? (
                <div className="grid gap-3">
                  {recentAppointments.map((appointment) => (
                    <AppointmentRow
                      appointment={appointment}
                      key={appointment.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No appointment records are available yet." />
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today</CardTitle>
                <CardDescription>Appointment status snapshot.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <MetricRow label="Today" value={appointmentCounts.today} />
                <MetricRow label="Pending" value={appointmentCounts.pending} />
                <MetricRow label="Completed" value={appointmentCounts.completed} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinic coverage</CardTitle>
                <CardDescription>Active branches and assigned staff.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {clinics.length > 0 ? (
                  clinics.map((clinic) => {
                    const assignmentCount = staffProfiles.reduce(
                      (total, staff) =>
                        total +
                        staff.clinicStaff.filter(
                          (assignment) =>
                            assignment.clinicId === clinic.id && assignment.isActive,
                        ).length,
                      0,
                    );

                    return (
                      <div
                        className="rounded-md border border-border bg-background p-3"
                        key={clinic.id}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {clinic.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {assignmentCount} active staff assignments
                            </p>
                          </div>
                          <Badge variant={clinic.isActive ? "success" : "muted"}>
                            {clinic.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState message="No clinic records are available yet." />
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return (
    <div className="grid gap-3 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {appointment.referenceNumber}
          </p>
          <Badge variant={getStatusVariant(appointment.status)}>
            {appointmentStatusLabels[appointment.status]}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {getPatientName(appointment)} at {appointment.clinic.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {appointment.service.name}
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock3 aria-hidden="true" className="h-4 w-4 text-primary" />
        {formatDateTime(appointment.startAt)}
      </div>
    </div>
  );
}

function DashboardError({ errors }: { errors: unknown[] }) {
  const messages = errors
    .filter((error): error is Error => error instanceof Error)
    .map((error) => error.message);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
        />
        <div>
          <p className="text-sm font-medium text-destructive">
            Some dashboard data could not be loaded.
          </p>
          <ul className="mt-2 grid gap-1 text-sm text-destructive">
            {[...new Set(messages)].map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function getPatientName(appointment: Appointment) {
  return `${appointment.patientProfile.firstName} ${appointment.patientProfile.lastName}`.trim();
}

function getStatusVariant(status: AppointmentStatus) {
  if (status === "COMPLETED" || status === "CONFIRMED") {
    return "success";
  }

  if (status === "PENDING") {
    return "warning";
  }

  if (status === "CANCELLED" || status === "NO_SHOW") {
    return "destructive";
  }

  return "muted";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
