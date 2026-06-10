import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { AdminSidebar } from "./admin-sidebar";

type AdminLayoutProps = {
  actions?: ReactNode;
  children: ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  title: string;
};

export function AdminLayout({
  actions,
  children,
  isRefreshing = false,
  onRefresh,
  title,
}: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <AdminBreadcrumb title={title} />
        </header>

        <main className="flex min-w-0 flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal text-primary">
                {title}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {onRefresh ? (
                <Button
                  aria-label="Refresh page data"
                  className="h-10 w-10 rounded-full px-0"
                  disabled={isRefreshing}
                  onClick={onRefresh}
                  title="Refresh"
                  type="button"
                  variant="outline"
                >
                  <RefreshCw
                    aria-hidden="true"
                    className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                  />
                </Button>
              ) : null}
              {actions}
            </div>
          </div>

          <div className="min-w-0">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
