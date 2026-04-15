'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attempt } from '@/lib/data/types';

type AppState = {
  attempts: Attempt[];
  recordAttempt: (attempt: Attempt) => void;
  getAttempt: (id: string) => Attempt | undefined;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      attempts: [],
      recordAttempt: (attempt) =>
        set((state) => ({
          attempts: [...state.attempts.filter((a) => a.id !== attempt.id), attempt],
        })),
      getAttempt: (id) => get().attempts.find((a) => a.id === id),
    }),
    { name: 'exoplanet-transit-attempts' },
  ),
);
