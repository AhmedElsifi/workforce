import { NavLink } from "react-router-dom";

const LINKS = {
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/admin/employees", label: "Employees", icon: "group" },
    { to: "/admin/departments", label: "Depts", icon: "domain" },
    { to: "/admin/audit", label: "Audit", icon: "security" },
    { to: "/admin/profile", label: "Profile", icon: "person" },
  ],
  manager: [
    { to: "/manager/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/manager/employees", label: "Employees", icon: "group" },
    { to: "/manager/leave-requests", label: "Leave", icon: "fact_check" },
    { to: "/manager/attendance", label: "Attendance", icon: "schedule" },
    { to: "/manager/profile", label: "Profile", icon: "person" },
  ],
  employee: [
    { to: "/employee/dashboard", label: "Home", icon: "dashboard" },
    { to: "/employee/attendance", label: "Attendance", icon: "history" },
    { to: "/employee/leave-requests", label: "Leave", icon: "description" },
    { to: "/employee/profile", label: "Profile", icon: "person" },
  ],
};

export default function MobileBottomNav({ role }) {
  const links = LINKS[role] ?? [];
  return (
    <nav
      className="hidden max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:flex max-md:justify-around max-md:border-t max-md:border-slate-800 max-md:bg-slate-900 max-md:py-3"
      aria-label="Primary"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-1.5 text-[10px] font-medium ${
              isActive ? "text-indigo-500" : "text-slate-400"
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">
            {link.icon}
          </span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
