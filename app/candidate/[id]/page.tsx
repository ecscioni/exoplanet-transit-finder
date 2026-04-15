import { notFound } from 'next/navigation';
import { getCandidateById } from '@/lib/data/load-candidates';
import { PlotCard } from '@/components/charts/plot-card';
import { MetricCard } from '@/components/metrics/metric-card';
import { VerdictControl } from '@/components/candidate/verdict-control';

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) return notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-[2fr_1fr] gap-4">
      <section className="space-y-4">
        <header className="panel p-4">
          <p className="text-accent uppercase tracking-widest text-xs">Reasoning World</p>
          <h1 className="text-2xl font-semibold">{candidate.displayName}</h1>
          <p className="text-textSecondary">Inspect evidence before answering.</p>
        </header>

        <PlotCard
          title="Raw Light Curve"
          xLabel="Time"
          yLabel="Flux"
          data={[{ x: candidate.series.raw.map((p) => p.t), y: candidate.series.raw.map((p) => p.flux), type: 'scatter', mode: 'lines', line: { color: '#9B5CFF', width: 1.2 } }]}
        />

        <PlotCard
          title="Detrended Curve"
          xLabel="Time"
          yLabel="Flux"
          data={[{ x: candidate.series.detrended.map((p) => p.t), y: candidate.series.detrended.map((p) => p.flux), type: 'scatter', mode: 'lines', line: { color: '#4CC9F0', width: 1.4 } }]}
        />

        <PlotCard
          title="Phase-Folded Transit View"
          xLabel="Phase"
          yLabel="Flux"
          data={[
            { x: candidate.series.folded.map((p) => p.phase), y: candidate.series.folded.map((p) => p.flux), type: 'scatter', mode: 'markers', marker: { color: '#EAF1FF', size: 5, opacity: 0.65 } },
            { x: candidate.series.folded.map((p) => p.phase), y: candidate.series.folded.map((p) => p.bin ?? p.flux), type: 'scatter', mode: 'lines', line: { color: '#2DD4BF', width: 2 } },
          ]}
        />
      </section>

      <aside className="space-y-4">
        <div className="panel p-4">
          <h2 className="text-lg font-medium">Analysis checklist</h2>
          <ul className="mt-2 text-sm text-textSecondary list-disc list-inside space-y-1">
            <li>Confirm dips recur at approximately fixed intervals (period).</li>
            <li>Check whether dip depth remains reasonably consistent.</li>
            <li>Use folded view to verify one coherent transit-shaped trough.</li>
            <li>Validate with SNR and noise index before deciding.</li>
          </ul>
        </div>

        <div className="panel p-4 space-y-3">
          <h2 className="text-lg font-medium">Metrics</h2>
          <MetricCard label="Period" value={`${candidate.metrics.periodDays.toFixed(3)} d`} hint="Regular intervals support transit interpretation" />
          <MetricCard label="Depth" value={`${candidate.metrics.depthPpm} ppm`} hint="Consistent shallow dip is often transit-like" />
          <MetricCard label="Duration" value={`${candidate.metrics.durationHours.toFixed(1)} h`} hint="Stable duration across events is informative" />
          <MetricCard label="SNR" value={candidate.metrics.snr.toFixed(1)} hint="Higher SNR means more reliable signal" />
        </div>

        <VerdictControl candidate={candidate} />
      </aside>
    </main>
  );
}
