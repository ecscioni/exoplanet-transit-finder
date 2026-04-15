import { allCandidates } from '@/lib/data/load-candidates';
import { StarfieldCanvas } from '@/components/starfield/starfield-canvas';

export default function ExplorePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div>
        <p className="text-accent uppercase tracking-widest text-xs">Exploration World</p>
        <h1 className="text-3xl font-semibold">Select a star to open evidence dashboard</h1>
      </div>
      <StarfieldCanvas candidates={allCandidates} />
    </main>
  );
}
