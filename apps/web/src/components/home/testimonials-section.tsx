import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { SectionIntro } from "./section-intro";

type Testimonial = {
  name: string;
  initials: string;
  service: string;
  quote: string;
};

const testimonials: Testimonial[] = [
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

export const TestimonialsSection = () => {
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
};
