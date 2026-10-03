import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import {
  badge,
  btnPrimary,
  dashboardContainer,
  dashboardHeader,
  inputClass,
  panel,
} from "../../components/ui/field";

const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Unpaid"];
const MAX_DAYS = 30;
const MAX_REASON = 500;
const emptyForm = {
  leaveType: "Annual",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function EmployeeLeaveRequestsPage() {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/leave-requests/my-requests");
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Could not load your leave history.");
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

  function validate() {
    const e = {};
    if (!form.leaveType) e.leaveType = "Leave type is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (form.startDate && form.endDate) {
      const s = new Date(form.startDate),
        en = new Date(form.endDate);
      if (s > en) e.endDate = "End date must be on or after start date";
      else {
        const days = Math.floor((en - s) / 86400000) + 1;
        if (days > MAX_DAYS) e.endDate = `Cannot exceed ${MAX_DAYS} days`;
      }
    }
    if (!form.reason.trim()) e.reason = "Reason is required";
    else if (form.reason.trim().length > MAX_REASON)
      e.reason = `At most ${MAX_REASON} characters`;
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiRequest("/leave-requests/new-request", {
        method: "POST",
        body: JSON.stringify({
          leaveType: form.leaveType,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason.trim(),
        }),
      });
      toast.success(res?.message || "Leave request submitted successfully.");
      setForm(emptyForm);
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={dashboardContainer}>
      <div>
        <h2 className={dashboardHeader.h2}>My Leave Requests</h2>
        <p className={dashboardHeader.p}>
          Submit a new leave request and track your previous requests.
        </p>
      </div>

      <section className={panel}>
        <h3 className="mb-5 text-base font-semibold text-slate-800">
          Submit Leave Request
        </h3>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            <FormField label="Leave Type" error={errors.leaveType} htmlFor="lt">
              <select
                id="lt"
                className={inputClass}
                value={form.leaveType}
                onChange={(e) =>
                  setForm({ ...form, leaveType: e.target.value })
                }
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Start Date" error={errors.startDate} htmlFor="sd">
              <input
                id="sd"
                type="date"
                className={inputClass}
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </FormField>
            <FormField label="End Date" error={errors.endDate} htmlFor="ed">
              <input
                id="ed"
                type="date"
                className={inputClass}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Reason" error={errors.reason} htmlFor="rs">
            <textarea
              id="rs"
              rows={3}
              className={inputClass}
              placeholder="State your reason for leave..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </FormField>
          <div className="flex justify-end">
            <button type="submit" className={btnPrimary} disabled={submitting}>
              <span className="material-symbols-outlined">send</span>
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </section>

      <section className={panel}>
        <h3 className="mb-5 text-base font-semibold text-slate-800">
          My Leave History
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon="event_note" title="You have no leave history." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[600px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {["Type", "Start Date", "End Date", "Reason", "Status"].map(
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
                {rows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {r.leaveType}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {new Date(r.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {new Date(r.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {r.reason || "—"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                      <span
                        className={badge((r.status || "pending").toLowerCase())}
                      >
                        {r.status}
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
