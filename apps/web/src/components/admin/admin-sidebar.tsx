import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
  UserCog,
  Smile,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAdminToken, getAdminUser } from "../../features/admin/auth";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  {
    activePaths: ["/admin/appointment", "/admin/appointments"],
    icon: CalendarDays,
    label: "Appointments",
    to: "/admin/appointments",
  },
  { icon: Smile, label: "Clinics", to: "/admin/clinics" },
  { icon: Stethoscope, label: "Services", to: "/admin/services" },
  { icon: Users, label: "Staff", to: "/admin/staff" },
  { icon: UserCog, label: "Users", to: "/admin/users" },
];

export const getAdminNavTitle = (pathname: string) => {
  const item = adminNavItems.find(
    (navItem) =>
      navItem.to === pathname || navItem.activePaths?.includes(pathname),
  );

  return item?.label ?? "Admin";
};

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminUser = getAdminUser();
  const displayName = getDisplayName(
    adminUser?.firstName,
    adminUser?.lastName,
    adminUser?.email,
  );

  function handleLogout() {
    clearAdminToken();
    navigate("/login", { replace: true });
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link className="flex items-center gap-3" to="/admin/appointments">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Dental Admin</p>
            <p className="text-xs text-muted-foreground">Back office</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <nav className="grid gap-1" aria-label="Admin navigation">
          {adminNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              item.to === location.pathname ||
              item.activePaths?.includes(location.pathname);

            return (
              <Link
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                key={item.to}
                to={item.to}
              >
                <IconComponent className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="grid gap-3">
        <div className="grid gap-1 rounded-md bg-muted/50 p-3">
          <p className="truncate text-sm font-medium text-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {adminUser?.email ?? "Signed in"}
          </p>
        </div>
        <Button
          className="w-full justify-start"
          onClick={handleLogout}
          type="button"
          variant="outline"
        >
          <LogOut aria-hidden="true" className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  email?: string,
) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName;
  }

  return email?.split("@")[0] ?? "Admin user";
}
