'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAppStore } from '@/lib/store/app-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const attempts = useAppStore((s) => s.attempts);
  const score = useMemo(() => {
    if (!attempts.length) return '0/0';
    const correct = attempts.filter((a) => a.correct).length;
    return `${correct}/${attempts.length}`;
  }, [attempts]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-bg/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">Exoplanet Transit Finder</Link>
          <nav className="flex gap-4 text-sm text-textSecondary">
            <Link href="/explore">Explore</Link>
            <Link href="/progress">Progress</Link>
            <Link href="/history">History</Link>
            <Link href="/about">About</Link>
          </nav>
          <div className="text-xs rounded-full px-3 py-1 border border-slate-700">Accuracy {score}</div>
        </div>
      </header>
      {children}
    </div>
  );
}
