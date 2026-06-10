import {
  CalendarDays,
  ClipboardList,
  Smile,
  Stethoscope,
  Users,
} from "lucide-react";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const overviewCards = [
  {
    icon: CalendarDays,
    label: "Appointments",
    value: "Today",
    description: "Review upcoming patient visits and recent status changes.",
  },
  {
    icon: Smile,
    label: "Clinics",
    value: "Branches",
    description: "Track clinic locations and operational availability.",
  },
  {
    icon: Users,
    label: "Staff",
    value: "Team",
    description: "Monitor clinic staff coverage and assignments.",
  },
  {
    icon: Stethoscope,
    label: "Services",
    value: "Catalog",
    description: "Keep service pricing, duration, and availability aligned.",
  },
];

const activityItems = [
  "Appointments dashboard metrics will appear here.",
  "Clinic utilization summaries will appear here.",
  "Staff assignment insights will appear here.",
];

export function AdminDashboardPage() {
  return (
    <AdminLayout
      description="View a quick operational snapshot for appointments, clinics, staff, and services."
      title="Dashboard"
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((item) => {
            const IconComponent = item.icon;

            return (
              <Card key={item.label}>
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardDescription>{item.label}</CardDescription>
                    <CardTitle className="mt-2">{item.value}</CardTitle>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconComponent aria-hidden="true" className="h-5 w-5" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Placeholder dashboard content for the admin workspace.
                  </CardDescription>
                </div>
                <Badge variant="muted">Preview</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid min-h-72 place-items-center rounded-md border border-dashed border-border bg-surface p-6 text-center">
                <div className="max-w-sm">
                  <ClipboardList
                    aria-hidden="true"
                    className="mx-auto h-10 w-10 text-primary"
                  />
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Dashboard charts and live operational metrics can be added here.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This page is ready for appointment volume, branch performance,
                    and staff utilization widgets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Widgets</CardTitle>
              <CardDescription>
                Suggested dashboard sections for the next iteration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {activityItems.map((item) => (
                  <li
                    className="rounded-md border border-border bg-background p-3 text-sm leading-6 text-muted-foreground"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}
