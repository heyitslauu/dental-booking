const bookingSteps = [
  {
    title: "Branch selection",
    description: "Clinic choices will load from the branch-aware clinic API."
  },
  {
    title: "Service selection",
    description: "Available services will update after a branch is selected."
  },
  {
    title: "Date/time selection",
    description: "Guests will choose an appointment slot in this step."
  },
  {
    title: "Patient details",
    description: "Guest contact and patient profile fields will live here."
  },
  {
    title: "Review",
    description: "Selected branch, service, time, and patient details appear here."
  },
  {
    title: "Confirmation",
    description: "The final success state will show after appointment creation."
  }
];

export function BookingFlow() {
  return (
    <section className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="text-sm font-medium text-zinc-900">Booking steps</p>
        <ol className="mt-4 space-y-3">
          {bookingSteps.map((step, index) => (
            <li className="flex gap-3 text-sm" key={step.title}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5 text-zinc-700">{step.title}</span>
            </li>
          ))}
        </ol>
      </aside>

      <div className="grid gap-4 md:grid-cols-2">
        {bookingSteps.map((step) => (
          <section
            className="rounded-lg border border-zinc-200 bg-white p-5"
            key={step.title}
          >
            <h2 className="text-lg font-semibold text-zinc-950">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {step.description}
            </p>
            <div className="mt-5 rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
              Placeholder
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
