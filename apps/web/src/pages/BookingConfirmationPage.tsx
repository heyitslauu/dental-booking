import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { getAppointmentByReferenceNumber } from "../features/booking/api";
import type { Appointment } from "../features/booking/types";

function maskWord(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Not provided";
  }

  return `${trimmedValue.slice(0, 2)}${"*".repeat(Math.max(trimmedValue.length - 2, 2))}`;
}

function maskEmail(value: string | null) {
  if (!value) {
    return "Not provided";
  }

  const [name, domain] = value.split("@");

  if (!domain) {
    return maskWord(value);
  }

  return `${maskWord(name)}@${domain}`;
}

function maskPhone(value: string | null) {
  if (!value) {
    return "Not provided";
  }

  return `${value.slice(0, 2)}${"*".repeat(Math.max(value.length - 2, 2))}`;
}

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

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();
  const referenceNumber = searchParams.get("reference")?.trim().toUpperCase() ?? "";
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(referenceNumber));

  const maskedPatientName = useMemo(() => {
    if (!appointment) {
      return "Not provided";
    }

    return `${maskWord(appointment.patientProfile.firstName)} ${maskWord(
      appointment.patientProfile.lastName,
    )}`;
  }, [appointment]);

  useEffect(() => {
    let isCurrent = true;

    async function loadAppointment() {
      if (!referenceNumber) {
        setError("Booking reference is required.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextAppointment =
          await getAppointmentByReferenceNumber(referenceNumber);

        if (isCurrent) {
          setAppointment(nextAppointment);
        }
      } catch (nextError) {
        if (isCurrent) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Unable to load booking details.",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadAppointment();

    return () => {
      isCurrent = false;
    };
  }, [referenceNumber]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-3xl gap-6 px-6 py-8 md:py-12">
        <header>
          <Link
            className="inline-flex rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-primary transition hover:bg-surface"
            to="/"
          >
            Back to homepage
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-accent-foreground">
            Booking confirmation
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-primary md:text-4xl">
            Appointment details
          </h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>
              Reference {referenceNumber || "not provided"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading booking details...
              </p>
            ) : null}

            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            ) : null}

            {appointment ? (
              <>
                <section className="grid gap-3 sm:grid-cols-2">
                  <DetailRow label="Clinic" value={appointment.clinic.name} />
                  <DetailRow
                    label="Clinic phone"
                    value={appointment.clinic.phone ?? "Not provided"}
                  />
                  <DetailRow
                    label="Clinic address"
                    value={appointment.clinic.address ?? "Not provided"}
                  />
                  <DetailRow label="Service" value={appointment.service.name} />
                </section>

                <Separator />

                <section className="grid gap-3 sm:grid-cols-2">
                  <DetailRow
                    label="Starts"
                    value={formatDateTime(appointment.startAt)}
                  />
                  <DetailRow
                    label="Ends"
                    value={formatDateTime(appointment.endAt)}
                  />
                  <DetailRow label="Status" value={appointment.status} />
                  <DetailRow
                    label="Reference"
                    value={appointment.referenceNumber}
                  />
                </section>

                <Separator />

                <section className="grid gap-3 sm:grid-cols-2">
                  <DetailRow label="Patient" value={maskedPatientName} />
                  <DetailRow
                    label="Email"
                    value={maskEmail(appointment.patientProfile.email)}
                  />
                  <DetailRow
                    label="Contact"
                    value={maskPhone(appointment.patientProfile.phone)}
                  />
                  <DetailRow
                    label="Notes"
                    value={appointment.notes ?? "None"}
                  />
                </section>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Link
          className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          to="/book"
        >
          Book another appointment
        </Link>
      </div>
    </main>
  );
}
