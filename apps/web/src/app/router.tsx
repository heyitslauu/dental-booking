import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ProtectedAdminRoute } from "../components/admin/ProtectedAdminRoute";
import { AdminAppointmentsPage } from "../pages/AdminAppointmentsPage";
import { AdminClinicsPage } from "../pages/AdminClinicsPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { AdminServicesPage } from "../pages/AdminServicesPage";
import { AdminStaffPage } from "../pages/AdminStaffPage";
import { BookingConfirmationPage } from "../pages/BookingConfirmationPage";
import { BookingPage } from "../pages/BookingPage";

function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Dental Booking
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-primary">
          Branch-aware booking foundation
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The frontend shell is ready. Backend APIs now own clinics, services,
          staff, patients, and appointments.
        </p>
        <Link
          className="mt-8 inline-flex w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:brightness-95"
          to="/book"
        >
          Start booking
        </Link>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="max-w-md">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Page not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-primary">
          This page is not ready.
        </h1>
        <Link
          className="mt-6 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:brightness-95"
          to="/book"
        >
          Go to booking
        </Link>
      </section>
    </main>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<AdminLoginPage />} path="/admin/login" />
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminAppointmentsPage />
            </ProtectedAdminRoute>
          }
          path="/admin/appointment"
        />
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminAppointmentsPage />
            </ProtectedAdminRoute>
          }
          path="/admin/appointments"
        />
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminClinicsPage />
            </ProtectedAdminRoute>
          }
          path="/admin/clinics"
        />
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminServicesPage />
            </ProtectedAdminRoute>
          }
          path="/admin/services"
        />
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminStaffPage />
            </ProtectedAdminRoute>
          }
          path="/admin/staff"
        />
        <Route element={<BookingPage />} path="/book" />
        <Route element={<BookingConfirmationPage />} path="/booking" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
