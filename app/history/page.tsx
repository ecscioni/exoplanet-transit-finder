'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store/app-store';

export default function HistoryPage() {
  const attempts = useAppStore((s) => s.attempts);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-4">
      <h1 className="text-3xl font-semibold">Case History</h1>
      <div className="space-y-2">
        {attempts.length === 0 ? <p className="text-textSecondary">No attempts yet.</p> : null}
        {attempts.map((a) => (
          <div key={a.id} className="panel p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{a.id}</p>
              <p className="text-sm text-textSecondary">Your answer: {a.userAnswer ? 'Yes' : 'No'} · {a.correct ? 'Correct' : 'Incorrect'}</p>
            </div>
            <Link href={`/candidate/${a.id}`} className="text-accent">Review</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
