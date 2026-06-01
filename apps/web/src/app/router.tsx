import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { BookingPage } from "../pages/BookingPage";

function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Dental Booking
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          Branch-aware booking foundation
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          The frontend shell is ready. Backend APIs now own clinics, services,
          staff, patients, and appointments.
        </p>
        <Link
          className="mt-8 inline-flex w-fit rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <section className="max-w-md">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Page not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold">This page is not ready.</h1>
        <Link
          className="mt-6 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
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
        <Route element={<BookingPage />} path="/book" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
