type Band = 'strong' | 'moderate' | 'weak';

const bandStyles: Record<Band, { label: string; tone: string }> = {
  strong: { label: 'Supports confidence', tone: 'text-success border-success/45 bg-success/8' },
  moderate: { label: 'Neutral context', tone: 'text-accent border-accent/40 bg-accent/10' },
  weak: { label: 'Raises caution', tone: 'text-warning border-warning/45 bg-warning/8' },
};

export function MetricCard({ label, value, hint, band = 'moderate' }: { label: string; value: string; hint: string; band?: Band }) {
  return (
    <div className="card p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-accent">{label}</p>
        <span className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${bandStyles[band].tone}`}>
          {bandStyles[band].label}
        </span>
      </div>
      <p className="text-xl font-semibold mt-1">{value}</p>
      <p className="text-xs text-textSecondary mt-1">{hint}</p>
    </div>
  );
}
