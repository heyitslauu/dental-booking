import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { getClinics } from "../features/clinics/api";
import type { Appointment, AppointmentStatus } from "../features/booking/types";
import {
  listAppointments,
  updateAppointmentStatus,
  type AppointmentFilters,
} from "../features/admin/appointments/api";

const appointmentStatuses: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

const statusLabels: Record<AppointmentStatus, string> = {
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  NO_SHOW: "No show",
  PENDING: "Pending",
};

const emptyFilters: AppointmentFilters = {
  clinicId: "",
  from: "",
  status: "",
  to: "",
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatAppointmentRange(appointment: Appointment) {
  return `${formatDateTime(appointment.startAt)} - ${formatTime(
    appointment.endAt,
  )}`;
}

function getPatientName(appointment: Appointment) {
  return `${appointment.patientProfile.firstName} ${appointment.patientProfile.lastName}`.trim();
}

function getPatientContact(appointment: Appointment) {
  return appointment.patientProfile.phone ?? appointment.patientProfile.email;
}

function getStatusVariant(status: AppointmentStatus) {
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return "success" as const;
  }

  if (status === "CANCELLED" || status === "NO_SHOW") {
    return "destructive" as const;
  }

  return "warning" as const;
}

export function AdminAppointmentsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AppointmentFilters>(emptyFilters);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [nextStatus, setNextStatus] = useState<AppointmentStatus>("PENDING");

  const clinicsQuery = useQuery({
    queryKey: ["admin", "clinics"],
    queryFn: getClinics,
  });

  const appointmentsQuery = useQuery({
    queryKey: ["admin", "appointments", filters],
    queryFn: () => listAppointments(filters),
  });

  const selectedAppointment = useMemo(
    () =>
      appointmentsQuery.data?.find(
        (appointment) => appointment.id === selectedAppointmentId,
      ) ?? null,
    [appointmentsQuery.data, selectedAppointmentId],
  );

  const statusMutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (updatedAppointment) => {
      setNextStatus(updatedAppointment.status);
      closeAppointment();
      toast.success("Appointment status updated.", {
        description: `${updatedAppointment.referenceNumber} is now ${
          statusLabels[updatedAppointment.status]
        }.`,
      });
      queryClient.setQueriesData<Appointment[]>(
        { queryKey: ["admin", "appointments"] },
        (currentAppointments) =>
          currentAppointments?.map((appointment) =>
            appointment.id === updatedAppointment.id
              ? updatedAppointment
              : appointment,
          ),
      );
      void queryClient.invalidateQueries({
        queryKey: ["admin", "appointments"],
      });
    },
    onError: (error) => {
      toast.error("Status update failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to update appointment status.",
      });
    },
  });

  function updateFilter(field: keyof AppointmentFilters, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
      ...(field === "from" && currentFilters.to && value > currentFilters.to
        ? { to: "" }
        : {}),
    }));
  }

  function clearFilters() {
    setFilters(emptyFilters);
  }

  function openAppointment(appointment: Appointment) {
    setSelectedAppointmentId(appointment.id);
    setNextStatus(appointment.status);
    statusMutation.reset();
  }

  function closeAppointment() {
    setSelectedAppointmentId(null);
    statusMutation.reset();
  }

  function handleStatusUpdate() {
    if (!selectedAppointment || nextStatus === selectedAppointment.status) {
      return;
    }

    statusMutation.mutate({
      appointmentId: selectedAppointment.id,
      status: nextStatus,
    });
  }

  const appointments = appointmentsQuery.data ?? [];
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <AdminLayout
      actions={
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface"
          to="/book"
        >
          Guest booking
        </Link>
      }
      title="Appointments"
    >

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <Label className="grid gap-2">
                <span>Clinic</span>
                <Select
                  disabled={clinicsQuery.isLoading}
                  onChange={(event) =>
                    updateFilter("clinicId", event.target.value)
                  }
                  value={filters.clinicId}
                >
                  <option value="">All clinics</option>
                  {(clinicsQuery.data ?? []).map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </Select>
                {clinicsQuery.error ? (
                  <span className="text-xs font-medium text-destructive">
                    Unable to load clinics.
                  </span>
                ) : null}
              </Label>

              <Label className="grid gap-2">
                <span>Status</span>
                <Select
                  onChange={(event) => updateFilter("status", event.target.value)}
                  value={filters.status}
                >
                  <option value="">All statuses</option>
                  {appointmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </Select>
              </Label>

              <Label className="grid gap-2">
                <span>From</span>
                <Input
                  onChange={(event) => updateFilter("from", event.target.value)}
                  type="date"
                  value={filters.from}
                />
              </Label>

              <Label className="grid gap-2">
                <span>To</span>
                <Input
                  min={filters.from || undefined}
                  onChange={(event) => updateFilter("to", event.target.value)}
                  type="date"
                  value={filters.to}
                />
              </Label>

              <div className="flex items-end">
                <Button
                  disabled={!hasActiveFilters}
                  onClick={clearFilters}
                  type="button"
                  variant="outline"
                >
                  Clear filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Appointment list</CardTitle>
            <p className="text-sm text-muted-foreground">
              {appointmentsQuery.isFetching
                ? "Refreshing..."
                : `${appointments.length} appointments`}
            </p>
          </CardHeader>
          <CardContent>
            {appointmentsQuery.error ? (
              <div className="grid gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  {appointmentsQuery.error instanceof Error
                    ? appointmentsQuery.error.message
                    : "Unable to load appointments."}
                </p>
                <Button
                  className="w-fit"
                  onClick={() => void appointmentsQuery.refetch()}
                  type="button"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : null}

            {!appointmentsQuery.error ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Clinic
                    </TableHead>
                    <TableHead>Service details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentsQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={6}
                      >
                        Loading appointments...
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {!appointmentsQuery.isLoading && appointments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={6}
                      >
                        No appointments match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.referenceNumber}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {getPatientName(appointment)}
                        </p>
                        {getPatientContact(appointment) ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {getPatientContact(appointment)}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {appointment.clinic.name}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {appointment.service.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatAppointmentRange(appointment)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(appointment.status)}>
                          {statusLabels[appointment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          aria-label={`View appointment ${appointment.referenceNumber}`}
                          className="h-8 w-8 px-0"
                          onClick={() => openAppointment(appointment)}
                          type="button"
                          variant="outline"
                        >
                          <Eye aria-hidden className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closeAppointment();
          }
        }}
        open={Boolean(selectedAppointment)}
      >
        {selectedAppointment ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Appointment {selectedAppointment.referenceNumber}
              </DialogTitle>
              <DialogDescription>
                View appointment details and update the appointment status.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-5">
              <section className="grid gap-3 sm:grid-cols-2">
                <DetailRow
                  label="Patient"
                  value={getPatientName(selectedAppointment)}
                />
                <DetailRow
                  label="Contact"
                  value={selectedAppointment.patientProfile.phone ?? "Not provided"}
                />
                <DetailRow
                  label="Email"
                  value={selectedAppointment.patientProfile.email ?? "Not provided"}
                />
                <DetailRow
                  label="Clinic"
                  value={selectedAppointment.clinic.name}
                />
                <DetailRow
                  label="Service"
                  value={selectedAppointment.service.name}
                />
                <DetailRow
                  label="Starts"
                  value={formatDateTime(selectedAppointment.startAt)}
                />
                <DetailRow
                  label="Ends"
                  value={formatDateTime(selectedAppointment.endAt)}
                />
                <DetailRow
                  label="Notes"
                  value={selectedAppointment.notes ?? "None"}
                />
              </section>

              <section className="grid gap-3 rounded-md bg-surface p-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <Label className="grid gap-2">
                  <span>Status</span>
                  <Select
                    disabled={statusMutation.isPending}
                    onChange={(event) => {
                      setNextStatus(event.target.value as AppointmentStatus);
                      statusMutation.reset();
                    }}
                    value={nextStatus}
                  >
                    {appointmentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </Select>
                </Label>
                <Button
                  disabled={
                    nextStatus === selectedAppointment.status ||
                    statusMutation.isPending
                  }
                  onClick={handleStatusUpdate}
                  type="button"
                >
                  {statusMutation.isPending ? "Updating..." : "Update status"}
                </Button>
                {statusMutation.error ? (
                  <p className="text-sm font-medium text-destructive sm:col-span-2">
                    {statusMutation.error instanceof Error
                      ? statusMutation.error.message
                      : "Unable to update appointment status."}
                  </p>
                ) : null}
              </section>
            </div>

            <DialogFooter>
              <DialogClose onClose={closeAppointment} />
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </AdminLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
