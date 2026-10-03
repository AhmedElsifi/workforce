export default function FormField({ label, error, children, htmlFor }) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block text-xs font-semibold text-slate-700"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
