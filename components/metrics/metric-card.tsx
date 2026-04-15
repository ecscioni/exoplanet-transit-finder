export function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card p-3">
      <p className="text-xs uppercase tracking-widest text-accent">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
      <p className="text-xs text-textSecondary mt-1">{hint}</p>
    </div>
  );
}
