import { useState, type InputHTMLAttributes } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { cn } from "../../../lib/utils";
import type { PatientDetails } from "../types";

export type PatientDetailsErrors = Partial<Record<keyof PatientDetails, string>>;

type PatientDetailsFormProps = {
  canEnterDetails: boolean;
  details: PatientDetails;
  onChangeDetails: (details: PatientDetails) => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const philippineMobilePattern = /^09\d{9}$/;

export const emptyPatientDetails: PatientDetails = {
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  birthDate: "",
  notes: ""
};

export function getPatientDetailsErrors(details: PatientDetails) {
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
  } else if (!philippineMobilePattern.test(details.contactNumber.trim())) {
    errors.contactNumber =
      "Contact number must start with 09 and contain exactly 11 digits.";
  }

  if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function normalizePatientDetails(
  details: PatientDetails
): PatientDetails {
  return {
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    contactNumber: details.contactNumber.trim(),
    email: details.email.trim(),
    birthDate: details.birthDate,
    notes: details.notes.trim()
  };
}

export function isPatientDetailsValid(details: PatientDetails) {
  return Object.keys(getPatientDetailsErrors(normalizePatientDetails(details)))
    .length === 0;
}

export function PatientDetailsForm({
  canEnterDetails,
  details,
  onChangeDetails
}: PatientDetailsFormProps) {
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof PatientDetails, boolean>>
  >({});
  const normalizedDetails = normalizePatientDetails(details);
  const errors = getPatientDetailsErrors(normalizedDetails);
  const isValid = Object.keys(errors).length === 0;

  function updateField(field: keyof PatientDetails, value: string) {
    onChangeDetails({ ...details, [field]: value });
  }

  function updateContactNumber(value: string) {
    updateField("contactNumber", value.replace(/\D/g, "").slice(0, 11));
  }

  function touchField(field: keyof PatientDetails) {
    setTouchedFields((currentFields) => ({ ...currentFields, [field]: true }));
  }

  if (!canEnterDetails) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
        Select a branch, service, appointment date, and appointment time before
        entering patient details.
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          error={touchedFields.firstName ? errors.firstName : undefined}
          label="First name"
          name="firstName"
          onBlur={() => touchField("firstName")}
          onChange={(value) => updateField("firstName", value)}
          required
          value={details.firstName}
        />
        <Field
          error={touchedFields.lastName ? errors.lastName : undefined}
          label="Last name"
          name="lastName"
          onBlur={() => touchField("lastName")}
          onChange={(value) => updateField("lastName", value)}
          required
          value={details.lastName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          error={
            touchedFields.contactNumber ? errors.contactNumber : undefined
          }
          label="Contact number"
          maxLength={11}
          name="contactNumber"
          onBlur={() => touchField("contactNumber")}
          onChange={updateContactNumber}
          placeholder="09123456789"
          inputClassName="placeholder:text-foreground/35"
          required
          inputMode="numeric"
          type="tel"
          value={details.contactNumber}
        />
        <Field
          error={touchedFields.email ? errors.email : undefined}
          label="Email"
          name="email"
          onBlur={() => touchField("email")}
          onChange={(value) => updateField("email", value)}
          type="email"
          value={details.email}
        />
      </div>

      <Field
        error={errors.birthDate}
        label="Birth date"
        name="birthDate"
        onBlur={() => touchField("birthDate")}
        onChange={(value) => updateField("birthDate", value)}
        type="date"
        value={details.birthDate}
      />

      <Label className="grid gap-2">
        <span>
          Notes <OptionalText />
        </span>
        <Textarea
          name="notes"
          onChange={(event) => updateField("notes", event.target.value)}
          value={details.notes}
        />
      </Label>

      <p className={`text-sm ${isValid ? "text-primary" : "text-muted-foreground"}`}>
        {isValid
          ? "Patient details are ready."
          : "Complete the required patient details to continue."}
      </p>
    </div>
  );
}

type FieldProps = {
  error?: string;
  label: string;
  name: string;
  required?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  inputClassName?: string;
  maxLength?: number;
  placeholder?: string;
  type?: string;
  value: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

function Field({
  error,
  label,
  inputMode,
  inputClassName,
  maxLength,
  name,
  placeholder,
  required = false,
  type = "text",
  value,
  onBlur,
  onChange
}: FieldProps) {
  const errorId = `${name}-error`;

  return (
    <Label className="grid gap-2">
      <span>
        {label}
        {required ? (
          <span className="font-bold text-destructive"> * Required</span>
        ) : (
          <OptionalText />
        )}
      </span>
      <Input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          inputClassName,
          error
            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
            : undefined,
        )}
        name={name}
        inputMode={inputMode}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {error ? (
        <p className="text-sm font-medium text-destructive" id={errorId}>
          {error}
        </p>
      ) : null}
    </Label>
  );
}

function OptionalText() {
  return (
    <span className="font-normal text-muted-foreground/60"> (Optional)</span>
  );
}
