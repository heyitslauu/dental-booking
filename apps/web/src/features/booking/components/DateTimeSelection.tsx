import type { Clinic, ClinicService } from "../types";

type TimeOption = {
  label: string;
  value: string;
};

export const timeOptions: TimeOption[] = [
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "1:00 PM", value: "13:00" },
  { label: "2:00 PM", value: "14:00" },
  { label: "3:00 PM", value: "15:00" },
  { label: "4:00 PM", value: "16:00" },
  { label: "5:00 PM", value: "17:00" },
  { label: "6:00 PM", value: "18:00" }
];

type DateTimeSelectionProps = {
  minDate: string;
  selectedClinic: Clinic | null;
  selectedDate: string;
  selectedService: ClinicService | null;
  selectedTime: string;
  startAt: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
};

export function DateTimeSelection({
  minDate,
  selectedClinic,
  selectedDate,
  selectedService,
  selectedTime,
  startAt,
  onSelectDate,
  onSelectTime
}: DateTimeSelectionProps) {
  const canChooseSchedule = Boolean(selectedClinic && selectedService);

  if (!canChooseSchedule) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
        Select a branch and service before choosing an appointment date and time.
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium text-foreground">
        <span>
          Appointment date{" "}
          <span className="font-bold text-destructive">* Required</span>
        </span>
        <input
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          min={minDate}
          onChange={(event) => onSelectDate(event.target.value)}
          type="date"
          value={selectedDate}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        <span>
          Appointment time{" "}
          <span className="font-bold text-destructive">* Required</span>
        </span>
        <select
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          onChange={(event) => onSelectTime(event.target.value)}
          value={selectedTime}
        >
          <option value="">Select a time</option>
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-md bg-surface p-3 text-sm text-muted-foreground sm:col-span-2">
        {startAt
          ? "Date and time selected."
          : "Choose both a date and time to continue."}
      </div>
    </div>
  );
}
