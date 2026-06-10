import { CalendarCheck, HeartPulse, ShieldCheck, type LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SectionIntro } from "./section-intro";

type AboutFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const aboutFeatures: AboutFeature[] = [
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
];

export const AboutSection = () => {
  return (
    <section className="bg-secondary/65" id="about">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-2">
          {aboutFeatures.map((item) => {
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
};
