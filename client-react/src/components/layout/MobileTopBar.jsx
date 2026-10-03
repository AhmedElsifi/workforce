import { useAuth } from "../../auth/useAuth";

export default function MobileTopBar({ role }) {
  const { user, logout } = useAuth();
  const name = user ? `${user.fname} ${user.lname}`.trim() : role;

  return (
    <header className="hidden max-md:flex max-md:w-full max-md:items-center max-md:justify-between max-md:bg-slate-900 max-md:px-5 max-md:py-4 max-md:text-white">
      <div className="font-bold">WorkForce</div>
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>{name}</span>
        <button
          onClick={logout}
          aria-label="Logout"
          className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}
