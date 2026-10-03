import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../auth/useAuth";
import { dashboardContainer, dashboardHeader } from "../../components/ui/field";

const title = (v) =>
  !v
    ? ""
    : v
        .trim()
        .split(/\s+/)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");

const cardIcons = {
  total: "bg-indigo-50 text-indigo-600",
  completed: "bg-emerald-100 text-emerald-800",
  open: "bg-amber-100 text-amber-800",
};

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest("/employee/dashboard");
        if (cancelled) return;
        setStats(
          res?.statistics ?? {
            totalAttendanceDays: 0,
            completedAttendanceDays: 0,
            openAttendanceDays: 0,
          },
        );
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fullName = user
    ? `${title(user.fname)} ${title(user.lname)}`.trim()
    : "Employee";

  const cards = [
    {
      key: "total",
      icon: "calendar_month",
      label: "Total Attendance Days",
      value: stats?.totalAttendanceDays ?? 0,
      hint: "Days with a recorded check-in",
    },
    {
      key: "completed",
      icon: "task_alt",
      label: "Completed Attendance Days",
      value: stats?.completedAttendanceDays ?? 0,
      hint: "Checked in and checked out",
    },
    {
      key: "open",
      icon: "pending_actions",
      label: "Open Attendance Days",
      value: stats?.openAttendanceDays ?? 0,
      hint: "Awaiting a check-out",
    },
  ];

  return (
    <div className={dashboardContainer}>
      <div>
        <h2 className={dashboardHeader.h2}>Employee Dashboard</h2>
        <p className={dashboardHeader.p}>Welcome back, {fullName}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-md:grid-cols-1">
          {cards.map((c) => (
            <article
              key={c.key}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${cardIcons[c.key]}`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {c.icon}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {c.label}
                </h3>
                <p className="my-1.5 text-3xl font-bold leading-none text-slate-800 max-md:text-2xl">
                  {c.value}
                </p>
                <p className="text-xs text-slate-400">{c.hint}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
