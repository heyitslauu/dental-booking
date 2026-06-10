import { Link } from "react-router-dom";

export const QuickActionCard = () => {
  return (
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
  );
};
