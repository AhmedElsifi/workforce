export default function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}) {
  return (
    <div className="px-5 py-10 text-center text-slate-400">
      <span className="material-symbols-outlined block text-4xl">{icon}</span>
      {title && <p className="mt-1 font-semibold text-slate-500">{title}</p>}
      {description && <p className="mt-1 text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
