import { useState, type FormEvent } from "react";
import type { PatientDetails } from "../types";

type PatientDetailsErrors = Partial<Record<keyof PatientDetails, string>>;

type PatientDetailsFormProps = {
  canEnterDetails: boolean;
  details: PatientDetails;
  savedDetails: PatientDetails | null;
  onChangeDetails: (details: PatientDetails) => void;
  onSaveDetails: (details: PatientDetails) => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyPatientDetails: PatientDetails = {
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  birthDate: "",
  notes: ""
};

function validatePatientDetails(details: PatientDetails) {
  const errors: PatientDetailsErrors = {};
  const trimmedEmail = details.email.trim();

  if (!details.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!details.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!details.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required.";
  }

  if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function normalizePatientDetails(details: PatientDetails): PatientDetails {
  return {
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    contactNumber: details.contactNumber.trim(),
    email: details.email.trim(),
    birthDate: details.birthDate,
    notes: details.notes.trim()
  };
}

export function PatientDetailsForm({
  canEnterDetails,
  details,
  savedDetails,
  onChangeDetails,
  onSaveDetails
}: PatientDetailsFormProps) {
  const [errors, setErrors] = useState<PatientDetailsErrors>({});

  function updateField(field: keyof PatientDetails, value: string) {
    onChangeDetails({ ...details, [field]: value });
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextDetails = normalizePatientDetails(details);
    const nextErrors = validatePatientDetails(nextDetails);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onChangeDetails(nextDetails);
    onSaveDetails(nextDetails);
  }

  if (!canEnterDetails) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
        Select a branch, service, appointment date, and appointment time before
        entering patient details.
      </div>
    );
  }

  return (
    <form className="mt-5 grid gap-4" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          error={errors.firstName}
          label="First name"
          name="firstName"
          onChange={(value) => updateField("firstName", value)}
          required
          value={details.firstName}
        />
        <Field
          error={errors.lastName}
          label="Last name"
          name="lastName"
          onChange={(value) => updateField("lastName", value)}
          required
          value={details.lastName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          error={errors.contactNumber}
          label="Contact number"
          name="contactNumber"
          onChange={(value) => updateField("contactNumber", value)}
          required
          type="tel"
          value={details.contactNumber}
        />
        <Field
          error={errors.email}
          label="Email"
          name="email"
          onChange={(value) => updateField("email", value)}
          type="email"
          value={details.email}
        />
      </div>

      <Field
        error={errors.birthDate}
        label="Birth date"
        name="birthDate"
        onChange={(value) => updateField("birthDate", value)}
        type="date"
        value={details.birthDate}
      />

      <label className="grid gap-2 text-sm font-medium text-zinc-800">
        Notes
        <textarea
          className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          name="notes"
          onChange={(event) => updateField("notes", event.target.value)}
          value={details.notes}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
          type="submit"
        >
          Save patient details
        </button>
        {savedDetails ? (
          <p className="text-sm font-medium text-teal-800">
            Patient details saved.
          </p>
        ) : null}
      </div>
    </form>
  );
}

type FieldProps = {
  error?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({
  error,
  label,
  name,
  required = false,
  type = "text",
  value,
  onChange
}: FieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-800">
      {label}
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-10 rounded-md border bg-white px-3 text-sm text-zinc-950 outline-none transition focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-600 focus:ring-red-600/20"
            : "border-zinc-300 focus:border-teal-700 focus:ring-teal-700/20"
        }`}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
      {error ? (
        <p className="text-sm font-medium text-red-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </label>
  );
}
