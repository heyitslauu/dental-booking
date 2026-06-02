import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/ui/card";
import type { Clinic } from "../types";

type ClinicSelectionDialogProps = {
  clinics: Clinic[];
  error: string | null;
  isLoading: boolean;
  open: boolean;
  selectedClinic: Clinic | null;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
  onSelectClinic: (clinic: Clinic) => void;
};

export function ClinicSelectionDialog({
  clinics,
  error,
  isLoading,
  open,
  selectedClinic,
  onOpenChange,
  onRetry,
  onSelectClinic
}: ClinicSelectionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Which clinic do you want to book an appointment?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Choose the clinic branch for this dental appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isLoading ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3].map((item) => (
              <div
                className="h-36 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100"
                key={item}
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">
              Clinics could not be loaded.
            </p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <Button className="mt-4" onClick={onRetry} type="button">
              Try again
            </Button>
          </div>
        ) : null}

        {!isLoading && !error && clinics.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
            No active clinics are available yet.
          </div>
        ) : null}

        {!isLoading && !error && clinics.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {clinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;

              return (
                <button
                  aria-pressed={isSelected}
                  className="rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  key={clinic.id}
                  onClick={() => onSelectClinic(clinic)}
                  type="button"
                >
                  <Card
                    className={`h-full transition ${
                      isSelected
                        ? "border-teal-700 ring-2 ring-teal-700/20"
                        : "hover:border-teal-400"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle>{clinic.name}</CardTitle>
                      <CardDescription>
                        {clinic.address ?? "Address to be confirmed"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-600">
                        {clinic.phone ?? "Contact number to be confirmed"}
                      </p>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
