import { Label } from "../../../components/ui/label";
import type { Clinic, ClinicService } from "../types";

type ServiceSelectionProps = {
  error: string | null;
  isLoading: boolean;
  selectedClinic: Clinic | null;
  selectedService: ClinicService | null;
  services: ClinicService[];
  onRetry: () => void;
  onSelectService: (service: ClinicService | null) => void;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency",
  }).format(priceCents / 100);
}

export function ServiceSelection({
  error,
  isLoading,
  selectedClinic,
  selectedService,
  services,
  onRetry,
  onSelectService,
}: ServiceSelectionProps) {
  if (!selectedClinic) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
        Select a branch first to see its available services.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-5 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            className="h-24 animate-pulse rounded-md border border-border bg-surface"
            key={item}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-4">
        <p className="text-sm font-medium text-destructive">
          Services could not be loaded.
        </p>
        <p className="mt-1 text-sm text-destructive">{error}</p>
        <button
          className="mt-4 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
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
      <div className="mt-5 rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
        No services are available for {selectedClinic.name} yet.
      </div>
    );
  }

  const selectedServiceDetails = selectedService?.service;

  return (
    <div className="mt-5 grid gap-3">
      <Label className="grid gap-2" htmlFor="booking-service-select">
        Service
        <select
          className="h-10 rounded-md border border-border bg-background px-3 text-sm font-normal text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          id="booking-service-select"
          onChange={(event) => {
            const nextService =
              services.find((service) => service.id === event.target.value) ??
              null;

            onSelectService(nextService);
          }}
          value={selectedService?.id ?? ""}
        >
          <option value="">Select a service</option>
          {services.map((clinicService) => (
            <option key={clinicService.id} value={clinicService.id}>
              {clinicService.service.name}
            </option>
          ))}
        </select>
      </Label>

      {selectedServiceDetails ? (
        <div className="rounded-md border border-accent/40 bg-accent/10 p-4">
          <p className="text-sm font-medium text-primary">
            {selectedServiceDetails.name}
          </p>
          {selectedServiceDetails.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedServiceDetails.description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
