import { Link } from "react-router-dom";

export default function MarketingLandingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
        WorkForce
      </p>
      <h1 className="mb-5 text-5xl leading-tight text-slate-900 max-md:text-3xl">
        Intelligent roster, shifts, and compliance orchestration.
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-base text-slate-500">
        Empowering growing enterprises to streamline attendance, simplify
        department assignments, and maintain auditable payroll workflows.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
      >
        Sign in to your workspace
      </Link>
    </div>
  );
}
