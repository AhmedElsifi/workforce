import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useModal } from "../../components/ui/ModalProvider";
import { useToast } from "../../components/ui/ToastProvider";
import {
  badge,
  dashboardContainer,
  dashboardHeader,
  dashboardHeaderRow,
  panel,
} from "../../components/ui/field";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const cap = (v) => (!v ? "" : v.charAt(0).toUpperCase() + v.slice(1));
const money = (s) =>
  typeof s === "number" ? `$${s.toLocaleString("en-US")}` : "—";

export default function ManagerEmployeesPage() {
  const toast = useToast();
  const { confirm } = useModal();
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/employees/department/my-team");
      setEmployees(res.employees || []);
    } catch (err) {
      toast.error(err.message || "Could not load employees.");
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

  const filtered = employees.filter((emp) => {
    const matchStatus = filter === "all" || emp.employmentStatus === filter;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      (emp.fname || "").toLowerCase().includes(q) ||
      (emp.lname || "").toLowerCase().includes(q) ||
      (emp.email || "").toLowerCase().includes(q) ||
      (emp.position || "").toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  async function toggleStatus(emp) {
    const next = emp.employmentStatus === "active" ? "inactive" : "active";
    const ok = await confirm({
      title: next === "active" ? "Activate employee?" : "Deactivate employee?",
      message: `Set ${emp.fname} ${emp.lname} to ${next}?`,
      confirmText: cap(next),
      danger: next === "inactive",
    });
    if (!ok) return;
    try {
      await apiRequest(`/employees/${emp._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ employmentStatus: next }),
      });
      toast.success(
        `Employee ${next === "active" ? "activated" : "deactivated"} successfully.`,
      );
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not update status.");
    }
  }

  return (
    <div className={dashboardContainer}>
      <div className={dashboardHeaderRow}>
        <div>
          <h2 className={dashboardHeader.h2}>Department Employees</h2>
          <p className={dashboardHeader.p}>
            View and manage the employees in your department.
          </p>
        </div>
        <div className="flex rounded-[10px] border border-slate-200 bg-slate-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-5 py-2 text-[13px] font-semibold transition ${
                filter === f.value
                  ? "bg-white text-indigo-500 shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className={panel}>
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="material-symbols-outlined text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or position..."
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
            icon="person_off"
            title="No employees match your criteria."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[700px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Employee",
                    "Email",
                    "Position",
                    "Salary",
                    "Status",
                    "Actions",
                  ].map((h) => (
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
                {filtered.map((emp) => {
                  const active = emp.employmentStatus === "active";
                  return (
                    <tr key={emp._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold uppercase text-indigo-700">
                            {(emp.fname?.[0] || "") + (emp.lname?.[0] || "")}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800">
                              {cap(emp.fname)} {cap(emp.lname)}
                            </span>
                            <span className="text-xs capitalize text-slate-400">
                              {cap(emp.role) || "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {emp.email}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {emp.position || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm font-semibold text-slate-900">
                        {money(emp.salary)}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <span className={badge(active ? "active" : "inactive")}>
                          {emp.employmentStatus}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <button
                          className={`rounded-md border px-4 py-1.5 text-xs font-semibold transition ${
                            active
                              ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              : "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                          onClick={() => toggleStatus(emp)}
                        >
                          {active ? "Deactivate" : "Activate"}
                        </button>
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
