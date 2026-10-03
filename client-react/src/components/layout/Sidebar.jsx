import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const LINKS = {
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/admin/employees", label: "Employees", icon: "group" },
    { to: "/admin/departments", label: "Departments", icon: "domain" },
    { to: "/admin/audit", label: "System Audit", icon: "security" },
    { to: "/admin/profile", label: "My Profile", icon: "person" },
  ],
  manager: [
    { to: "/manager/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/manager/employees", label: "Employees", icon: "group" },
    {
      to: "/manager/leave-requests",
      label: "Leave Requests",
      icon: "fact_check",
    },
    { to: "/manager/attendance", label: "Attendance", icon: "schedule" },
    { to: "/manager/profile", label: "My Profile", icon: "person" },
  ],
  employee: [
    { to: "/employee/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/employee/attendance", label: "Attendance", icon: "history" },
    {
      to: "/employee/leave-requests",
      label: "My Leave Requests",
      icon: "description",
    },
    { to: "/employee/profile", label: "My Profile", icon: "person" },
  ],
};
const SUBTITLE = {
  admin: "Admin Console • Org Controls",
  manager: "Manager Portal",
  employee: "Employee Portal",
};
const NAV_LABEL = {
  admin: "Main Navigation",
  manager: "Operations & Oversight",
  employee: "Navigation",
};

const initials = (u) =>
  `${u?.fname?.[0] ?? ""}${u?.lname?.[0] ?? ""}`.toUpperCase() || "--";
const title = (v) =>
  !v
    ? ""
    : v
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const links = LINKS[role] ?? [];
  const fullName = user
    ? `${title(user.fname)} ${title(user.lname)}`.trim()
    : "Loading...";

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col bg-slate-900 text-white max-md:hidden">
      <div className="flex items-center gap-3 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
          <span className="material-symbols-outlined text-xl">
            corporate_fare
          </span>
        </div>
        <div className="leading-tight">
          <h1 className="text-base font-bold tracking-wide">WorkForce</h1>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
            {SUBTITLE[role]}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4">
        <div className="my-6 mb-3 ml-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {NAV_LABEL[role]}
        </div>
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `mb-1 flex items-center justify-between rounded-lg px-3 py-3 text-[13px] font-medium transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex items-center justify-between border-t border-slate-800 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
            {initials(user)}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-[13px] font-semibold">{fullName}</h4>
            <p className="text-[11px] capitalize text-slate-500">{role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          aria-label="Logout"
          title="Logout"
          className="flex items-center justify-center rounded-md p-1.5 text-slate-500 transition hover:text-white"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  );
}
