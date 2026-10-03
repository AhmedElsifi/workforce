import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-10">
      <div className="flex w-full max-w-[500px] flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-500">
          <span className="material-symbols-outlined text-5xl">lock</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-800">
          403 — Access Denied
        </h1>
        <p className="mb-8 text-base leading-relaxed text-slate-500">
          You do not have the necessary permissions to access this page. If you
          believe this is a mistake, please contact your system administrator.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          <span className="material-symbols-outlined">home</span>
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
