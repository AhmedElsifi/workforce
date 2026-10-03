export default function Toast({ type = "info", message, onClose }) {
  const icon =
    type === "success" ? "check_circle" : type === "error" ? "error" : "info";
  const border =
    type === "success"
      ? "border-l-emerald-500"
      : type === "error"
        ? "border-l-red-500"
        : "border-l-indigo-500";
  const iconColor =
    type === "success"
      ? "text-emerald-500"
      : type === "error"
        ? "text-red-500"
        : "text-indigo-500";

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border border-slate-200 border-l-4 ${border} bg-white px-3.5 py-3 text-sm shadow-lg animate-toast-in`}
    >
      <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      <span className="flex-1 text-slate-800">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
