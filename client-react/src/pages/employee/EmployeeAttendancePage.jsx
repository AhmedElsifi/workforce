import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import {
  badge,
  btnPrimary,
  dashboardContainer,
  dashboardHeader,
  panel,
} from "../../components/ui/field";

const TZ = "Africa/Cairo";
const DASH = "—";

const todayWorkDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

function fmtDate(workDate, opts) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(workDate ?? "");
  if (!m) return DASH;
  return new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
  ).toLocaleDateString("en-US", opts);
}

function fmtTime(iso) {
  if (!iso) return DASH;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return DASH;
  return d.toLocaleTimeString("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EmployeeAttendancePage() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/attendance/history");
      setRecords(Array.isArray(res.attendance) ? res.attendance : []);
    } catch (err) {
      toast.error(err.message || "Could not load attendance history.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    load();
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  const today = todayWorkDate();
  const todayRecord = records.find((r) => r.workDate === today);
  const hasCheckedIn = Boolean(todayRecord);
  const hasCheckedOut = Boolean(todayRecord?.checkOut);

  async function doCheck(action) {
    setSubmitting(action);
    try {
      const res = await apiRequest(
        action === "in" ? "/attendance/check-in" : "/attendance/check-out",
        { method: "POST" },
      );
      toast.success(res?.message || "Attendance recorded.");
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not record attendance.");
      if (err.status === 409) refresh();
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className={dashboardContainer}>
      <div>
        <h2 className={dashboardHeader.h2}>My Attendance</h2>
        <p className={dashboardHeader.p}>
          Record today&apos;s attendance and review your history.
        </p>
      </div>

      <section className={`${panel} !p-6`}>
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <h3 className="mb-1 text-base font-bold text-slate-800">
              Today&apos;s Attendance
            </h3>
            <p className="mb-3.5 text-sm text-slate-500">
              {fmtDate(today, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-6">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Check in
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {fmtTime(todayRecord?.checkIn)}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Check out
                </span>
                <span className="text-base font-semibold text-slate-800">
                  {fmtTime(todayRecord?.checkOut)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {!hasCheckedIn && (
              <button
                className={btnPrimary}
                onClick={() => doCheck("in")}
                disabled={submitting !== null}
              >
                <span className="material-symbols-outlined">login</span>
                {submitting === "in" ? "Checking in..." : "Check In"}
              </button>
            )}
            {hasCheckedIn && !hasCheckedOut && (
              <button
                className={btnPrimary}
                onClick={() => doCheck("out")}
                disabled={submitting !== null}
              >
                <span className="material-symbols-outlined">logout</span>
                {submitting === "out" ? "Checking out..." : "Check Out"}
              </button>
            )}
            {hasCheckedOut && (
              <p className="text-xs text-slate-400">
                Today&apos;s attendance is complete.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={panel}>
        <h3 className="mb-5 text-base font-semibold text-slate-800">
          Attendance History
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            icon="event_busy"
            title="No attendance records yet"
            description="Once you record your first check-in, your attendance days will be listed here."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[500px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {["Date", "Check In", "Check Out", "Status"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-slate-100 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {fmtDate(rec.workDate, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {fmtTime(rec.checkIn)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {fmtTime(rec.checkOut)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                      <span
                        className={badge(rec.checkOut ? "active" : "pending")}
                      >
                        {rec.checkOut ? "Completed" : "Open"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
