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
          Branches could not be loaded.
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

  if (clinics.length === 0) {
    return (
      <div className="mt-5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
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
                ? "border-teal-700 bg-teal-50 ring-2 ring-teal-700/20"
                : "border-zinc-200 bg-white hover:border-teal-400"
            }`}
            key={clinic.id}
            onClick={() => onSelectClinic(clinic)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-zinc-950">{clinic.name}</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  {clinic.address ?? "Address to be confirmed"}
                </p>
                {clinic.phone ? (
                  <p className="mt-2 text-sm text-zinc-500">{clinic.phone}</p>
                ) : null}
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
