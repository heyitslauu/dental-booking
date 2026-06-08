import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const adminNavItems = [
  {
    activePaths: ["/admin/appointment", "/admin/appointments"],
    label: "Appointments",
    to: "/admin/appointments",
  },
  { label: "Clinics", to: "/admin/clinics" },
  { label: "Services", to: "/admin/services" },
  { label: "Staff", to: "/admin/staff" },
];

type AdminLayoutProps = {
  actions?: ReactNode;
  children: ReactNode;
  title: string;
};

export function AdminLayout({ actions, children, title }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8">
        <header className="grid gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
                Back office
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-primary">
                {title}
              </h1>
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
          </div>

          <nav
            aria-label="Admin navigation"
            className="flex flex-wrap gap-2 border-b border-border pb-3"
          >
            {adminNavItems.map((item) => {
              const isActive =
                item.to === location.pathname ||
                item.activePaths?.includes(location.pathname);

              return (
                <Link
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-surface hover:text-primary",
                  )}
                  key={item.to}
                  to={item.to}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}
