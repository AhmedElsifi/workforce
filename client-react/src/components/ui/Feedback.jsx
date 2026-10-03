export default function Feedback({ type = "info", message }) {
  if (!message) return null;
  const styles =
    {
      success: "bg-emerald-50 text-emerald-700 border-emerald-200",
      error: "bg-red-50 text-red-700 border-red-200",
      info: "bg-slate-50 text-slate-600 border-slate-200",
      loading: "bg-slate-50 text-slate-600 border-slate-200",
    }[type] || "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div
      role="status"
      className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {message}
    </div>
  );
}
