'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Candidate } from '@/lib/data/types';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/app-store';

export function StarfieldCanvas({ candidates }: { candidates: Candidate[] }) {
  const [hovered, setHovered] = useState<Candidate | null>(null);
  const attempts = useAppStore((s) => s.attempts);

  const statusById = useMemo(() => new Map(attempts.map((a) => [a.id, a])), [attempts]);

  return (
    <div className="relative h-[78vh] w-full overflow-hidden rounded-2xl border border-slate-700 bg-stars">
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              top: `${(i * 37) % 100}%`,
              left: `${(i * 73) % 100}%`,
              opacity: 0.25 + ((i % 7) * 0.08),
            }}
          />
        ))}
      </div>

      {candidates.map((candidate) => {
        const attempt = statusById.get(candidate.id);
        const completed = Boolean(attempt);
        const color = !completed ? 'bg-accent' : attempt?.correct ? 'bg-success' : 'bg-warning';

        return (
          <Link
            key={candidate.id}
            href={`/candidate/${candidate.id}`}
            onMouseEnter={() => setHovered(candidate)}
            onMouseLeave={() => setHovered(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${candidate.starfield.x * 100}%`, top: `${candidate.starfield.y * 100}%` }}
          >
            <motion.span
              className={`block rounded-full ${color} shadow-glow`}
              animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 2.4 + candidate.starfield.zLayer * 0.3 }}
              style={{ width: `${8 + candidate.starfield.size * 4}px`, height: `${8 + candidate.starfield.size * 4}px` }}
            />
          </Link>
        );
      })}

      {hovered ? (
        <div className="absolute bottom-5 left-5 max-w-sm panel p-4 text-sm">
          <p className="text-accent uppercase tracking-widest text-xs">Candidate</p>
          <h3 className="text-lg font-semibold">{hovered.displayName}</h3>
          <p className="text-textSecondary">Difficulty: {hovered.difficulty}</p>
          <p className="text-textSecondary">Click to inspect transit evidence and decide.</p>
        </div>
      ) : null}
    </div>
  );
}
