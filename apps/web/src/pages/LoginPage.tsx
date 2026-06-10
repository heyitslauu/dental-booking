import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  CalendarCheck,
  Facebook,
  Instagram,
  Mail,
  Music,
  ShieldCheck,
  Smile,
  Stethoscope,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  isAdminAuthenticated,
  loginAdmin,
} from "../features/admin/auth";

type LoginLocationState = {
  from?: string;
};

const heroFeatures = [
  {
    title: "Book appointments faster",
    description: "Keep patient visits moving with a simple guided flow.",
    icon: CalendarCheck,
  },
  {
    title: "Track clinic activity",
    description: "Review appointment details and clinic schedules with less friction.",
    icon: Stethoscope,
  },
  {
    title: "Secure dashboard access",
    description: "Sign in to manage back-office dental booking tools.",
    icon: ShieldCheck,
  },
];

const footerSocialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Email", icon: Mail, href: "mailto:hello@dentalbooking.example" },
  { label: "TikTok", icon: Music, href: "#" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: () => {
      navigate(state?.from || "/admin/appointments", { replace: true });
    },
  });

  if (isAdminAuthenticated()) {
    return <Navigate replace to={state?.from || "/admin/appointments"} />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link className="flex items-center gap-3" to="/" aria-label="Magayon Dental home">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Smile className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold text-foreground">Magayon Dental</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Login page navigation">
            <Link
              className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:inline-flex"
              to="/"
            >
              Home
            </Link>
            <a
              className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground md:inline-flex"
              href="/#services"
            >
              Services
            </a>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-95"
              to="/book"
            >
              Book an Appointment
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-background via-secondary/60 to-primary/10">
        <div className="mx-auto grid min-h-[calc(100vh-13rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] lg:items-stretch">
          <aside className="overflow-hidden rounded-lg border border-primary/15 bg-primary p-5 text-primary-foreground shadow-lg sm:p-6 lg:p-8">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/75">
                  Dental booking
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">
                  A calmer way to manage clinic visits
                </h1>
                <p className="mt-4 text-sm leading-7 text-primary-foreground/85">
                  Keep booking, appointment review, and clinic dashboard tasks in
                  one clean workspace shaped for dental care teams.
                </p>
              </div>

              <div className="grid gap-3">
                {heroFeatures.map((feature) => {
                  const IconComponent = feature.icon;

                  return (
                    <div
                      className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 p-4"
                      key={feature.title}
                    >
                      <div className="flex gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
                          <IconComponent className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h2 className="text-sm font-semibold">{feature.title}</h2>
                          <p className="mt-1 text-sm leading-6 text-primary-foreground/80">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="flex items-center">
            <Card className="w-full border-border bg-card text-card-foreground shadow-lg">
              <CardHeader className="gap-2 p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Welcome back
                </p>
                <CardTitle className="text-3xl tracking-normal text-foreground md:text-4xl">
                  Sign in to your account
                </CardTitle>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  Sign in to manage your appointments and clinic dashboard.
                </p>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <Label className="grid gap-2">
                    <span>Email</span>
                    <Input
                      autoComplete="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                    />
                  </Label>
                  <Label className="grid gap-2">
                    <span>Password</span>
                    <Input
                      autoComplete="current-password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                    />
                  </Label>

                  {loginMutation.error ? (
                    <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                      {loginMutation.error instanceof Error
                        ? loginMutation.error.message
                        : "Unable to sign in."}
                    </p>
                  ) : null}

                  <Button disabled={loginMutation.isPending} type="submit">
                    {loginMutation.isPending ? "Signing in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>

      <footer className="border-t border-border bg-card text-card-foreground">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Smile className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-semibold">Dental Booking</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Copyright 2026 Dental Booking. All rights reserved.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Contact</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <li>hello@dentalbooking.example</li>
              <li>+63 900 000 0000</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Important</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <a className="text-sm text-muted-foreground hover:text-primary" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-muted-foreground hover:text-primary" href="#">
                Terms and Conditions
              </a>
            </div>
            <ul className="mt-4 flex gap-2">
              {footerSocialLinks.map((item) => {
                const IconComponent = item.icon;

                return (
                  <li key={item.label}>
                    <a
                      aria-label={item.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href={item.href}
                    >
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
