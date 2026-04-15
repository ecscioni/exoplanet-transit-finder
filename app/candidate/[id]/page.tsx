import { notFound } from 'next/navigation';
import { getCandidateById } from '@/lib/data/load-candidates';
import { PlotCard } from '@/components/charts/plot-card';
import { MetricCard } from '@/components/metrics/metric-card';
import { VerdictControl } from '@/components/candidate/verdict-control';

function metricBand(value: number, thresholds: { strong: number; moderate: number }, inverse = false) {
  if (!inverse) {
    if (value >= thresholds.strong) return 'strong';
    if (value >= thresholds.moderate) return 'moderate';
    return 'weak';
  }

  if (value <= thresholds.strong) return 'strong';
  if (value <= thresholds.moderate) return 'moderate';
  return 'weak';
}

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) return notFound();

  const snrBand = metricBand(candidate.metrics.snr, { strong: 8.5, moderate: 6 });
  const consistencyBand = metricBand(candidate.metrics.consistencyScore, { strong: 0.78, moderate: 0.58 });
  const noiseBand = metricBand(candidate.metrics.noiseIndex, { strong: 0.34, moderate: 0.58 }, true);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-[2fr_1fr] gap-4">
      <section className="space-y-4">
        <header className="panel p-4">
          <p className="text-accent uppercase tracking-widest text-xs">Reasoning World</p>
          <h1 className="text-2xl font-semibold">{candidate.displayName}</h1>
          <p className="text-textSecondary mt-1">Study each panel in order: observe the signal, inspect after detrending, then confirm periodic structure in folded phase.</p>
        </header>

        <PlotCard
          title="Raw Light Curve"
          xLabel="Time"
          yLabel="Flux"
          teachingTitle="What to look for"
          teachingBullets={[
            'Identify repeated downward dips rather than one isolated drop.',
            'Check whether the out-of-transit baseline stays relatively controlled.',
            'Ignore tiny one-point glitches unless they repeat with timing structure.',
          ]}
          data={[
            { x: candidate.series.raw.map((p) => p.t), y: candidate.series.raw.map((p) => p.flux), type: 'scatter', mode: 'lines', line: { color: '#9B5CFF', width: 1.2 } },
          ]}
        />

        <PlotCard
          title="Detrended Curve"
          xLabel="Time"
          yLabel="Flux"
          teachingTitle="How to interpret"
          teachingBullets={[
            'Confirm candidate dips survive after baseline trend removal.',
            'Look for clearer dip boundaries and more stable out-of-transit points.',
            'If dips disappear completely here, treat the signal as suspicious.',
          ]}
          data={[
            { x: candidate.series.detrended.map((p) => p.t), y: candidate.series.detrended.map((p) => p.flux), type: 'scatter', mode: 'lines', line: { color: '#4CC9F0', width: 1.4 } },
          ]}
        />

        <PlotCard
          title="Phase-Folded Transit View"
          xLabel="Phase"
          yLabel="Flux"
          teachingTitle="Decisive check"
          teachingBullets={[
            'A convincing transit forms one coherent trough at a stable phase.',
            'Widespread random depressions indicate noise or wrong period.',
            'Use this panel to test periodicity quality, not just dip depth.',
          ]}
          data={[
            { x: candidate.series.folded.map((p) => p.phase), y: candidate.series.folded.map((p) => p.flux), type: 'scatter', mode: 'markers', marker: { color: '#EAF1FF', size: 5, opacity: 0.65 } },
            { x: candidate.series.folded.map((p) => p.phase), y: candidate.series.folded.map((p) => p.bin ?? p.flux), type: 'scatter', mode: 'lines', line: { color: '#2DD4BF', width: 2 } },
          ]}
        />
      </section>

      <aside className="space-y-4">
        <div className="panel p-4">
          <h2 className="text-lg font-medium">Reasoning sequence</h2>
          <ol className="mt-2 text-sm text-textSecondary list-decimal list-inside space-y-1.5">
            <li>Find repeated dips in raw data.</li>
            <li>Verify dips remain visible in detrended data.</li>
            <li>Confirm folded coherence around one phase trough.</li>
            <li>Use metrics to raise or lower confidence.</li>
          </ol>
        </div>

        <div className="panel p-4 space-y-3">
          <h2 className="text-lg font-medium">Metric interpretation</h2>
          <MetricCard label="Period" value={`${candidate.metrics.periodDays.toFixed(3)} d`} hint="Periodic recurrence should be stable cycle-to-cycle." band="moderate" />
          <MetricCard label="Transit Depth" value={`${candidate.metrics.depthPpm} ppm`} hint="Depth should be visible above noise and remain fairly consistent." band="moderate" />
          <MetricCard label="Duration" value={`${candidate.metrics.durationHours.toFixed(1)} h`} hint="Repeated events should show similar in-transit duration." band="moderate" />
          <MetricCard label="SNR" value={candidate.metrics.snr.toFixed(1)} hint="Higher SNR supports that the dip is signal, not static." band={snrBand} />
          <MetricCard label="Consistency" value={candidate.metrics.consistencyScore.toFixed(2)} hint="Combines repeatability of timing, depth, and morphology." band={consistencyBand} />
          <MetricCard label="Noise Index" value={candidate.metrics.noiseIndex.toFixed(2)} hint="Lower values mean cleaner baseline and fewer false structures." band={noiseBand} />
        </div>

        <div className="panel p-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Worked example pattern</p>
          <h3 className="text-base font-medium">Example: TIC-4821-b? (teaching reference)</h3>
          <ul className="text-sm text-textSecondary list-disc list-inside space-y-1">
            <li>Three dips recur at ~6.2-day spacing after detrending.</li>
            <li>Folded panel shows a coherent trough without strong secondary dip.</li>
            <li>SNR near 9 and consistency near 0.8 support medium-high confidence.</li>
            <li>Verdict logic: plausible transit, but still flag for binary contamination checks.</li>
          </ul>
        </div>

        <VerdictControl candidate={candidate} />
      </aside>
    </main>
  );
}
