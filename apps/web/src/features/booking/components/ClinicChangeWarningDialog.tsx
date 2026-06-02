import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";

type ClinicChangeWarningDialogProps = {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
};

export function ClinicChangeWarningDialog({
  open,
  onCancel,
  onContinue
}: ClinicChangeWarningDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Change clinic?</AlertDialogTitle>
          <AlertDialogDescription>
            If you change a clinic, the form will be cleared up. Are you sure
            you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="outline">
            Keep Current Clinic
          </Button>
          <Button onClick={onContinue} type="button">
            Change Clinic
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
