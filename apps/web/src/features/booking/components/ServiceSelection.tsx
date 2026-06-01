import type { Clinic, ClinicService } from "../types";

type ServiceSelectionProps = {
  error: string | null;
  isLoading: boolean;
  selectedClinic: Clinic | null;
  selectedService: ClinicService | null;
  services: ClinicService[];
  onRetry: () => void;
  onSelectService: (service: ClinicService) => void;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(priceCents / 100);
}

export function ServiceSelection({
  error,
  isLoading,
  selectedClinic,
  selectedService,
  services,
  onRetry,
  onSelectService
}: ServiceSelectionProps) {
  if (!selectedClinic) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
        Select a branch first to see its available services.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-5 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            className="h-24 animate-pulse rounded-md border border-zinc-200 bg-zinc-100"
            key={item}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-900">
          Services could not be loaded.
        </p>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <button
          className="mt-4 rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
        No services are available for {selectedClinic.name} yet.
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      {services.map((clinicService) => {
        const isSelected = selectedService?.id === clinicService.id;
        const service = clinicService.service;

        return (
          <button
            aria-pressed={isSelected}
            className={`rounded-md border p-4 text-left transition ${
              isSelected
                ? "border-teal-700 bg-teal-50 ring-2 ring-teal-700/20"
                : "border-zinc-200 bg-white hover:border-teal-400"
            }`}
            key={clinicService.id}
            onClick={() => onSelectService(clinicService)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-zinc-950">{service.name}</h3>
                {service.description ? (
                  <p className="mt-1 text-sm text-zinc-600">
                    {service.description}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-zinc-500">
                  {service.durationMinutes} min
                  {Number.isFinite(service.priceCents)
                    ? ` · ${formatPrice(service.priceCents)}`
                    : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  isSelected
                    ? "bg-teal-700 text-white"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {isSelected ? "Selected" : "Select"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
