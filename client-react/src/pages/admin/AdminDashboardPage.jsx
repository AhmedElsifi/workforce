import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  dashboardContainer,
  dashboardHeader,
  kpiCard,
  kpiIcon,
  kpiIconColors,
  kpiLabel,
  kpiValue,
  panel,
} from "../../components/ui/field";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const ranges = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, s] of ranges) {
    const v = Math.floor(seconds / s);
    if (v >= 1) return `${v} ${label}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest("/dashboard/admin");
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );

  if (error) {
    return (
      <div className={dashboardContainer}>
        <div className="mb-2">
          <h2 className={dashboardHeader.h2}>Admin Dashboard</h2>
          <p className={dashboardHeader.p}>
            A real-time snapshot of your organization
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const { kpis, departmentDistribution, recentActivity, pendingLeaveRequests } =
    data;
  const maxCount = Math.max(
    ...departmentDistribution.map((d) => d.employeeCount),
    1,
  );

  return (
    <div className={dashboardContainer}>
      <div className="mb-2">
        <h2 className={dashboardHeader.h2}>Admin Dashboard</h2>
        <p className={dashboardHeader.p}>
          A real-time snapshot of your organization
        </p>
      </div>

      <section className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] max-md:grid-cols-1">
        <article className={kpiCard}>
          <div className={`${kpiIcon} ${kpiIconColors.blue}`}>
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className={kpiLabel}>Total Employees</p>
            <h3 className={kpiValue}>{kpis.totalEmployees}</h3>
          </div>
        </article>
        <article className={kpiCard}>
          <div className={`${kpiIcon} ${kpiIconColors.green}`}>
            <span className="material-symbols-outlined text-2xl">
              check_circle
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className={kpiLabel}>Active</p>
            <h3 className={kpiValue}>{kpis.activeEmployees}</h3>
          </div>
        </article>
        <article className={kpiCard}>
          <div className={`${kpiIcon} ${kpiIconColors.red}`}>
            <span className="material-symbols-outlined text-2xl">cancel</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className={kpiLabel}>Inactive</p>
            <h3 className={kpiValue}>{kpis.inactiveEmployees}</h3>
          </div>
        </article>
        <article className={kpiCard}>
          <div className={`${kpiIcon} ${kpiIconColors.amber}`}>
            <span className="material-symbols-outlined text-2xl">
              pending_actions
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className={kpiLabel}>Pending Leave Requests</p>
            <h3 className={kpiValue}>{pendingLeaveRequests}</h3>
          </div>
        </article>
      </section>

      <section className={panel}>
        <h3 className="mb-5 text-base font-semibold text-slate-800">
          Department Distribution
        </h3>
        {departmentDistribution.length === 0 ? (
          <EmptyState
            icon="domain_disabled"
            title="No departments yet."
            description="Create a department to see distribution."
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {departmentDistribution.map((dept) => (
              <li
                key={dept._id}
                className="grid grid-cols-[200px_1fr_40px] items-center gap-4 text-sm max-md:grid-cols-[120px_1fr_32px] max-md:gap-2.5"
              >
                <span className="truncate font-medium text-slate-600">
                  {dept.name}
                </span>
                <span className="block h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-indigo-500 transition-[width] duration-300"
                    style={{
                      width: `${(dept.employeeCount / maxCount) * 100}%`,
                    }}
                  />
                </span>
                <span className="text-right text-sm font-semibold text-slate-800">
                  {dept.employeeCount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={panel}>
        <h3 className="mb-5 text-base font-semibold text-slate-800">
          Recent Activity
        </h3>
        {recentActivity.length === 0 ? (
          <EmptyState icon="history" title="No recent activity yet." />
        ) : (
          <ul className="flex flex-col gap-4">
            {recentActivity.map((entry) => (
              <li
                key={entry._id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <span className="material-symbols-outlined text-base">
                    history
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm leading-snug text-slate-800">
                    {entry.description}
                  </span>
                  <span className="text-xs text-slate-400">
                    {timeAgo(entry.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
