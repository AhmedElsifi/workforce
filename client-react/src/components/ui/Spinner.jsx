export default function Spinner({ size = 28 }) {
  return (
    <div
      className="animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-500"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
