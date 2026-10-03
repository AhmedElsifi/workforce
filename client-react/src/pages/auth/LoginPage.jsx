import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { inputClass } from "../../components/ui/field";

const ROLE_HOME = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  employee: "/employee/dashboard",
};

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate(ROLE_HOME[user.role] || "/", { replace: true });
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login(email, password);
      navigate(ROLE_HOME[data?.user?.role] || "/", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen max-md:flex-col">
      <div className="flex w-1/2 flex-col items-center justify-between bg-slate-900 p-12 text-white max-md:w-full max-md:px-6 max-md:py-10 max-md:min-h-0">
        <div className="flex items-center gap-3 text-xl font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-600">
            <span className="material-symbols-outlined">groups</span>
          </div>
          WorkForce
        </div>

        <div className="my-auto max-w-[540px] max-md:my-10">
          <p className="mb-6 inline-block rounded-full border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
            Real-Time SME Operations Platform
          </p>
          <h1 className="mb-5 text-[2.5rem] leading-tight tracking-tight text-slate-50 max-md:text-3xl">
            Intelligent roster, shifts, and compliance orchestration.
          </h1>
          <p className="text-[1.05rem] leading-relaxed text-slate-400">
            Empowering growing enterprises to streamline attendance, simplify
            department assignments, and maintain auditable payroll workflows
            with zero friction.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} WorkForce Technologies Inc.
        </div>
      </div>

      <div className="flex w-1/2 flex-col items-center justify-center bg-white p-12 max-md:w-full max-md:px-6 max-md:py-14">
        <div className="w-full max-w-[420px]">
          <h1 className="mb-2 text-3xl tracking-tight text-slate-900">
            Welcome back
          </h1>
          <h3 className="mb-8 text-base font-normal text-slate-500">
            Enter your organization credentials to access your workspace.
          </h3>

          {error && (
            <p className="mb-5 rounded-lg border border-red-200 border-l-4 border-l-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2.5 w-full rounded-lg bg-indigo-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
