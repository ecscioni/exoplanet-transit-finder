'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Candidate } from '@/lib/data/types';
import { useAppStore } from '@/lib/store/app-store';
import { getCandidateSceneNotes } from '@/lib/candidate-insights';

type AmbientStar = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
};

export function StarfieldCanvas({ candidates }: { candidates: Candidate[] }) {
  const [hovered, setHovered] = useState<Candidate | null>(null);
  const attempts = useAppStore((s) => s.attempts);

  const statusById = useMemo(() => new Map(attempts.map((a) => [a.id, a])), [attempts]);

  const ambientStars = useMemo<AmbientStar[]>(
    () =>
      Array.from({ length: 220 }, (_, i) => ({
        id: i,
        left: (i * 19.7) % 100,
        top: (i * 11.9 + (i % 9) * 4.8) % 100,
        size: 1 + (i % 4) * 0.7,
        opacity: 0.14 + (i % 7) * 0.08,
      })),
    []
  );

  const guideStars = useMemo(
    () =>
      [...candidates]
        .sort((a, b) => b.starfield.brightness - a.starfield.brightness)
        .slice(0, 8)
        .sort((a, b) => a.starfield.x - b.starfield.x),
    [candidates]
  );

  const constellationSegments = useMemo(
    () =>
      guideStars.slice(0, -1).map((candidate, index) => ({
        id: `${candidate.id}-${guideStars[index + 1].id}`,
        x1: candidate.starfield.x * 100,
        y1: candidate.starfield.y * 100,
        x2: guideStars[index + 1].starfield.x * 100,
        y2: guideStars[index + 1].starfield.y * 100,
      })),
    [guideStars]
  );

  return (
    <div className="relative min-h-[78vh] overflow-hidden rounded-[2rem] border border-white/10 bg-stars shadow-[0_30px_120px_rgba(1,6,20,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(52,211,235,0.2),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(244,114,182,0.16),transparent_26%),radial-gradient(circle_at_58%_74%,rgba(45,212,191,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-white/5 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-60">
        {ambientStars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              boxShadow: '0 0 12px rgba(255,255,255,0.24)',
            }}
          />
        ))}
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
        {constellationSegments.map((segment) => (
          <line
            key={segment.id}
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
            stroke="rgba(176, 223, 255, 0.35)"
            strokeWidth="0.12"
            strokeDasharray="0.75 0.6"
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_18%,transparent_82%,rgba(255,255,255,0.03))]" />

      {candidates.map((candidate) => {
        const attempt = statusById.get(candidate.id);
        const completed = Boolean(attempt);
        const color = !completed ? '#4CC9F0' : attempt?.correct ? '#2DD4BF' : '#F59E0B';
        const size = 10 + candidate.starfield.size * 9;
        const halo = 18 + candidate.starfield.brightness * 28;

        return (
          <Link
            key={candidate.id}
            href={`/candidate/${candidate.id}`}
            onMouseEnter={() => setHovered(candidate)}
            onMouseLeave={() => setHovered(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${candidate.starfield.x * 100}%`, top: `${candidate.starfield.y * 100}%` }}
            aria-label={`Open ${candidate.displayName}`}
          >
            <motion.span
              className="relative block rounded-full"
              animate={{ scale: [1, 1.06 + candidate.starfield.brightness * 0.05, 1], opacity: [0.82, 1, 0.82] }}
              transition={{ repeat: Infinity, duration: 2.8 + candidate.starfield.zLayer * 0.45, ease: 'easeInOut' }}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.96) 0%, hsla(${candidate.starfield.hue}, 95%, 78%, 0.96) 42%, ${color} 75%, rgba(255,255,255,0) 100%)`,
                boxShadow: `0 0 ${halo}px ${color}, 0 0 ${halo * 2.2}px rgba(255,255,255,0.18)`,
              }}
            >
              <span
                className="absolute inset-1 rounded-full border border-white/25"
                style={{ boxShadow: `0 0 12px hsla(${candidate.starfield.hue}, 95%, 78%, 0.35)` }}
              />
              <span
                className="absolute rounded-full border border-white/10"
                style={{
                  inset: `${-candidate.starfield.brightness * 8 - 5}px`,
                  opacity: 0.35,
                }}
              />
            </motion.span>
          </Link>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#04070f] via-[#04070f]/60 to-transparent" />

      <div className="absolute left-5 top-5 max-w-sm rounded-2xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">Survey Deck</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-white">Candidate sky map</h2>
        <p className="mt-2 text-sm leading-6 text-textSecondary">
          Hover a target to inspect the fake-realistic rendering notes, then open its evidence dashboard to judge whether the repeated dimming behaves like a transit.
        </p>
      </div>

      {hovered ? (
        <div className="absolute bottom-5 left-5 max-w-md rounded-[1.6rem] border border-white/10 bg-slate-950/72 p-5 text-sm shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Candidate Focus</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">{hovered.displayName}</h3>
              <p className="mt-1 text-textSecondary">Difficulty: {hovered.difficulty}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-textSecondary">
              {hovered.groundTruth.class === 'transit' ? 'Transit-like pattern' : 'False-positive style'}
            </span>
          </div>
          {(() => {
            const notes = getCandidateSceneNotes(hovered);

            return (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="glass-card rounded-2xl p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-textSecondary">Rendered Appearance</p>
                  <p className="mt-2 text-sm text-slate-100">{notes.spectral}</p>
                  <p className="mt-1 text-xs leading-5 text-textSecondary">{notes.appearance}</p>
                </div>
                <div className="glass-card rounded-2xl p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-textSecondary">Scene Placement</p>
                  <p className="mt-2 text-sm text-slate-100">{notes.scene}</p>
                  <p className="mt-1 text-xs leading-5 text-textSecondary">{notes.brightnessLabel}</p>
                </div>
              </div>
            );
          })()}
          <p className="mt-4 text-xs leading-5 text-textSecondary">
            This visual treatment is intentionally illustrative. It borrows cinematic cues from astrophotography while staying separate from the measured transit evidence.
          </p>
        </div>
      ) : null}
    </div>
  );
}
