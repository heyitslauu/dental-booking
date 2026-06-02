import type { ReactNode } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import type { Clinic, ClinicService, PatientDetails } from "../types";

type BookingReviewProps = {
  isSubmitting: boolean;
  patientDetails: PatientDetails | null;
  selectedDate: string;
  selectedClinic: Clinic | null;
  selectedService: ClinicService | null;
  selectedTime: string;
  startAt: string | null;
  submissionError: string | null;
  onBack: () => void;
  onConfirm: () => void;
  onEditStep?: (step: number) => void;
};

function formatDate(value: string) {
  if (!value) {
    return "Not selected";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(value: string) {
  if (!value) {
    return "Not selected";
  }

  const date = new Date(`2000-01-01T${value}:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function BookingReview({
  isSubmitting,
  patientDetails,
  selectedDate,
  selectedClinic,
  selectedService,
  selectedTime,
  startAt,
  submissionError,
  onBack,
  onConfirm,
  onEditStep,
}: BookingReviewProps) {
  const isComplete = Boolean(
    selectedClinic && selectedService && startAt && patientDetails,
  );

  return (
    <div className="mt-5 grid gap-4">
      <Card>
        <CardContent className="grid gap-5  bg-background py-5">
          <ReviewSection title="Clinic">
            {selectedClinic ? (
              <>
                <SummaryRow label="Branch" value={selectedClinic.name} />
                <SummaryRow
                  label="Address"
                  value={selectedClinic.address ?? "Address to be confirmed"}
                />
                <SummaryRow
                  label="Phone"
                  value={selectedClinic.phone ?? "Not provided"}
                />
              </>
            ) : (
              <MissingText>Select a clinic branch.</MissingText>
            )}
          </ReviewSection>

          <Separator />

          <ReviewSection onEdit={() => onEditStep?.(0)} title="Appointment">
            {selectedService || startAt ? (
              <>
                <SummaryRow
                label="Service"
                value={selectedService?.service.name ?? "Not selected"}
              />
              <SummaryRow
                label="Scheduled on"
                value={
                  selectedDate && selectedTime
                    ? `${formatDate(selectedDate)} at ${formatTime(selectedTime)}`
                    : "Not selected"
                }
              />
              </>
            ) : (
              <MissingText>
                Select an appointment service, date, and time.
              </MissingText>
            )}
          </ReviewSection>

          <Separator />

          <ReviewSection onEdit={() => onEditStep?.(1)} title="Patient">
            {patientDetails ? (
              <>
                <SummaryRow
                  label="Name"
                  value={`${patientDetails.firstName} ${patientDetails.lastName}`}
                />
                <SummaryRow
                  label="Contact"
                  value={patientDetails.contactNumber}
                />
                <SummaryRow
                  label="Email"
                  value={patientDetails.email || "Not provided"}
                />
                <SummaryRow
                  label="Birth date"
                  value={patientDetails.birthDate || "Not provided"}
                />
                <SummaryRow
                  label="Notes"
                  value={patientDetails.notes || "None"}
                />
              </>
            ) : (
              <MissingText>Save valid patient details.</MissingText>
            )}
          </ReviewSection>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-3 rounded-md bg-surface p-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onBack} type="button" variant="outline">
            Back
          </Button>
        </div>
        <Button
          disabled={!isComplete || isSubmitting}
          onClick={onConfirm}
          type="button"
        >
          {isSubmitting ? "Confirming..." : "Confirm Booking"}
        </Button>
        <p className="text-sm text-muted-foreground lg:col-span-2">
          {isComplete
            ? "Confirm to create the guest patient profile and appointment."
            : "Complete the missing details before confirming."}
        </p>
        {submissionError ? (
          <p className="text-sm font-medium text-destructive lg:col-span-2">
            {submissionError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

type ReviewSectionProps = {
  children: ReactNode;
  onEdit?: () => void;
  title: string;
};

function ReviewSection({ children, onEdit, title }: ReviewSectionProps) {
  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        {onEdit ? (
          <button
            className="text-sm font-medium text-primary hover:opacity-80"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function MissingText({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
