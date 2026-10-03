export default function DataTable({
  columns,
  rows,
  emptyMessage = "No records found.",
  keyField = "id",
}) {
  if (!rows || rows.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-slate-400">
        <span className="material-symbols-outlined block text-4xl">inbox</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[600px] border-collapse">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-slate-100 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[keyField] ?? i} className="hover:bg-slate-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-900 last:border-b-0"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
