import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../features/admin/auth";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AdminBreadcrumb } from "./admin-breadcrumb";
import { AdminSidebar } from "./admin-sidebar";

type AdminLayoutProps = {
  actions?: ReactNode;
  children: ReactNode;
  title: string;
};

export function AdminLayout({ actions, children, title }: AdminLayoutProps) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminToken();
    navigate("/login", { replace: true });
  }

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
              {actions}
              <Button onClick={handleLogout} type="button" variant="outline">
                Logout
              </Button>
            </div>
          </div>

          <div className="min-w-0">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
