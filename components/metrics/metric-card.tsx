export function MetricCard({
  label,
  value,
  hint,
  detail,
  band,
}: {
  label: string;
  value: string;
  hint: string;
  detail?: string;
  band?: string;
}) {
  return (
    <div className="card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">{label}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
        </div>
        {band ? <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-textSecondary">{band}</span> : null}
      </div>
      <p className="text-sm text-slate-200">{hint}</p>
      {detail ? <p className="text-xs leading-5 text-textSecondary">{detail}</p> : null}
    </div>
  );
}
