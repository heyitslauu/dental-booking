import { AboutSection } from "../components/home/about-section";
import { ContactFooter } from "../components/home/contact-footer";
import { HeroSection } from "../components/home/hero-section";
import { HomeHeader } from "../components/home/home-header";
import { ServicesSection } from "../components/home/services-section";
import { TestimonialsSection } from "../components/home/testimonials-section";

export const HomePage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHeader />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactFooter />
    </main>
  );
};
