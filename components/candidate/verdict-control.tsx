'use client';

import { useState } from 'react';
import type { Candidate } from '@/lib/data/types';
import { useAppStore } from '@/lib/store/app-store';

export function VerdictControl({ candidate }: { candidate: Candidate }) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const recordAttempt = useAppStore((s) => s.recordAttempt);

  const correct = selected === candidate.groundTruth.isExoplanet;

  const submit = () => {
    if (selected === null) return;
    setSubmitted(true);
    recordAttempt({
      id: candidate.id,
      userAnswer: selected,
      correct,
      answeredAt: new Date().toISOString(),
    });
  };

  return (
    <div className="panel p-4 space-y-4">
      <h3 className="text-lg font-medium">Is this an exoplanet?</h3>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSelected(true)} className={`rounded-lg p-2 border ${selected === true ? 'border-accent bg-accent/15' : 'border-slate-600'}`}>Yes</button>
        <button onClick={() => setSelected(false)} className={`rounded-lg p-2 border ${selected === false ? 'border-accent bg-accent/15' : 'border-slate-600'}`}>No</button>
      </div>
      <button onClick={submit} disabled={selected === null || submitted} className="w-full rounded-lg bg-accent text-slate-900 py-2 font-semibold disabled:opacity-50">Submit Answer</button>

      {submitted ? (
        <div className={`card p-3 ${correct ? 'border-success/70' : 'border-warning/70'}`}>
          <p className="font-semibold">{correct ? 'Correct' : 'Not quite'}</p>
          <p className="text-sm text-textSecondary mt-1">{candidate.explanations.conciseVerdict}</p>
          <ul className="mt-2 list-disc list-inside text-sm text-textSecondary space-y-1">
            {candidate.explanations.beginnerBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
          <p className="text-xs mt-2 text-textSecondary">Common pitfall: {candidate.explanations.commonPitfall}</p>
        </div>
      ) : null}
    </div>
  );
}
