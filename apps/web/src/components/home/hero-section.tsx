import { ArrowRight, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickActionCard } from "./quick-action-card";

const heroStats = [
  ["Guest booking", "No account required"],
  ["Clinic choice", "Pick a branch"],
  ["Quick flow", "Confirm with ease"],
];

export const HeroSection = () => {
  return (
    <section className="bg-secondary/70">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_0.95fr] lg:py-16">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            Modern orthodontic care, booked online
          </p>
          <h1 className="mt-5 text-5xl font-bold tracking-normal text-foreground md:text-7xl">
            Comprehensive Dental Care Made Simple
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Choose your clinic, select a service, and book your visit through a
            clean, guest-friendly appointment flow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              to="/book"
            >
              Book an Appointment
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="#services"
            >
              View Services
            </a>
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map(([label, value]) => (
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm" key={label}>
                <dt className="text-sm font-semibold text-foreground">{label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <QuickActionCard />
        </div>

        <div className="relative">
          <div className="absolute -right-4 -top-4 h-36 w-52 rounded-lg bg-accent/20" aria-hidden="true" />
          <div className="absolute -bottom-6 -left-6 h-28 w-44 rounded-lg bg-primary/15" aria-hidden="true" />
          <img
            alt="Modern white and mint dental clinic treatment room"
            className="relative aspect-[4/3] w-full rounded-lg border border-border object-cover shadow-sm"
            src="/images/dental-clinic-hero-mint.png"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Online appointment booking
                </p>
                <p className="text-sm text-muted-foreground">
                  Select your clinic, service, date, and time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
