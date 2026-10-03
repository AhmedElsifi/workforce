export const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 disabled:bg-slate-100 disabled:text-slate-500";

export const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60";

export const btnSecondary =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60";

export const btnDanger =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60";

export const iconBtn =
    "inline-flex items-center justify-center rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900";

export const panel = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

export const badge = (variant) => {
    const map = {
        active: "bg-emerald-50 text-emerald-700",
        inactive: "bg-slate-100 text-slate-500",
        pending: "bg-amber-100 text-amber-800",
        approved: "bg-emerald-50 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
        annual: "bg-emerald-50 text-emerald-700",
        sick: "bg-red-100 text-red-700",
        casual: "bg-indigo-100 text-indigo-700",
        unpaid: "bg-slate-100 text-slate-600",
    };
    const base = "inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize";
    return `${base} ${map[variant] ?? "bg-slate-100 text-slate-600"}`;
};

export const kpiCard = "flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
export const kpiIcon = "flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]";
export const kpiIconColors = {
    blue: "bg-indigo-100 text-indigo-700",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800",
};
export const kpiLabel = "text-xs font-semibold uppercase tracking-wider text-slate-500";
export const kpiValue = "text-2xl font-bold text-slate-800";

export const dashboardContainer = "mx-auto flex w-full max-w-[1200px] flex-col gap-6";
export const dashboardHeader = {
    h2: "mb-1 text-2xl font-bold text-slate-800",
    p: "text-sm text-slate-500",
};
export const dashboardHeaderRow =
    "mb-2 flex flex-wrap items-center justify-between gap-5";