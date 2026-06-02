import type { Clinic } from "../types";

type BranchSelectionProps = {
  clinics: Clinic[];
  error: string | null;
  isLoading: boolean;
  selectedClinic: Clinic | null;
  onRetry: () => void;
  onSelectClinic: (clinic: Clinic) => void;
};

export function BranchSelection({
  clinics,
  error,
  isLoading,
  selectedClinic,
  onRetry,
  onSelectClinic
}: BranchSelectionProps) {
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
          Branches could not be loaded.
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

  if (clinics.length === 0) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
        No active branches are available yet.
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      {clinics.map((clinic) => {
        const isSelected = selectedClinic?.id === clinic.id;

        return (
          <button
            aria-pressed={isSelected}
            className={`rounded-md border p-4 text-left transition ${
              isSelected
                ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                : "border-border bg-background hover:border-primary"
            }`}
            key={clinic.id}
            onClick={() => onSelectClinic(clinic)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-primary">{clinic.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {clinic.address ?? "Address to be confirmed"}
                </p>
                {clinic.phone ? (
                  <p className="mt-2 text-sm text-muted-foreground">{clinic.phone}</p>
                ) : null}
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface text-muted-foreground"
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
