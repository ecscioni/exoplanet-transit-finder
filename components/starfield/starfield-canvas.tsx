'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Candidate } from '@/lib/data/types';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/app-store';

type FieldStar = {
  id: number;
  x: number;
  y: number;
  layer: number;
  size: number;
  opacity: number;
  hue: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function StarfieldCanvas({ candidates }: { candidates: Candidate[] }) {
  const [hovered, setHovered] = useState<Candidate | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const attempts = useAppStore((s) => s.attempts);

  const statusById = useMemo(() => new Map(attempts.map((a) => [a.id, a])), [attempts]);

  const ambientStars = useMemo<FieldStar[]>(() => {
    return Array.from({ length: 260 }).map((_, i) => {
      const layer = (i % 4) + 1;
      const jitterX = ((i * 67 + layer * 23) % 1000) / 10;
      const jitterY = ((i * 41 + layer * 19) % 1000) / 10;
      const depthFactor = 0.55 + layer * 0.18;
      return {
        id: i,
        x: jitterX,
        y: jitterY,
        layer,
        size: 0.55 + ((i * 13) % 100) / 100 * depthFactor,
        opacity: 0.18 + layer * 0.08 + ((i * 17) % 10) / 100,
        hue: i % 9 === 0 ? 42 : i % 7 === 0 ? 205 : 218,
      };
    });
  }, []);

  return (
    <div
      className="relative h-[78vh] w-full overflow-hidden rounded-2xl border border-slate-700/80 bg-stars-premium"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
      onMouseLeave={() => {
        setHovered(null);
        setCursor(null);
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-90">
        {ambientStars.map((star) => {
          const parallaxShiftX = cursor ? (cursor.x - 50) * (star.layer * 0.05) : 0;
          const parallaxShiftY = cursor ? (cursor.y - 50) * (star.layer * 0.04) : 0;

          return (
            <motion.span
              key={star.id}
              className="absolute rounded-full"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: star.opacity,
                backgroundColor: `hsl(${star.hue} 90% 94%)`,
                boxShadow:
                  star.layer >= 3
                    ? `0 0 ${2 + star.layer}px hsla(${star.hue} 85% 82% / 0.35)`
                    : 'none',
                transform: `translate(${parallaxShiftX}px, ${parallaxShiftY}px)`,
              }}
              animate={{
                opacity: [star.opacity * 0.82, star.opacity, star.opacity * 0.78],
              }}
              transition={{
                repeat: Infinity,
                duration: 7 + star.layer * 2 + (star.id % 5),
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(76,201,240,0.16),transparent_42%),radial-gradient(ellipse_at_76%_30%,rgba(155,92,255,0.14),transparent_42%),radial-gradient(ellipse_at_50%_120%,rgba(45,212,191,0.1),transparent_58%)]" />

      {candidates.map((candidate) => {
        const attempt = statusById.get(candidate.id);
        const completed = Boolean(attempt);
        const color = !completed ? 'rgba(234,241,255,0.95)' : attempt?.correct ? 'rgba(45,212,191,0.95)' : 'rgba(245,158,11,0.95)';

        const dist = cursor
          ? Math.hypot(candidate.starfield.x * 100 - cursor.x, candidate.starfield.y * 100 - cursor.y)
          : 999;
        const proximity = clamp(1 - dist / 22, 0, 1);
        const baseSize = 4.4 + candidate.starfield.size * 2.2;
        const dynamicSize = baseSize * (1 + proximity * 0.22);
        const glowStrength = 8 + candidate.starfield.zLayer * 5 + proximity * 12;

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
              className="block rounded-full"
              animate={{
                opacity: [0.78 + candidate.starfield.brightness * 0.2, 0.98, 0.76 + candidate.starfield.brightness * 0.2],
              }}
              transition={{ repeat: Infinity, duration: 4.2 + candidate.starfield.zLayer * 1.1, ease: 'easeInOut' }}
              style={{
                width: `${dynamicSize}px`,
                height: `${dynamicSize}px`,
                backgroundColor: color,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.12), 0 0 ${glowStrength}px rgba(173,220,255,${0.2 + proximity * 0.35})`,
                transition: 'width 180ms ease-out, height 180ms ease-out, box-shadow 200ms ease-out',
              }}
            />
          </Link>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06080F] to-transparent" />

      {hovered ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-5 left-5 max-w-sm panel p-4 text-sm"
        >
          <p className="text-accent uppercase tracking-widest text-xs">Candidate signal</p>
          <h3 className="text-lg font-semibold mt-1">{hovered.displayName}</h3>
          <p className="text-textSecondary">Difficulty: {hovered.difficulty}</p>
          <p className="text-textSecondary mt-1">Click to transition into the reasoning dashboard and inspect evidence.</p>
        </motion.div>
      ) : (
        <div className="absolute bottom-5 left-5 max-w-sm panel p-4 text-sm text-textSecondary">
          Move your cursor through the field to gently reveal nearby stars, then select a candidate to begin analysis.
        </div>
      )}
    </div>
  );
}
