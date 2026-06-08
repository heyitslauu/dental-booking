import type { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

type DialogProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Dialog({ children, open }: DialogProps) {
  if (!open) {
    return null;
  }

  return children;
}

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <section
        className={cn(
          "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-border bg-background p-6 shadow-lg",
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </section>
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <header className="grid gap-2">{children}</header>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-semibold text-primary">{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-6 flex flex-wrap justify-end gap-3">{children}</footer>
  );
}

export function DialogClose({
  onClose,
  children = "Close",
}: {
  children?: ReactNode;
  onClose: () => void;
}) {
  return (
    <Button onClick={onClose} type="button" variant="outline">
      {children}
    </Button>
  );
}
