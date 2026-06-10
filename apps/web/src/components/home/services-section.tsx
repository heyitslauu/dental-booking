import {
  ArrowRight,
  CircleCheck,
  HeartPulse,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SectionIntro } from "./section-intro";

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const services: Service[] = [
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

export const ServicesSection = () => {
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
};
