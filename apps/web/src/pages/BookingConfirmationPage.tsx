import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HomeHeader } from "../components/home/home-header";
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
    <div className="min-w-0">
      <p className="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium leading-5 text-foreground">
        {value}
      </p>
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
    <>
      <HomeHeader />
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary via-primary/70 to-primary/10 text-primary-foreground">
        <div className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 md:py-12">
          <header>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">
              Booking confirmation
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-primary-foreground md:text-4xl">
              Appointment details
            </h1>
          </header>

          <Card className="border-border bg-card/95 text-card-foreground shadow-lg backdrop-blur">
            <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
              <CardTitle className="text-base sm:text-xl">
                Reference {referenceNumber || "not provided"}
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Please save or screenshot these appointment details for future
                reference.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 pt-0 sm:gap-5 sm:p-6 sm:pt-0">
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
                  <section className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
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

                  <section className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
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

                  <section className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-card px-4 py-2 text-sm font-medium text-primary shadow-lg transition-colors hover:bg-card/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 sm:w-fit"
              to="/book"
            >
              Book another appointment
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary-foreground/25 bg-card/90 px-4 py-2 text-sm font-medium text-primary shadow-lg transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 sm:w-fit"
              to="/"
            >
              Return to homepage
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
