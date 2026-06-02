import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { getClinicServices, getClinics } from "../../clinics/api";
import { createAppointment, createGuestPatient } from "../api";
import type { Appointment, Clinic, ClinicService, PatientDetails } from "../types";
import { BookingReview } from "./BookingReview";
import { ClinicChangeWarningDialog } from "./ClinicChangeWarningDialog";
import { ClinicSelectionDialog } from "./ClinicSelectionDialog";
import { DateTimeSelection } from "./DateTimeSelection";
import {
  emptyPatientDetails,
  isPatientDetailsValid,
  normalizePatientDetails,
  PatientDetailsForm,
} from "./PatientDetailsForm";
import { ServiceSelection } from "./ServiceSelection";

const bookingSteps = [
  "Select Appointment",
  "Your Details",
  "Review and Confirm",
];

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getAppointmentTimes(date: string, time: string) {
  if (!date || !time) {
    return { endAt: null, startAt: null };
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return { endAt: null, startAt: null };
  }

  const startAt = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (Number.isNaN(startAt.getTime())) {
    return { endAt: null, startAt: null };
  }

  const endAt = new Date(startAt);

  endAt.setHours(endAt.getHours() + 1);

  return {
    endAt: endAt.toISOString(),
    startAt: startAt.toISOString(),
  };
}

function getSubmissionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Booking submission failed. Please try again.";
}

export function BookingFlow() {
  const isSubmittingBookingRef = useRef(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicsError, setClinicsError] = useState<string | null>(null);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isClinicDialogOpen, setIsClinicDialogOpen] = useState(true);
  const [isClinicChangeWarningOpen, setIsClinicChangeWarningOpen] =
    useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<ClinicService | null>(
    null,
  );
  const [services, setServices] = useState<ClinicService[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientDetailsDraft, setPatientDetailsDraft] =
    useState<PatientDetails>(emptyPatientDetails);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null,
  );
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [clinicsReloadKey, setClinicsReloadKey] = useState(0);
  const [servicesReloadKey, setServicesReloadKey] = useState(0);
  const minDate = useMemo(() => getTodayDateValue(), []);
  const appointmentTimes = useMemo(
    () => getAppointmentTimes(selectedDate, selectedTime),
    [selectedDate, selectedTime],
  );
  const startAt = appointmentTimes.startAt;
  const isSelectAppointmentComplete = Boolean(
    selectedService && selectedDate && selectedTime && startAt,
  );
  const isYourDetailsComplete = isPatientDetailsValid(patientDetailsDraft);

  useEffect(() => {
    let isCurrent = true;

    async function loadClinics() {
      setIsLoadingClinics(true);
      setClinicsError(null);

      try {
        const nextClinics = await getClinics();

        if (!isCurrent) {
          return;
        }

        setClinics(nextClinics);
        setSelectedClinic((currentClinic) => {
          if (!currentClinic) {
            return null;
          }

          return (
            nextClinics.find((clinic) => clinic.id === currentClinic.id) ?? null
          );
        });
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setClinicsError(
          error instanceof Error ? error.message : "Unexpected error.",
        );
      } finally {
        if (isCurrent) {
          setIsLoadingClinics(false);
        }
      }
    }

    loadClinics();

    return () => {
      isCurrent = false;
    };
  }, [clinicsReloadKey]);

  useEffect(() => {
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedClinic?.id]);

  useEffect(() => {
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedService?.id]);

  function handleSelectDate(date: string) {
    if (date && date < minDate) {
      return;
    }

    setSubmissionError(null);
    setSelectedDate(date);
  }

  function handleSelectService(service: ClinicService | null) {
    setSubmissionError(null);
    setSelectedService(service);
  }

  function handleSelectTime(time: string) {
    setSubmissionError(null);
    setSelectedTime(time);
  }

  function handleChangePatientDetails(details: PatientDetails) {
    setPatientDetailsDraft(details);
    setPatientDetails(
      isPatientDetailsValid(details) ? normalizePatientDetails(details) : null,
    );
    setSubmissionError(null);
  }

  function handleClinicDialogOpenChange(open: boolean) {
    if (!selectedClinic && !open) {
      return;
    }

    setIsClinicDialogOpen(open);
  }

  function handleSelectClinic(clinic: Clinic) {
    setSelectedClinic(clinic);
    setIsClinicDialogOpen(false);
    setActiveStep(0);
    setSubmissionError(null);
    setCreatedAppointment(null);
  }

  function handleRequestClinicChange() {
    setIsClinicChangeWarningOpen(true);
  }

  function handleCancelClinicChange() {
    setIsClinicChangeWarningOpen(false);
  }

  function handleConfirmClinicChange() {
    setSelectedClinic(null);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
    setPatientDetailsDraft(emptyPatientDetails);
    setPatientDetails(null);
    setCreatedAppointment(null);
    setSubmissionError(null);
    isSubmittingBookingRef.current = false;
    setIsSubmittingBooking(false);
    setActiveStep(0);
    setIsClinicChangeWarningOpen(false);
    setIsClinicDialogOpen(true);
  }

  async function handleConfirmBooking() {
    if (
      isSubmittingBookingRef.current ||
      isSubmittingBooking ||
      !selectedClinic ||
      !selectedService ||
      !startAt ||
      !patientDetails
    ) {
      return;
    }

    const { endAt } = getAppointmentTimes(selectedDate, selectedTime);

    if (!endAt) {
      setSubmissionError("Select a valid appointment date and time.");
      return;
    }

    isSubmittingBookingRef.current = true;
    setIsSubmittingBooking(true);
    setSubmissionError(null);

    try {
      const guestPatient = await createGuestPatient({
        firstName: patientDetails.firstName,
        lastName: patientDetails.lastName,
        phone: patientDetails.contactNumber,
        ...(patientDetails.email ? { email: patientDetails.email } : {}),
        ...(patientDetails.birthDate
          ? { birthDate: patientDetails.birthDate }
          : {}),
      });

      const appointment = await createAppointment({
        clinicId: selectedClinic.id,
        serviceId: selectedService.serviceId,
        patientId: guestPatient.id,
        startAt,
        endAt,
        ...(patientDetails.notes ? { notes: patientDetails.notes } : {}),
      });

      setCreatedAppointment(appointment);
    } catch (error) {
      setSubmissionError(getSubmissionErrorMessage(error));
    } finally {
      isSubmittingBookingRef.current = false;
      setIsSubmittingBooking(false);
    }
  }

  function goToPreviousStep() {
    setActiveStep((step) => Math.max(step - 1, 0));
  }

  function goToNextStep() {
    if (activeStep === 0 && !isSelectAppointmentComplete) {
      return;
    }

    if (activeStep === 1 && !isYourDetailsComplete) {
      return;
    }

    setActiveStep((step) => Math.min(step + 1, bookingSteps.length - 1));
  }

  function canNavigateToStep(step: number) {
    if (step <= activeStep) {
      return true;
    }

    if (step === 1) {
      return isSelectAppointmentComplete;
    }

    if (step === 2) {
      return isSelectAppointmentComplete && isYourDetailsComplete;
    }

    return false;
  }

  function handleSelectStep(step: number) {
    if (!canNavigateToStep(step)) {
      return;
    }

    setActiveStep(step);
  }

  useEffect(() => {
    let isCurrent = true;

    async function loadServices(clinicId: string) {
      setIsLoadingServices(true);
      setServicesError(null);

      try {
        const nextServices = await getClinicServices(clinicId);

        if (!isCurrent) {
          return;
        }

        setServices(nextServices);
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setServices([]);
        setServicesError(
          error instanceof Error ? error.message : "Unexpected error.",
        );
      } finally {
        if (isCurrent) {
          setIsLoadingServices(false);
        }
      }
    }

    if (!selectedClinic) {
      setServices([]);
      setServicesError(null);
      setIsLoadingServices(false);
      return;
    }

    loadServices(selectedClinic.id);

    return () => {
      isCurrent = false;
    };
  }, [selectedClinic, servicesReloadKey]);

  return (
    <>
      <ClinicSelectionDialog
        clinics={clinics}
        error={clinicsError}
        isLoading={isLoadingClinics}
        onOpenChange={handleClinicDialogOpenChange}
        onRetry={() => setClinicsReloadKey((key) => key + 1)}
        onSelectClinic={handleSelectClinic}
        open={isClinicDialogOpen || !selectedClinic}
        selectedClinic={selectedClinic}
      />

      <ClinicChangeWarningDialog
        onCancel={handleCancelClinicChange}
        onContinue={handleConfirmClinicChange}
        open={isClinicChangeWarningOpen}
      />

      {!selectedClinic ? null : (
        <section className="grid gap-4">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Selected clinic</CardTitle>
                <p className="mt-3 text-xl font-bold uppercase tracking-wide text-foreground">
                  {selectedClinic.name}
                </p>
              </div>
              <Button
                onClick={handleRequestClinicChange}
                type="button"
                variant="outline"
              >
                Change Clinic
              </Button>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p>{selectedClinic.address ?? "Address to be confirmed"}</p>
              <p>{selectedClinic.phone ?? "Contact number to be confirmed"}</p>
            </CardContent>
          </Card>

          {createdAppointment ? (
            <Card>
              <CardContent className="grid gap-4 py-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
                    Booking confirmed
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-primary">
                    Your appointment has been booked.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We created the guest patient profile and saved the
                    appointment for the selected clinic.
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Appointment reference
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {createdAppointment.referenceCode ??
                      "Reference code not returned"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <ol className="grid grid-cols-3 gap-2">
                {bookingSteps.map((step, index) => {
                  const isCurrent = activeStep === index;
                  const isComplete = activeStep > index;
                  const canSelect = canNavigateToStep(index);

                  return (
                    <li key={step}>
                      <button
                        className={`grid w-full justify-items-center gap-2 rounded-md border px-2 py-3 text-center text-xs transition ${
                          isCurrent
                            ? "border-accent bg-accent/10 text-accent-foreground"
                            : isComplete
                              ? "border-primary/20 bg-background text-primary"
                              : "border-border bg-background text-muted-foreground"
                        } ${canSelect ? "hover:border-accent" : "cursor-not-allowed opacity-60"}`}
                        disabled={!canSelect}
                        onClick={() => handleSelectStep(index)}
                        type="button"
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            isCurrent || isComplete
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="max-w-32 font-medium leading-4">
                          {step}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <Card>
                <CardContent>
                  {activeStep === 0 ? (
                    <div className="grid gap-6">
                      <section id="booking-service" className="py-5">
                        <h2 className="text-lg font-semibold text-primary">
                          Select Appointment
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Pick a service and choose an appointment date and time.
                        </p>
                        <ServiceSelection
                          error={servicesError}
                          isLoading={isLoadingServices}
                          onRetry={() => setServicesReloadKey((key) => key + 1)}
                          onSelectService={handleSelectService}
                          selectedClinic={selectedClinic}
                          selectedService={selectedService}
                          services={services}
                        />
                      </section>

                      {selectedService ? (
                        <section id="booking-date-time">
                          <DateTimeSelection
                            minDate={minDate}
                            onSelectDate={handleSelectDate}
                            onSelectTime={handleSelectTime}
                            selectedClinic={selectedClinic}
                            selectedDate={selectedDate}
                            selectedService={selectedService}
                            selectedTime={selectedTime}
                            startAt={startAt}
                          />
                        </section>
                      ) : null}
                    </div>
                  ) : null}

                  {activeStep === 1 ? (
                    <section id="booking-patient" className="py-5">
                      <h2 className="text-lg font-semibold text-primary">
                        Your Details
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Enter the guest patient profile and contact details.
                      </p>
                      <PatientDetailsForm
                        canEnterDetails={Boolean(
                          selectedClinic && selectedService && startAt,
                        )}
                        details={patientDetailsDraft}
                        onChangeDetails={handleChangePatientDetails}
                      />
                    </section>
                  ) : null}

                  {activeStep === 2 ? (
                    <section id="booking-review" className="py-5">
                      <h2 className="text-lg font-semibold text-primary">
                        Review and Confirm Appointment
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Review the appointment details before confirming.
                      </p>
                      <BookingReview
                        isSubmitting={isSubmittingBooking}
                        onBack={goToPreviousStep}
                        onConfirm={handleConfirmBooking}
                        onEditStep={setActiveStep}
                        patientDetails={patientDetails}
                        selectedDate={selectedDate}
                        selectedClinic={selectedClinic}
                        selectedService={selectedService}
                        selectedTime={selectedTime}
                        startAt={startAt}
                        submissionError={submissionError}
                      />
                    </section>
                  ) : null}

                  {activeStep < bookingSteps.length - 1 ? (
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <Button
                        disabled={activeStep === 0}
                        onClick={goToPreviousStep}
                        type="button"
                        variant="outline"
                      >
                        Back
                      </Button>
                      <Button
                        disabled={
                          activeStep === bookingSteps.length - 1 ||
                          (activeStep === 0 && !isSelectAppointmentComplete) ||
                          (activeStep === 1 && !isYourDetailsComplete)
                        }
                        onClick={goToNextStep}
                        type="button"
                      >
                        Next
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </>
          )}
        </section>
      )}
    </>
  );
}
