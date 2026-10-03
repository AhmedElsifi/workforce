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

export default function EmployeeProfilePage() {
  const { reload } = useAuth();
  const toast = useToast();

  const [editable, setEditable] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [readonly, setReadonly] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await apiRequest("/auth/me");
        setEditable({
          fname: me.fname ?? "",
          lname: me.lname ?? "",
          email: me.email ?? "",
          password: "",
        });
        setReadonly({
          position: me.position || "—",
          department: me.department || "—",
          role: me.role || "—",
          salary:
            typeof me.salary === "number"
              ? `$${me.salary.toLocaleString("en-US")}`
              : "—",
          employmentStatus: me.employmentStatus || "—",
        });
      } catch (err) {
        toast.error(err.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    const fname = editable.fname.trim(),
      lname = editable.lname.trim();
    if (!fname) errs.fname = "First name is required";
    else if (fname.length < 2) errs.fname = "At least 2 characters";
    if (!lname) errs.lname = "Last name is required";
    else if (lname.length < 2) errs.lname = "At least 2 characters";
    if (editable.password && editable.password.length < 6)
      errs.password = "At least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payload = { fname, lname };
    if (editable.password) payload.password = editable.password;

    setSaving(true);
    try {
      const res = await apiRequest("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setEditable((s) => ({ ...s, password: "" }));
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
          <h2 className={dashboardHeader.h2}>My Employee Profile</h2>
          <p className={dashboardHeader.p}>
            Manage your personal information and employment details.
          </p>
        </div>
        <button
          type="submit"
          form="employee-profile-form"
          className={btnPrimary}
          disabled={saving}
        >
          <span className="material-symbols-outlined">save</span>
          {saving ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>

      <form id="employee-profile-form" onSubmit={onSubmit}>
        <section className={panel}>
          <h3 className="mb-5 text-base font-bold text-slate-800">
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
            <FormField
              label="First Name"
              error={errors.fname}
              htmlFor="e-fname"
            >
              <input
                id="e-fname"
                className={inputClass}
                value={editable.fname}
                onChange={(e) =>
                  setEditable({ ...editable, fname: e.target.value })
                }
              />
            </FormField>
            <FormField label="Last Name" error={errors.lname} htmlFor="e-lname">
              <input
                id="e-lname"
                className={inputClass}
                value={editable.lname}
                onChange={(e) =>
                  setEditable({ ...editable, lname: e.target.value })
                }
              />
            </FormField>
            <FormField label="Email Address" htmlFor="e-email">
              <input
                id="e-email"
                className={`${inputClass} bg-slate-100`}
                value={editable.email}
                readOnly
              />
            </FormField>
            <FormField
              label="Password"
              error={errors.password}
              htmlFor="e-password"
            >
              <input
                id="e-password"
                type="password"
                className={inputClass}
                placeholder="Leave blank to keep current password"
                value={editable.password}
                onChange={(e) =>
                  setEditable({ ...editable, password: e.target.value })
                }
              />
            </FormField>
          </div>
        </section>
      </form>

      <section className={`${panel} mt-6`}>
        <h3 className="mb-5 text-base font-bold text-slate-800">
          Employment Details{" "}
          <span className="ml-2 text-[11px] font-semibold uppercase text-slate-500">
            Managed by HR
          </span>
        </h3>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {Object.entries(readonly).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-sm capitalize text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
