import Link from 'next/link';
import { HeroUniverse } from '@/components/home/hero-universe';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stars px-6 py-12 md:py-16">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] items-center">
          <div className="space-y-6">
            <p className="text-accent uppercase tracking-[0.22em] text-xs">Mission Control</p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Exoplanet Transit Finder</h1>
            <p className="text-textSecondary text-lg leading-relaxed max-w-2xl">
              Explore a polished universe-inspired interface, open candidate stars, inspect transit evidence, and learn to distinguish true exoplanet-like signatures from false positives.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/explore" className="px-5 py-3 rounded-lg bg-accent text-slate-900 font-semibold hover:opacity-90">
                Begin Mission
              </Link>
              <Link href="/about" className="px-5 py-3 rounded-lg border border-slate-600 hover:border-accent">
                Learn the Method
              </Link>
              <Link href="/progress" className="px-5 py-3 rounded-lg border border-slate-600 hover:border-accent">
                View Progress
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-wider text-accent">Step 1</p>
                <p className="mt-1 text-sm text-textSecondary">Select a candidate star in the immersive field.</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-wider text-accent">Step 2</p>
                <p className="mt-1 text-sm text-textSecondary">Inspect raw, detrended, and folded evidence.</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-wider text-accent">Step 3</p>
                <p className="mt-1 text-sm text-textSecondary">Decide yes/no and learn exactly why.</p>
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-medium">What this app teaches</h2>
            <ul className="mt-3 space-y-2 text-sm text-textSecondary list-disc list-inside">
              <li>How periodic dips differ from random noise.</li>
              <li>How consistent depth and duration support a transit interpretation.</li>
              <li>How phase-folded plots expose or reject repeating structure.</li>
              <li>How signal-to-noise changes confidence in the verdict.</li>
            </ul>
          </div>
        </div>

        <HeroUniverse />
      </section>
    </main>
  );
}
