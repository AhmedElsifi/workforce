import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useModal } from "../../components/ui/ModalProvider";
import { useToast } from "../../components/ui/ToastProvider";
import {
  badge,
  btnDanger,
  btnPrimary,
  dashboardContainer,
  dashboardHeader,
  dashboardHeaderRow,
  inputClass,
  panel,
} from "../../components/ui/field";

const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "all", label: "All Requests" },
];

export default function ManagerLeaveRequestsPage() {
  const toast = useToast();
  const { confirm } = useModal();

  const [filter, setFilter] = useState("pending");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useEffectEvent(async (currentFilter) => {
    setLoading(true);
    try {
      const endpoint =
        currentFilter === "pending"
          ? "/leave-requests/pending"
          : "/leave-requests";
      const data = await apiRequest(endpoint);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Could not load leave requests.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    load(filter);
  }, [filter, refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function updateStatus(id, status) {
    const ok = await confirm({
      title: `${status === "Approved" ? "Approve" : "Reject"} request?`,
      message: `Are you sure you want to ${status.toLowerCase()} this leave request?`,
      confirmText: status,
      danger: status === "Rejected",
    });
    if (!ok) return;
    try {
      const res = await apiRequest(`/leave-requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, managerComment: notes[id] || "" }),
      });
      toast.success(res?.message || `Request ${status.toLowerCase()}.`);
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not update request.");
    }
  }

  return (
    <div className={dashboardContainer}>
      <div className={dashboardHeaderRow}>
        <div>
          <h2 className={dashboardHeader.h2}>Leave Requests</h2>
          <p className={dashboardHeader.p}>
            Review and manage employee leave requests for your department.
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon="fact_check"
            title={
              filter === "pending"
                ? "No pending leave requests found."
                : "No leave requests found."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Employee",
                    "Type",
                    "Duration",
                    "Reason",
                    "Status",
                    "Manager Note",
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
                {rows.map((item) => {
                  const name =
                    `${item.employeeId?.fname || ""} ${item.employeeId?.lname || ""}`.trim() ||
                    "Unknown Employee";
                  const initials = name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();
                  const start = new Date(item.startDate).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" },
                  );
                  const end = new Date(item.endDate).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" },
                  );
                  const duration = start === end ? start : `${start} – ${end}`;
                  const typeClass = (
                    item.leaveType || "personal"
                  ).toLowerCase();
                  const statusClass = (item.status || "pending").toLowerCase();
                  const isPending = statusClass === "pending";

                  return (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {initials}
                          </div>
                          <span className="text-slate-900">{name}</span>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <span className={badge(typeClass)}>
                          {item.leaveType}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {duration}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                        {item.reason || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        <span className={badge(statusClass)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        {isPending ? (
                          <input
                            className={`${inputClass} !min-w-[140px] !py-1.5 !text-[13px]`}
                            placeholder="Add a note..."
                            value={notes[item._id] || ""}
                            onChange={(e) =>
                              setNotes((n) => ({
                                ...n,
                                [item._id]: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <span className="italic text-slate-500">
                            {item.managerComment || "—"}
                          </span>
                        )}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                        {isPending ? (
                          <div className="flex gap-2">
                            <button
                              className={`${btnPrimary} !px-3.5 !py-1.5 !text-xs`}
                              onClick={() => updateStatus(item._id, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              className={`${btnDanger} !px-3.5 !py-1.5 !text-xs`}
                              onClick={() => updateStatus(item._id, "Rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[13px] text-slate-400">
                            Processed
                          </span>
                        )}
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
