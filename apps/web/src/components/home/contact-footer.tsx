import { Facebook, Mail, MapPin, Music, Phone, Smile, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

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

const socialLinks = [
  { label: "Facebook", icon: Facebook },
  { label: "Email", icon: Mail },
  { label: "Instagram", icon: Instagram },
  { label: "TikTok", icon: Music },
];

export const ContactFooter = () => {
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
            {socialLinks.map((item) => {
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
};
