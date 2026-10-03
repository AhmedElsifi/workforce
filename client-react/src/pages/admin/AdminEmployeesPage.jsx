import { useEffect, useEffectEvent, useState } from "react";
import { apiRequest } from "../../api/client";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import { useModal } from "../../components/ui/ModalProvider";
import {
  badge,
  btnPrimary,
  btnSecondary,
  dashboardContainer,
  dashboardHeader,
  dashboardHeaderRow,
  iconBtn,
  inputClass,
} from "../../components/ui/field";

const ROLES = ["employee", "manager", "admin"];
const STATUSES = ["active", "inactive"];

const emptyAdd = {
  fname: "",
  lname: "",
  email: "",
  password: "",
  position: "",
  department: "",
  salary: "",
};

export default function AdminEmployeesPage() {
  const toast = useToast();
  const { confirm } = useModal();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    role: "",
    status: "",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyAdd);
  const [addErrors, setAddErrors] = useState({});
  const [addSaving, setAddSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    position: "",
    role: "employee",
    department: "",
    salary: "",
    employmentStatus: "active",
  });
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    apiRequest("/departments")
      .then((r) => setDepartments(r.departments || []))
      .catch(() => {});
  }, []);

  // debounce search into filters
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search })), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadEmployees = useEffectEvent(async (currentFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.search.trim())
        params.set("search", currentFilters.search.trim());
      if (currentFilters.department)
        params.set("department", currentFilters.department);
      if (currentFilters.role) params.set("role", currentFilters.role);
      if (currentFilters.status) params.set("status", currentFilters.status);
      const qs = params.toString();
      const res = await apiRequest(`/employees${qs ? `?${qs}` : ""}`);
      setEmployees(res.employees || []);
    } catch (err) {
      toast.error(err.message || "Could not load employees.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    loadEmployees(filters);
  }, [filters, refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function openAdd() {
    setAddForm(emptyAdd);
    setAddErrors({});
    setAddOpen(true);
  }

  async function submitAdd(e) {
    e.preventDefault();
    setAddErrors({});
    setAddSaving(true);
    try {
      await apiRequest("/employees", {
        method: "POST",
        body: JSON.stringify({
          fname: addForm.fname.trim(),
          lname: addForm.lname.trim(),
          email: addForm.email.trim(),
          password: addForm.password,
          position: addForm.position.trim(),
          department: addForm.department || null,
          salary: Number(addForm.salary) || 0,
        }),
      });
      setAddOpen(false);
      toast.success("Employee added successfully.");
      refresh();
    } catch (err) {
      const errors = err?.errors || {};
      setAddErrors(errors);
      if (!Object.keys(errors).length)
        toast.error(err.message || "Could not add employee.");
    } finally {
      setAddSaving(false);
    }
  }

  function openEdit(emp) {
    setEditId(emp._id);
    setEditForm({
      position: emp.position || "",
      role: emp.role,
      department: emp.department?._id || "",
      salary: emp.salary ?? "",
      employmentStatus: emp.employmentStatus || "active",
    });
    setEditOpen(true);
  }

  async function submitEdit(e) {
    e.preventDefault();
    setEditSaving(true);
    try {
      await apiRequest(`/employees/${editId}`, {
        method: "PUT",
        body: JSON.stringify({
          position: editForm.position.trim(),
          role: editForm.role,
          department: editForm.department || null,
          salary: Number(editForm.salary) || 0,
          employmentStatus: editForm.employmentStatus,
        }),
      });
      setEditOpen(false);
      toast.success("Employee updated successfully.");
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not update employee.");
    } finally {
      setEditSaving(false);
    }
  }

  async function toggleStatus(emp) {
    const activating = emp.employmentStatus !== "active";
    const ok = await confirm({
      title: activating ? "Activate employee?" : "Deactivate employee?",
      message: `${activating ? "Activate" : "Deactivate"} ${emp.fname} ${emp.lname}?`,
      confirmText: activating ? "Activate" : "Deactivate",
      danger: !activating,
    });
    if (!ok) return;
    try {
      if (activating) {
        await apiRequest(`/employees/${emp._id}`, {
          method: "PUT",
          body: JSON.stringify({
            position: emp.position,
            role: emp.role,
            department: emp.department?._id || null,
            salary: emp.salary,
            employmentStatus: "active",
          }),
        });
      } else {
        await apiRequest(`/employees/${emp._id}/deactivate`, {
          method: "PATCH",
        });
      }
      toast.success(
        `Employee ${activating ? "activated" : "deactivated"} successfully.`,
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
          <h2 className={dashboardHeader.h2}>Employees</h2>
          <p className={dashboardHeader.p}>
            Manage employee records, roles, and status.
          </p>
        </div>
        <button className={btnPrimary} onClick={openAdd}>
          <span className="material-symbols-outlined">person_add</span>
          Add Employee
        </button>
      </div>

      <div className="flex gap-3 max-md:flex-col">
        <input
          type="text"
          className={`${inputClass} min-w-fit flex-1 max-md:w-full`}
          placeholder="Search by name, email, or position"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={`${inputClass} w-auto max-md:w-full`}
          value={filters.department}
          onChange={(e) => updateFilter("department", e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          className={`${inputClass} w-auto max-md:w-full`}
          value={filters.role}
          onChange={(e) => updateFilter("role", e.target.value)}
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className={`${inputClass} w-auto max-md:w-full`}
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : employees.length === 0 ? (
        <EmptyState
          icon="person_off"
          title="No employees match your filters."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Position",
                  "Department",
                  "Role",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-slate-100 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const active = emp.employmentStatus === "active";
                return (
                  <tr key={emp._id} className="hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {emp.fname} {emp.lname}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {emp.email}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {emp.position || "—"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900">
                      {emp.department?.name || "—"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm capitalize text-slate-900">
                      {emp.role}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                      <span className={badge(active ? "active" : "inactive")}>
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          className={iconBtn}
                          onClick={() => openEdit(emp)}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button
                          className={iconBtn}
                          onClick={() => toggleStatus(emp)}
                          title={active ? "Deactivate" : "Activate"}
                        >
                          <span className="material-symbols-outlined">
                            {active ? "person_remove" : "person_check"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={addOpen}
        title="Add Employee"
        onClose={() => setAddOpen(false)}
      >
        <form onSubmit={submitAdd}>
          <FormField
            label="First Name *"
            error={addErrors.fname}
            htmlFor="add-fname"
          >
            <input
              id="add-fname"
              className={inputClass}
              required
              value={addForm.fname}
              onChange={(e) =>
                setAddForm({ ...addForm, fname: e.target.value })
              }
            />
          </FormField>
          <FormField
            label="Last Name *"
            error={addErrors.lname}
            htmlFor="add-lname"
          >
            <input
              id="add-lname"
              className={inputClass}
              required
              value={addForm.lname}
              onChange={(e) =>
                setAddForm({ ...addForm, lname: e.target.value })
              }
            />
          </FormField>
          <FormField
            label="Email *"
            error={addErrors.email}
            htmlFor="add-email"
          >
            <input
              id="add-email"
              type="email"
              className={inputClass}
              required
              value={addForm.email}
              onChange={(e) =>
                setAddForm({ ...addForm, email: e.target.value })
              }
            />
          </FormField>
          <FormField
            label="Password *"
            error={addErrors.password}
            htmlFor="add-password"
          >
            <input
              id="add-password"
              type="password"
              className={inputClass}
              required
              value={addForm.password}
              onChange={(e) =>
                setAddForm({ ...addForm, password: e.target.value })
              }
            />
          </FormField>
          <FormField label="Position" htmlFor="add-position">
            <input
              id="add-position"
              className={inputClass}
              value={addForm.position}
              onChange={(e) =>
                setAddForm({ ...addForm, position: e.target.value })
              }
            />
          </FormField>
          <FormField label="Department" htmlFor="add-department">
            <select
              id="add-department"
              className={inputClass}
              value={addForm.department}
              onChange={(e) =>
                setAddForm({ ...addForm, department: e.target.value })
              }
            >
              <option value="">No department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Salary" htmlFor="add-salary">
            <input
              id="add-salary"
              type="number"
              min="0"
              className={inputClass}
              value={addForm.salary}
              onChange={(e) =>
                setAddForm({ ...addForm, salary: e.target.value })
              }
            />
          </FormField>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={btnPrimary} disabled={addSaving}>
              {addSaving ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Employee"
        onClose={() => setEditOpen(false)}
      >
        <form onSubmit={submitEdit}>
          <FormField label="Position" htmlFor="edit-position">
            <input
              id="edit-position"
              className={inputClass}
              value={editForm.position}
              onChange={(e) =>
                setEditForm({ ...editForm, position: e.target.value })
              }
            />
          </FormField>
          <FormField label="Role" htmlFor="edit-role">
            <select
              id="edit-role"
              className={inputClass}
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Department" htmlFor="edit-department">
            <select
              id="edit-department"
              className={inputClass}
              value={editForm.department}
              onChange={(e) =>
                setEditForm({ ...editForm, department: e.target.value })
              }
            >
              <option value="">No department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Salary" htmlFor="edit-salary">
            <input
              id="edit-salary"
              type="number"
              min="0"
              className={inputClass}
              value={editForm.salary}
              onChange={(e) =>
                setEditForm({ ...editForm, salary: e.target.value })
              }
            />
          </FormField>
          <FormField label="Status" htmlFor="edit-status">
            <select
              id="edit-status"
              className={inputClass}
              value={editForm.employmentStatus}
              onChange={(e) =>
                setEditForm({ ...editForm, employmentStatus: e.target.value })
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={btnPrimary} disabled={editSaving}>
              {editSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
