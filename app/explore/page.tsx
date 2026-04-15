import { allCandidates } from '@/lib/data/load-candidates';
import { StarfieldCanvas } from '@/components/starfield/starfield-canvas';

export default function ExplorePage() {
  const easyCount = allCandidates.filter((candidate) => candidate.difficulty === 'easy').length;
  const hardCount = allCandidates.filter((candidate) => candidate.difficulty === 'hard').length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <section className="observatory-shell overflow-hidden rounded-[2rem] border border-white/10 p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-accent uppercase tracking-[0.28em] text-xs">Exploration World</p>
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Survey a cinematic sky that feels astronomical, even when it is intentionally synthetic.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-textSecondary md:text-lg">
                Each point in this star page is a crafted visual proxy for a candidate target. The scene borrows cues from real stellar color, brightness falloff, and depth layering so the interface feels richer without pretending to be an actual sky map.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textSecondary">Targets</p>
              <p className="mt-2 text-3xl font-semibold text-white">{allCandidates.length}</p>
              <p className="mt-1 text-sm text-textSecondary">Synthetic survey locks ready to inspect.</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textSecondary">Easy Cases</p>
              <p className="mt-2 text-3xl font-semibold text-white">{easyCount}</p>
              <p className="mt-1 text-sm text-textSecondary">Clearer shapes with steadier evidence.</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-textSecondary">Hard Cases</p>
              <p className="mt-2 text-3xl font-semibold text-white">{hardCount}</p>
              <p className="mt-1 text-sm text-textSecondary">More ambiguity, more realism in the reasoning.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <StarfieldCanvas candidates={allCandidates} />
        <aside className="space-y-4">
          <div className="panel p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-accent">How To Read The Sky</p>
            <div className="mt-3 space-y-3 text-sm leading-6 text-textSecondary">
              <p>Brighter stars are presented with stronger halos, larger apparent discs, and slower parallax so the field feels layered rather than flat.</p>
              <p>Color is only suggestive. Warmer and cooler hues are used to imply spectral variety, not to claim physical accuracy for these exact targets.</p>
              <p>Green markers indicate a correct verdict you already reached. Amber markers show reviewed targets where your previous answer missed the evidence.</p>
            </div>
          </div>
          <div className="panel p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-accent">Selection Legend</p>
            <div className="mt-3 space-y-3 text-sm text-textSecondary">
              <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-accent shadow-glow" />Unreviewed candidate</div>
              <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-success shadow-glow" />Previously answered correctly</div>
              <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-warning shadow-glow" />Previously answered incorrectly</div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
