import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Dental Booking
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          Branch-aware booking foundation
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          The frontend shell is ready. Backend APIs now own clinics, services,
          staff, patients, and appointments.
        </p>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
