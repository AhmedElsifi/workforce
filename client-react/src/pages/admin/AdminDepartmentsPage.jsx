import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import { useModal } from "../../components/ui/ModalProvider";
import {
  btnPrimary,
  btnSecondary,
  dashboardContainer,
  dashboardHeader,
  dashboardHeaderRow,
  iconBtn,
  inputClass,
} from "../../components/ui/field";

const emptyForm = { name: "", description: "", manager: "" };

export default function AdminDepartmentsPage() {
  const toast = useToast();
  const { confirm } = useModal();

  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDepartments = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/departments");
      setDepartments(res.departments || []);
    } catch (err) {
      toast.error(err.message || "Could not load departments.");
    } finally {
      setLoading(false);
    }
  });

  const loadManagers = useEffectEvent(async () => {
    try {
      const r = await apiRequest("/employees?role=manager");
      setManagers(r.employees || []);
    } catch {
      // non-fatal
    }
  });

  useEffect(() => {
    loadDepartments();
    loadManagers();
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(true);
  }
  function openEdit(dept) {
    setEditingId(dept._id);
    setForm({
      name: dept.name,
      description: dept.description || "",
      manager: dept.manager?._id || "",
    });
    setErrors({});
    setFormOpen(true);
  }

  async function submitForm(e) {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      manager: form.manager || null,
    };
    try {
      if (editingId) {
        await apiRequest(`/departments/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Department updated successfully.");
      } else {
        await apiRequest("/departments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Department created successfully.");
      }
      setFormOpen(false);
      refresh();
    } catch (err) {
      const apiErrors = err?.errors || {};
      setErrors(apiErrors);
      if (!Object.keys(apiErrors).length)
        toast.error(err.message || "Could not save department.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDept(dept) {
    const ok = await confirm({
      title: "Delete department?",
      message: `Are you sure you want to delete "${dept.name}"? This cannot be undone.`,
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await apiRequest(`/departments/${dept._id}`, { method: "DELETE" });
      toast.success("Department deleted successfully.");
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not delete department.");
    }
  }

  return (
    <div className={dashboardContainer}>
      <div className={dashboardHeaderRow}>
        <div>
          <h2 className={dashboardHeader.h2}>Departments</h2>
          <p className={dashboardHeader.p}>
            Manage your organization's departments and headcount.
          </p>
        </div>
        <button className={btnPrimary} onClick={openAdd}>
          <span className="material-symbols-outlined">add</span>
          Add Department
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : departments.length === 0 ? (
        <EmptyState
          icon="domain_disabled"
          title="No departments yet."
          description='Click "Add Department" to create the first one.'
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-slate-50">
              <tr>
                {["Name", "Description", "Manager", "Headcount", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="border-b border-slate-100 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                    {dept.name}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                    {dept.description || "—"}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                    {dept.manager
                      ? `${dept.manager.fname} ${dept.manager.lname}`
                      : "—"}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                    {dept.headcount}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        className={iconBtn}
                        onClick={() => openEdit(dept)}
                        title="Edit"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className={iconBtn}
                        onClick={() => deleteDept(dept)}
                        title="Delete"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        title={editingId ? "Edit Department" : "Add Department"}
        onClose={() => setFormOpen(false)}
      >
        <form onSubmit={submitForm}>
          <FormField
            label="Department Name *"
            error={errors.name}
            htmlFor="dept-name"
          >
            <input
              id="dept-name"
              className={inputClass}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Description" htmlFor="dept-desc">
            <textarea
              id="dept-desc"
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>
          <FormField
            label="Manager"
            error={errors.manager}
            htmlFor="dept-manager"
          >
            <select
              id="dept-manager"
              className={inputClass}
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
            >
              <option value="">No manager assigned</option>
              {managers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.fname} {m.lname}
                </option>
              ))}
            </select>
          </FormField>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving..." : "Save Department"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
