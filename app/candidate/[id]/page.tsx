import { notFound } from 'next/navigation';
import { getCandidateById } from '@/lib/data/load-candidates';
import { PlotCard } from '@/components/charts/plot-card';
import { MetricCard } from '@/components/metrics/metric-card';
import { VerdictControl } from '@/components/candidate/verdict-control';
import { getMetricInsights, getOverallInterpretation } from '@/lib/candidate-insights';

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) return notFound();
  const metricInsights = getMetricInsights(candidate);
  const interpretation = getOverallInterpretation(candidate);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <header className="observatory-shell overflow-hidden rounded-[1.8rem] border border-white/10 p-5 md:p-6">
          <p className="text-accent uppercase tracking-[0.24em] text-xs">Reasoning World</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">{candidate.displayName}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-textSecondary">
                Inspect the measured curves first, then use the statistics to judge whether the dimming pattern is periodic, repeatable, and strong enough to survive the surrounding noise.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-textSecondary">
              <p>Difficulty: <span className="text-white">{candidate.difficulty}</span></p>
              <p>Expected class: <span className="text-white">{candidate.groundTruth.class}</span></p>
            </div>
          </div>
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

        <section className="panel p-5 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">Interpretation Guide</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">What the statistics are telling the reader</h2>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-textSecondary">{interpretation}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-textSecondary">Deep Dive</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{candidate.explanations.deepDive}</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-textSecondary">Common Pitfall</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{candidate.explanations.commonPitfall}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {candidate.explanations.beginnerBullets.map((bullet) => (
              <div key={bullet} className="card p-4">
                <p className="text-sm leading-6 text-textSecondary">{bullet}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="space-y-4">
        <div className="panel p-4 space-y-3">
          <h2 className="text-lg font-medium">Metrics</h2>
          <p className="text-sm leading-6 text-textSecondary">
            These numbers should not be read as isolated badges. They work together to show cadence, size of the dip, event width, repeatability, and how much noise could be distorting the shape.
          </p>
          {metricInsights.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              hint={metric.hint}
              detail={metric.detail}
              band={metric.band}
            />
          ))}
        </div>

        <VerdictControl candidate={candidate} />
      </aside>
    </main>
  );
}
