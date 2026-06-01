import { useEffect, useState } from "react";
import { getClinicServices, getClinics } from "../../clinics/api";
import type { Clinic, ClinicService } from "../types";
import { BranchSelection } from "./BranchSelection";
import { ServiceSelection } from "./ServiceSelection";

const bookingSteps = [
  {
    title: "Branch selection",
    description: "Clinic choices will load from the branch-aware clinic API."
  },
  {
    title: "Service selection",
    description: "Available services will update after a branch is selected."
  },
  {
    title: "Date/time selection",
    description: "Guests will choose an appointment slot in this step."
  },
  {
    title: "Patient details",
    description: "Guest contact and patient profile fields will live here."
  },
  {
    title: "Review",
    description: "Selected branch, service, time, and patient details appear here."
  },
  {
    title: "Confirmation",
    description: "The final success state will show after appointment creation."
  }
];

export function BookingFlow() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicsError, setClinicsError] = useState<string | null>(null);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedService, setSelectedService] = useState<ClinicService | null>(
    null
  );
  const [services, setServices] = useState<ClinicService[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [clinicsReloadKey, setClinicsReloadKey] = useState(0);
  const [servicesReloadKey, setServicesReloadKey] = useState(0);

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
  }, [selectedClinic?.id]);

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
    <section className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="text-sm font-medium text-zinc-900">Booking steps</p>
        <ol className="mt-4 space-y-3">
          {bookingSteps.map((step, index) => (
            <li className="flex gap-3 text-sm" key={step.title}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5 text-zinc-700">{step.title}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-md bg-zinc-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Selected branch
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            {selectedClinic?.name ?? "None yet"}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Selected service
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            {selectedService?.service.name ?? "None yet"}
          </p>
        </div>
      </aside>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 md:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-950">
            Branch selection
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Choose the clinic branch for this appointment.
          </p>
          <BranchSelection
            clinics={clinics}
            error={clinicsError}
            isLoading={isLoadingClinics}
            onRetry={() => setClinicsReloadKey((key) => key + 1)}
            onSelectClinic={setSelectedClinic}
            selectedClinic={selectedClinic}
          />
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 md:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-950">
            Service selection
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Pick a service offered by the selected branch.
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

        {bookingSteps.slice(2).map((step) => (
          <section
            className="rounded-lg border border-zinc-200 bg-white p-5"
            key={step.title}
          >
            <h2 className="text-lg font-semibold text-zinc-950">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {step.description}
            </p>
            <div className="mt-5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
              Placeholder
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
