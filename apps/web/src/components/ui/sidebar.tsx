import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "../../lib/utils";

type SidebarContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
};

export const SidebarProvider = ({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"aside">) => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-r border-border bg-card text-card-foreground shadow-xl transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none",
          isOpen && "translate-x-0",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
};

export const SidebarInset = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex min-w-0 flex-1 flex-col", className)} {...props} />
);

export const SidebarTrigger = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) => {
  const { setIsOpen } = useSidebar();

  return (
    <button
      aria-label="Toggle sidebar"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onClick={() => setIsOpen((value) => !value)}
      type="button"
      {...props}
    >
      <Menu className="h-4 w-4" aria-hidden="true" />
    </button>
  );
};

export const SidebarHeader = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("border-b border-border p-4", className)} {...props} />
);

export const SidebarContent = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex-1 overflow-y-auto p-3", className)} {...props} />
);

export const SidebarFooter = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("border-t border-border p-3", className)} {...props} />
);
