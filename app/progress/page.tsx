'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store/app-store';

export default function ProgressPage() {
  const attempts = useAppStore((s) => s.attempts);
  const stats = useMemo(() => {
    const total = attempts.length;
    const correct = attempts.filter((a) => a.correct).length;
    return { total, correct, acc: total ? Math.round((correct / total) * 100) : 0 };
  }, [attempts]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-4">
      <h1 className="text-3xl font-semibold">Progress</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="panel p-4"><p className="text-textSecondary">Cases Attempted</p><p className="text-3xl font-semibold">{stats.total}</p></div>
        <div className="panel p-4"><p className="text-textSecondary">Correct</p><p className="text-3xl font-semibold">{stats.correct}</p></div>
        <div className="panel p-4"><p className="text-textSecondary">Accuracy</p><p className="text-3xl font-semibold">{stats.acc}%</p></div>
      </div>
    </main>
  );
}
