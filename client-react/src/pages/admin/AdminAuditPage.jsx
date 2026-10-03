import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  btnSecondary,
  dashboardContainer,
  dashboardHeader,
  inputClass,
  panel,
} from "../../components/ui/field";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "employee", label: "Employee" },
  { value: "department", label: "Department" },
  { value: "leave", label: "Leave" },
  { value: "attendance", label: "Attendance" },
  { value: "auth", label: "Auth" },
  { value: "system", label: "System" },
];

const fmt = (s) =>
  new Date(s).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadLogs = useEffectEvent(async (currentPage, currentCategory) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (currentCategory) params.set("category", currentCategory);
      const res = await apiRequest(`/audit?${params}`);
      setLogs(res.logs || []);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || "Could not load audit log.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    loadLogs(page, category);
  }, [page, category, refreshKey]);

  function changeCategory(value) {
    setCategory(value);
    setPage(1);
  }

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className={dashboardContainer}>
      <div>
        <h2 className={dashboardHeader.h2}>System Audit &amp; Logs</h2>
        <p className={dashboardHeader.p}>
          Chronological record of every meaningful action in WorkForce
        </p>
      </div>

      <section className={panel}>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cat-filter"
              className="text-[11px] font-semibold uppercase text-slate-500"
            >
              Category
            </label>
            <select
              id="cat-filter"
              className={`${inputClass} min-w-[160px]`}
              value={category}
              onChange={(e) => changeCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
            onClick={refresh}
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <EmptyState icon="history" title="No audit entries found." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[600px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {["Event", "Category", "Performed By", "When"].map((h) => (
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
                {logs.map((log) => {
                  const performer = log.performedBy
                    ? `${log.performedBy.fname ?? ""} ${log.performedBy.lname ?? ""}`.trim()
                    : "System";
                  return (
                    <tr key={log._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {log.description}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm capitalize text-slate-900">
                        {log.category}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {performer || "System"}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {fmt(log.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              className={btnSecondary}
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className={btnSecondary}
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
