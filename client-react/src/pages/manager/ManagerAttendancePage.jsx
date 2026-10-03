import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import {
  dashboardContainer,
  dashboardHeader,
  dashboardHeaderRow,
  panel,
} from "../../components/ui/field";

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};
const cap = (v) => (!v ? "" : v.charAt(0).toUpperCase() + v.slice(1));
const fmtTime = (iso) =>
  !iso
    ? "—"
    : new Date(iso).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
const fmtDate = (iso) =>
  !iso
    ? "—"
    : new Date(iso).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

function hoursBetween(a, b) {
  if (!a || !b) return null;
  const diff = (new Date(b) - new Date(a)) / 3600000;
  return diff > 0 ? diff.toFixed(1) : null;
}

export default function ManagerAttendancePage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useEffectEvent(async (currentDate) => {
    setLoading(true);
    try {
      const res = await apiRequest(
        `/attendance/department?date=${encodeURIComponent(currentDate)}`,
      );
      setRows(res.records || []);
    } catch (err) {
      toast.error(err.message || "Could not load attendance.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    load(date);
  }, [date]);

  const filtered = rows.filter((rec) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const emp = rec.employee || {};
    return (
      (emp.fname || "").toLowerCase().includes(q) ||
      (emp.lname || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className={dashboardContainer}>
      <div className={dashboardHeaderRow}>
        <div>
          <h2 className={dashboardHeader.h2}>Attendance Records</h2>
          <p className={dashboardHeader.p}>
            View daily attendance for employees in your department.
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 max-md:w-full">
          <span className="material-symbols-outlined text-slate-500">
            calendar_today
          </span>
          <input
            type="date"
            className="border-none text-sm font-medium outline-none max-md:flex-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <section className={panel}>
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="material-symbols-outlined text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by employee name..."
            className="flex-1 border-none bg-transparent text-sm outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="event_busy"
            title="No attendance records found for this date."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[800px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {["Employee", "Date", "Clock In", "Clock Out", "Hours"].map(
                    (h) => (
                      <th
                        key={h}
                        className="border-b border-slate-100 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => {
                  const emp = rec.employee || {};
                  const name =
                    `${cap(emp.fname)} ${cap(emp.lname)}`.trim() ||
                    "Unknown Employee";
                  const initials =
                    (emp.fname?.[0] || "") + (emp.lname?.[0] || "");
                  const hours = hoursBetween(rec.clockIn, rec.clockOut);
                  return (
                    <tr key={rec._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold uppercase text-indigo-700">
                            {initials}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800">
                              {name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {cap(emp.position) || "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {fmtDate(rec.date)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {fmtTime(rec.clockIn)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {fmtTime(rec.clockOut)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {hours ? `${hours} hrs` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
