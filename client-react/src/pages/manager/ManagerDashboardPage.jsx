import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import Spinner from "../../components/ui/Spinner";
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

export default function ManagerDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest("/dashboard/manager");
        if (!cancelled) setData(res);
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

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );

  if (error) {
    return (
      <div className={dashboardContainer}>
        <div>
          <h2 className={dashboardHeader.h2}>Manager Dashboard</h2>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const { department, kpis, attendanceOverview, pendingLeaveRequests } = data;
  const { presentToday, absentToday, clockInRate } = attendanceOverview;

  return (
    <div className={dashboardContainer}>
      <div>
        <h2 className={dashboardHeader.h2}>Manager Dashboard</h2>
        <p className={dashboardHeader.p}>
          Overview of the {department.name} department
        </p>
      </div>

      <section className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] max-md:grid-cols-1">
        <article className={kpiCard}>
          <div className={`${kpiIcon} ${kpiIconColors.blue}`}>
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className={kpiLabel}>Department Staff</p>
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
          Today&apos;s Attendance Overview
        </h3>
        <div className="flex items-center gap-8 max-md:flex-col max-md:items-start max-md:gap-6">
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative flex h-32 w-32 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#6366f1 ${clockInRate}%, #e2e8f0 0)`,
              }}
            >
              <div className="absolute h-[90px] w-[90px] rounded-full bg-white" />
              <span className="relative z-10 text-2xl font-bold text-slate-800">
                {clockInRate}%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Clock-in Rate</p>
          </div>
          <div className="flex flex-1 flex-col gap-4 max-md:w-full">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Present</span>
              <strong className="ml-auto text-base text-slate-800">
                {presentToday}
              </strong>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span>Absent</span>
              <strong className="ml-auto text-base text-slate-800">
                {absentToday}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
