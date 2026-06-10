import { Link } from "react-router-dom";
import { BookingFlow } from "../features/booking/components/BookingFlow";

export function BookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-primary/70 to-primary/10 text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:py-12">
        <header className="max-w-3xl">
          <Link
            className="inline-flex rounded-md border border-primary-foreground/25 bg-card/95 px-3 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-card"
            to="/"
          >
            Back to homepage
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-primary-foreground md:text-4xl">
            Your brighter smile starts here
          </h1>
          <p className="mt-3 text-base leading-7 text-primary-foreground/85">
            Pick your preferred clinic, choose a treatment time, and share your
            details in a quick guided flow.
          </p>
        </header>

        <BookingFlow />
      </div>
    </main>
  );
}
