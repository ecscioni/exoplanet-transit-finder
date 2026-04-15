export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <h1 className="text-3xl font-semibold">How this app works</h1>
      <div className="panel p-6 space-y-3 text-textSecondary">
        <p>The star field is stylized and intentionally artistic.</p>
        <p>The scientific learning happens in the evidence dashboard:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Raw light curve shows original signal and noise.</li>
          <li>Detrended curve removes slow baseline drift.</li>
          <li>Phase-folded view checks for repeated transit shape.</li>
        </ul>
        <p>After a yes/no decision, the app explains the reasoning using periodicity, consistency, and noise indicators.</p>
      </div>
    </main>
  );
}
