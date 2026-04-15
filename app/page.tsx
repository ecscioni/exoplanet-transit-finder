import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-20 md:py-24">
      <section className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="observatory-shell overflow-hidden rounded-[2rem] border border-white/10 p-8 md:p-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-accent uppercase tracking-[0.28em] text-xs">Mission Interface</p>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">Exoplanet Transit Finder</h1>
            <p className="text-lg leading-8 text-textSecondary">
              Read transit evidence like an observer, not a button clicker. Explore a cinematic synthetic sky, open a target, and decide whether the dimming pattern behaves like a real exoplanet transit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/explore" className="rounded-xl bg-accent px-5 py-3 font-semibold text-slate-900 transition hover:opacity-90">Begin Mission</Link>
              <Link href="/about" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-white transition hover:border-accent">How It Works</Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">Learning Loop</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-textSecondary">
              <li>Choose a candidate star from the survey field.</li>
              <li>Inspect raw, detrended, and folded evidence.</li>
              <li>Read the metrics in context instead of treating them like isolated badges.</li>
              <li>Submit a verdict and compare your reasoning with the explanation.</li>
            </ol>
          </div>
          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-accent">What Changed</p>
            <p className="mt-3 text-sm leading-6 text-textSecondary">
              The visuals are intentionally dramatic, but the reasoning flow is now more explicit. Readers get better guidance on period, depth, duration, signal strength, repeatability, and noise before they commit to an answer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
