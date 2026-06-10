import { Menu, Smile, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Book an Appointment", href: "/book", cta: true },
  { label: "Login", href: "/login" },
];

const linkClass = (isCta?: boolean) => {
  return isCta
    ? "inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    : "inline-flex h-11 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
};

export const HomeHeader = () => {
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
};
