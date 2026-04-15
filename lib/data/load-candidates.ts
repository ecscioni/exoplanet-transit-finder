import candidates from '@/public/data/candidates.json';
import type { Candidate } from './types';

export const allCandidates = candidates as Candidate[];

export function getCandidateById(id: string): Candidate | undefined {
  return allCandidates.find((c) => c.id === id);
}
