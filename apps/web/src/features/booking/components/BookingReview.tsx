import type { ReactNode } from "react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import type { Clinic, ClinicService, PatientDetails } from "../types";

type BookingReviewProps = {
  patientDetails: PatientDetails | null;
  selectedDate: string;
  selectedClinic: Clinic | null;
  selectedService: ClinicService | null;
  selectedTime: string;
  startAt: string | null;
  onBack: () => void;
  onCancel: () => void;
  onEditStep?: (step: number) => void;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(priceCents / 100);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatDate(value: string) {
  if (!value) {
    return "Not selected";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium"
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
    minute: "2-digit"
  }).format(date);
}

export function BookingReview({
  patientDetails,
  selectedDate,
  selectedClinic,
  selectedService,
  selectedTime,
  startAt,
  onBack,
  onCancel,
  onEditStep
}: BookingReviewProps) {
  const isComplete = Boolean(
    selectedClinic && selectedService && startAt && patientDetails
  );

  return (
    <div className="mt-5 grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewCard title="Clinic">
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
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep?.(0)} title="Service">
          {selectedService ? (
            <>
              <SummaryRow
                label="Service"
                value={selectedService.service.name}
              />
              <SummaryRow
                label="Duration"
                value={
                  Number.isFinite(selectedService.service.durationMinutes)
                    ? `${selectedService.service.durationMinutes} minutes`
                    : "Not provided"
                }
              />
              <SummaryRow
                label="Price"
                value={formatPrice(selectedService.service.priceCents)}
              />
            </>
          ) : (
            <MissingText>Select a service.</MissingText>
          )}
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep?.(0)} title="Appointment">
          {startAt ? (
            <>
              <SummaryRow
                label="Service"
                value={selectedService?.service.name ?? "Not selected"}
              />
              <SummaryRow label="Date" value={formatDate(selectedDate)} />
              <SummaryRow label="Time" value={formatTime(selectedTime)} />
              <SummaryRow label="Starts" value={formatDateTime(startAt)} />
            </>
          ) : (
            <MissingText>Select an appointment date and time.</MissingText>
          )}
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep?.(1)} title="Patient">
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
        </ReviewCard>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-zinc-50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onBack} type="button" variant="outline">
            Back
          </Button>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        </div>
        <Button
          disabled={!isComplete}
          type="button"
        >
          Confirm Booking
        </Button>
        <p className="text-sm text-zinc-600">
          {isComplete
            ? "Ready for the booking submission step."
            : "Complete the missing details before confirming."}
        </p>
      </div>
    </div>
  );
}

type ReviewCardProps = {
  children: ReactNode;
  onEdit?: () => void;
  title: string;
};

function ReviewCard({ children, onEdit, title }: ReviewCardProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
        {onEdit ? (
          <button
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid gap-3">{children}</div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-zinc-900">{value}</p>
    </div>
  );
}

function MissingText({ children }: { children: ReactNode }) {
  return <p className="text-sm text-zinc-500">{children}</p>;
}
