import { Link } from "react-router-dom";
import { BookingFlow } from "../features/booking/components/BookingFlow";

export function BookingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:py-12">
        <header className="max-w-3xl">
          <Link className="text-sm font-medium text-primary" to="/">
            Dental Booking
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-primary md:text-4xl">
            Book an appointment
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Choose a branch, service, schedule, and patient details. This shell
            is ready for the guest booking flow.
          </p>
        </header>

        <BookingFlow />
      </div>
    </main>
  );
}
