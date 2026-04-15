import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stars px-6 py-24">
      <section className="mx-auto max-w-6xl grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <p className="text-accent uppercase tracking-widest text-xs">Mission Interface</p>
          <h1 className="text-4xl md:text-6xl font-semibold">Exoplanet Transit Finder</h1>
          <p className="text-textSecondary text-lg leading-relaxed">
            Explore a stylized star field. Open candidate signals. Decide if each target is a likely exoplanet transit and learn why.
          </p>
          <div className="flex gap-3">
            <Link href="/explore" className="px-5 py-3 rounded-lg bg-accent text-slate-900 font-semibold hover:opacity-90">Begin Mission</Link>
            <Link href="/about" className="px-5 py-3 rounded-lg border border-slate-600 hover:border-accent">How It Works</Link>
          </div>
        </div>
        <div className="panel p-6 space-y-4">
          <h2 className="text-xl font-medium">Learning Loop</h2>
          <ol className="list-decimal list-inside text-textSecondary space-y-2">
            <li>Choose a candidate star.</li>
            <li>Inspect raw, detrended, and folded evidence.</li>
            <li>Answer yes/no.</li>
            <li>Receive evidence-based feedback and continue.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
