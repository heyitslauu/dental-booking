import {
  ArrowRight,
  CalendarCheck,
  CircleCheck,
  Facebook,
  HeartPulse,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Music,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

type Icon = LucideIcon;

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Book an Appointment", href: "/book", cta: true },
  { label: "Login", href: "/admin/login" },
];

const services: Array<{
  title: string;
  description: string;
  icon: Icon;
}> = [
  {
    title: "Dental Check-up",
    description: "Routine oral exams to keep your teeth, gums, and smile on track.",
    icon: Stethoscope,
  },
  {
    title: "Oral Prophylaxis",
    description: "Gentle cleaning support for fresher breath and healthier gums.",
    icon: Sparkles,
  },
  {
    title: "Tooth Extraction",
    description: "Careful removal planning with clear guidance before and after care.",
    icon: ShieldCheck,
  },
  {
    title: "Dental Filling",
    description: "Restore damaged teeth with practical treatment options.",
    icon: CircleCheck,
  },
  {
    title: "Teeth Whitening",
    description: "Brightening options for a cleaner, more confident smile.",
    icon: Smile,
  },
  {
    title: "Braces Consultation",
    description: "Discuss alignment goals and next steps with the dental team.",
    icon: HeartPulse,
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    initials: "MS",
    service: "Dental Check-up",
    quote:
      "The booking process was quick and easy. I was able to schedule my visit without calling.",
  },
  {
    name: "Jacob Reyes",
    initials: "JR",
    service: "Oral Prophylaxis",
    quote:
      "The staff were friendly and the clinic felt very clean and comfortable.",
  },
  {
    name: "Ana Cruz",
    initials: "AC",
    service: "Braces Consultation",
    quote: "I liked being able to choose a schedule that worked for me.",
  },
  {
    name: "Nico Tan",
    initials: "NT",
    service: "Dental Filling",
    quote:
      "Everything was clear from clinic selection to confirmation. It felt simple and reassuring.",
  },
];

const footerGroups = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "#services" },
      { label: "About Us", href: "#about" },
      { label: "Book an Appointment", href: "/book" },
      { label: "Login", href: "/admin/login" },
    ],
  },
  {
    title: "Important",
    links: [
      { label: "Terms and Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cancellation Policy", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
];

function linkClass(isCta?: boolean) {
  return isCta
    ? "inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    : "inline-flex h-11 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link className="flex items-center gap-3" to="/" aria-label="Magayon Dental home">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <Smile className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold text-foreground">Magayon Dental</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {navLinks.map((item) =>
            item.href.startsWith("/") ? (
              <Link className={linkClass(item.cta)} key={item.label} to={item.href}>
                {item.label}
              </Link>
            ) : (
              <a className={linkClass(item.cta)} href={item.href} key={item.label}>
                {item.label}
              </a>
            )
          )}
        </nav>

        <button
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen ? (
        <nav
          className="grid gap-2 border-t border-border bg-background px-6 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                className={linkClass(item.cta)}
                key={item.label}
                onClick={() => setIsOpen(false)}
                to={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <a
                className={linkClass(item.cta)}
                href={item.href}
                key={item.label}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            )
          )}
        </nav>
      ) : null}
    </header>
  );
}

function SectionIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-normal text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{children}</p>
    </div>
  );
}

function HeroSection() {
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
          <Link className={linkClass(true)} to="/book">
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
          {[
            ["Guest booking", "No account required"],
            ["Clinic choice", "Pick a branch"],
            ["Quick flow", "Confirm with ease"],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm" key={label}>
              <dt className="text-sm font-semibold text-foreground">{label}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 rounded-lg border border-primary/20 bg-primary p-5 text-primary-foreground shadow-sm shadow-primary/20">
          <p className="text-sm font-semibold">Need a quick appointment?</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-primary-foreground/85">
              Start with clinic, service, and schedule selection in one flow.
            </p>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full bg-background px-4 text-sm font-semibold text-primary transition hover:opacity-90"
              to="/book"
            >
              Book now
            </Link>
          </div>
        </div>
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
}

function ServicesSection() {
  return (
    <section className="bg-background py-16 md:py-20" id="services">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Services"
            title="Dental care options for everyday needs"
          >
            Browse common treatments before starting the booking flow. Service
            availability can vary by clinic.
          </SectionIntro>
        </div>

        <Carousel
          className="mt-8 px-3 sm:px-5"
          opts={{
            align: "start",
            dragFree: false,
            loop: false,
            watchDrag: true,
          }}
          aria-label="Dental services carousel"
        >
          <CarouselContent>
            {services.map((service) => {
              const IconComponent = service.icon;

              return (
                <CarouselItem
                  className="basis-full sm:basis-1/2 lg:basis-1/3"
                  key={service.title}
                >
                  <Card className="h-full rounded-lg shadow-sm">
                    <CardHeader>
                      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <IconComponent className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
                        to="/book"
                      >
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="-left-2 sm:left-0" />
          <CarouselNext className="-right-2 sm:right-0" />
        </Carousel>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="bg-secondary/65" id="about">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[0.95fr_1fr] lg:items-center">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Trusted care",
            description: "Clear service choices and straightforward appointment steps.",
            icon: ShieldCheck,
          },
          {
            title: "Easy online booking",
            description: "A calm clinic experience shaped around comfort and clarity.",
            icon: CalendarCheck,
          },
          {
            title: "Patient-first service",
            description: "Schedule your visit without waiting for a phone call.",
            icon: HeartPulse,
          },
        ].map((item) => {
          const IconComponent = item.icon;

          return (
            <Card className="rounded-lg shadow-sm" key={item.title}>
              <CardHeader>
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <SectionIntro
        eyebrow="About Us"
        title="Clean, friendly dental care with less booking friction"
      >
        Magayon Dental helps patients plan their visit with less friction. The
        clinic experience is designed to feel modern, welcoming, and easy to
        start online, from choosing a branch to confirming an appointment.
      </SectionIntro>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-muted/70 py-16 md:py-20" id="testimonials">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="Testimonials"
            title="Patients appreciate a smoother way to schedule"
          >
            Static sample stories show the kind of experience the booking flow is
            designed to support.
          </SectionIntro>
        </div>

        <Carousel className="mt-8" aria-label="Patient testimonials carousel">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name}>
                <Card className="h-full rounded-lg shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.service}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-1 text-primary" aria-label="5 star rating">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          className="h-4 w-4 fill-current"
                          key={index}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-7 text-muted-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-5 flex justify-end gap-2">
            <CarouselPrevious className="static translate-x-0 translate-y-0" />
            <CarouselNext className="static translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Smile className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-semibold text-foreground">Magayon Dental</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Clean, patient-friendly dental care with simple online appointment
            booking.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
            <ul className="mt-4 grid gap-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      className="text-sm text-muted-foreground hover:text-primary"
                      to={link.href}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      className="text-sm text-muted-foreground hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-sm font-semibold text-foreground">Working Hours</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <li>Monday to Friday: 9:00 AM - 6:00 PM</li>
            <li>Saturday: 9:00 AM - 4:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Contact</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
              123 Smile Avenue, Legazpi City
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
              +63 912 345 6789
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
              hello@magayondental.example
            </li>
          </ul>

          <h2 className="mt-6 text-sm font-semibold text-foreground">Social Media</h2>
          <ul className="mt-4 flex gap-2">
            {[
              { label: "Facebook", icon: Facebook },
              { label: "Email", icon: Mail },
              { label: "Instagram", icon: Instagram },
              { label: "TikTok", icon: Music },
            ].map((item) => {
              const IconComponent = item.icon;

              return (
                <li key={item.label}>
                  <a
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href="#"
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
  );
}

export function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
