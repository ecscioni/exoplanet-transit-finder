'use client';

import { motion } from 'framer-motion';

type Star = { id: number; x: number; y: number; size: number; delay: number; duration: number; opacity: number };

const stars: Star[] = Array.from({ length: 180 }).map((_, id) => ({
  id,
  x: (id * 37) % 100,
  y: (id * 61) % 100,
  size: 1 + (id % 3),
  delay: (id % 17) * 0.17,
  duration: 1.8 + (id % 7) * 0.35,
  opacity: 0.25 + (id % 5) * 0.14,
}));

export function HeroUniverse() {
  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border border-slate-700/80 bg-[#050914]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(76,201,240,0.22),transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(155,92,255,0.2),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(45,212,191,0.08),transparent_60%)]" />
      <div className="absolute -left-12 top-8 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute right-8 top-12 h-40 w-40 rounded-full bg-violet/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, opacity: star.opacity }}
            animate={{ opacity: [star.opacity * 0.55, star.opacity, star.opacity * 0.5], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, delay: star.delay, duration: star.duration, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050914] to-transparent" />

      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-accent text-xs uppercase tracking-[0.24em]">Immersive Exploration Layer</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold max-w-xl leading-tight">
              A cinematic universe view designed to spark curiosity before evidence-based reasoning.
            </h2>
          </div>
          <div className="hidden md:block rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-sm text-textSecondary max-w-xs">
            Not a physics simulator — a crafted interface that leads users into the transit learning loop.
          </div>
        </div>

        <div className="grid gap-2 text-sm text-textSecondary md:grid-cols-3">
          <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-2">Pulsing stars communicate interactivity and status.</div>
          <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-2">Subtle parallax-like depth from layered glows and motion.</div>
          <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-2">Transitions maintain emotional continuity into analysis.</div>
        </div>
      </div>
    </div>
  );
}
