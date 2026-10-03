import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import FormField from "../../components/ui/FormField";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../auth/useAuth";
import { useToast } from "../../components/ui/ToastProvider";
import {
  btnPrimary,
  dashboardContainer,
  dashboardHeader,
  dashboardHeaderRow,
  inputClass,
  panel,
} from "../../components/ui/field";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminProfilePage() {
  const { reload } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    position: "",
    role: "admin",
    salary: "",
    employmentStatus: "active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await apiRequest("/auth/me");
        setForm({
          fname: me.fname ?? "",
          lname: me.lname ?? "",
          email: me.email ?? "",
          password: "",
          position: me.position ?? "",
          role: me.role ?? "admin",
          salary: me.salary ?? "",
          employmentStatus: me.employmentStatus ?? "active",
        });
      } catch (err) {
        toast.error(err.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  function validate() {
    const e = {};
    const fname = form.fname.trim(),
      lname = form.lname.trim();
    if (!fname) e.fname = "First name is required";
    else if (fname.length < 2) e.fname = "At least 2 characters";
    if (!lname) e.lname = "Last name is required";
    else if (lname.length < 2) e.lname = "At least 2 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Invalid email";
    if (form.password && form.password.length < 6)
      e.password = "At least 6 characters";
    if (form.salary !== "") {
      const n = Number(form.salary);
      if (!Number.isFinite(n) || n < 0) e.salary = "Must be non-negative";
    }
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

    const payload = {
      fname: form.fname.trim(),
      lname: form.lname.trim(),
      email: form.email.trim(),
      role: form.role,
      employmentStatus: form.employmentStatus,
    };
    if (form.position.trim()) payload.position = form.position.trim();
    if (form.salary !== "") payload.salary = Number(form.salary);
    if (form.password) payload.password = form.password;

    setSaving(true);
    try {
      const res = await apiRequest("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setForm((f) => ({ ...f, password: "" }));
      toast.success(res?.message || "Profile updated successfully.");
      reload();
    } catch (err) {
      toast.error(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );

  return (
    <div className={dashboardContainer}>
      <div className={dashboardHeaderRow}>
        <div>
          <h2 className={dashboardHeader.h2}>My Profile</h2>
          <p className={dashboardHeader.p}>
            As an admin, you can edit every field in your account.
          </p>
        </div>
        <button
          type="submit"
          form="admin-profile-form"
          className={btnPrimary}
          disabled={saving}
        >
          <span className="material-symbols-outlined">save</span>
          {saving ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>

      <form id="admin-profile-form" onSubmit={onSubmit}>
        <section className={panel}>
          <h3 className="mb-5 text-base font-bold text-slate-800">
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
            <FormField
              label="First Name"
              error={errors.fname}
              htmlFor="p-fname"
            >
              <input
                id="p-fname"
                className={inputClass}
                value={form.fname}
                onChange={(e) => setForm({ ...form, fname: e.target.value })}
              />
            </FormField>
            <FormField label="Last Name" error={errors.lname} htmlFor="p-lname">
              <input
                id="p-lname"
                className={inputClass}
                value={form.lname}
                onChange={(e) => setForm({ ...form, lname: e.target.value })}
              />
            </FormField>
            <FormField
              label="Email Address"
              error={errors.email}
              htmlFor="p-email"
            >
              <input
                id="p-email"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
            <FormField
              label="Password"
              error={errors.password}
              htmlFor="p-password"
            >
              <input
                id="p-password"
                type="password"
                className={inputClass}
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </FormField>
          </div>
        </section>

        <section className={`${panel} mt-6`}>
          <h3 className="mb-5 text-base font-bold text-slate-800">
            Employment Details
          </h3>
          <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
            <FormField label="Position" htmlFor="p-position">
              <input
                id="p-position"
                className={inputClass}
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
            </FormField>
            <FormField label="Role" htmlFor="p-role">
              <select
                id="p-role"
                className={inputClass}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </FormField>
            <FormField label="Salary" error={errors.salary} htmlFor="p-salary">
              <input
                id="p-salary"
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </FormField>
            <FormField label="Employment Status" htmlFor="p-status">
              <select
                id="p-status"
                className={inputClass}
                value={form.employmentStatus}
                onChange={(e) =>
                  setForm({ ...form, employmentStatus: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
          </div>
        </section>
      </form>
    </div>
  );
}
