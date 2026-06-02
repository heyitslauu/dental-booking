import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { getClinicServices, getClinics } from "../../clinics/api";
import type { Clinic, ClinicService, PatientDetails } from "../types";
import { BookingReview } from "./BookingReview";
import { ClinicChangeWarningDialog } from "./ClinicChangeWarningDialog";
import { ClinicSelectionDialog } from "./ClinicSelectionDialog";
import { DateTimeSelection } from "./DateTimeSelection";
import {
  emptyPatientDetails,
  isPatientDetailsValid,
  normalizePatientDetails,
  PatientDetailsForm
} from "./PatientDetailsForm";
import { ServiceSelection } from "./ServiceSelection";

const bookingSteps = [
  "Select Appointment",
  "Your Details",
  "Review and Confirm Appointment"
];

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartAt(date: string, time: string) {
  if (!date || !time) {
    return null;
  }

  const startAt = new Date(`${date}T${time}:00`);

  if (Number.isNaN(startAt.getTime())) {
    return null;
  }

  return startAt.toISOString();
}

export function BookingFlow() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicsError, setClinicsError] = useState<string | null>(null);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isClinicDialogOpen, setIsClinicDialogOpen] = useState(true);
  const [isClinicChangeWarningOpen, setIsClinicChangeWarningOpen] =
    useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<ClinicService | null>(
    null
  );
  const [services, setServices] = useState<ClinicService[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientDetailsDraft, setPatientDetailsDraft] =
    useState<PatientDetails>(emptyPatientDetails);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [clinicsReloadKey, setClinicsReloadKey] = useState(0);
  const [servicesReloadKey, setServicesReloadKey] = useState(0);
  const minDate = useMemo(() => getTodayDateValue(), []);
  const startAt = useMemo(
    () => getStartAt(selectedDate, selectedTime),
    [selectedDate, selectedTime]
  );
  const isSelectAppointmentComplete = Boolean(
    selectedService && selectedDate && selectedTime && startAt
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

          return nextClinics.find((clinic) => clinic.id === currentClinic.id) ?? null;
        });
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setClinicsError(
          error instanceof Error ? error.message : "Unexpected error."
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

    setSelectedDate(date);
  }

  function handleChangePatientDetails(details: PatientDetails) {
    setPatientDetailsDraft(details);
    setPatientDetails(
      isPatientDetailsValid(details) ? normalizePatientDetails(details) : null
    );
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
    setActiveStep(0);
    setIsClinicChangeWarningOpen(false);
    setIsClinicDialogOpen(true);
  }

  function handleCancelBooking() {
    setSelectedClinic(null);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
    setPatientDetailsDraft(emptyPatientDetails);
    setPatientDetails(null);
    setActiveStep(0);
    setIsClinicDialogOpen(true);
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
          error instanceof Error ? error.message : "Unexpected error."
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
                <p className="mt-2 text-sm font-medium text-foreground">
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

          <Card>
            <CardHeader>
              <ol className="grid gap-3 md:grid-cols-3">
                {bookingSteps.map((step, index) => {
                  const isCurrent = activeStep === index;
                  const isComplete = activeStep > index;

                  return (
                    <li
                      className={`flex items-center gap-3 rounded-md border p-3 text-sm ${
                        isCurrent
                          ? "border-accent bg-accent/15 text-accent-foreground"
                          : isComplete
                            ? "border-primary/30 bg-background text-primary"
                            : "border-border bg-background text-muted-foreground"
                      }`}
                      key={step}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isCurrent || isComplete
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium">{step}</span>
                    </li>
                  );
                })}
              </ol>
            </CardHeader>

            <CardContent>
              {activeStep === 0 ? (
                <div className="grid gap-6">
                  <section id="booking-service">
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
                      onSelectService={setSelectedService}
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
                        onSelectTime={setSelectedTime}
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
                <section id="booking-patient">
                  <h2 className="text-lg font-semibold text-primary">
                    Your Details
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Enter the guest patient profile and contact details.
                  </p>
                  <PatientDetailsForm
                    canEnterDetails={Boolean(
                      selectedClinic && selectedService && startAt
                    )}
                    details={patientDetailsDraft}
                    onChangeDetails={handleChangePatientDetails}
                  />
                </section>
              ) : null}

              {activeStep === 2 ? (
                <section id="booking-review">
                  <h2 className="text-lg font-semibold text-primary">
                    Review and Confirm Appointment
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Review the appointment details before confirming.
                  </p>
                  <BookingReview
                    onBack={goToPreviousStep}
                    onCancel={handleCancelBooking}
                    onEditStep={setActiveStep}
                    patientDetails={patientDetails}
                    selectedDate={selectedDate}
                    selectedClinic={selectedClinic}
                    selectedService={selectedService}
                    selectedTime={selectedTime}
                    startAt={startAt}
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
        </section>
      )}
    </>
  );
}
