'use client';

import { useMemo, useState } from 'react';
import type { Candidate } from '@/lib/data/types';
import { useAppStore } from '@/lib/store/app-store';
import { buildExplanation } from '@/lib/logic/explanation-engine';
import { useState } from 'react';
import type { Candidate } from '@/lib/data/types';
import { useAppStore } from '@/lib/store/app-store';

export function VerdictControl({ candidate }: { candidate: Candidate }) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const recordAttempt = useAppStore((s) => s.recordAttempt);

  const correct = selected === candidate.groundTruth.isExoplanet;
  const explanation = useMemo(() => buildExplanation(candidate), [candidate]);

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
      <div>
        <h3 className="text-lg font-medium">Is this an exoplanet?</h3>
        <p className="text-sm text-textSecondary mt-1">Commit to a verdict using the three charts and metrics before submitting.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSelected(true)} className={`rounded-lg p-2 border transition ${selected === true ? 'border-accent bg-accent/15 text-white' : 'border-slate-600 hover:border-accent/60'}`}>Yes, likely transit</button>
        <button onClick={() => setSelected(false)} className={`rounded-lg p-2 border transition ${selected === false ? 'border-accent bg-accent/15 text-white' : 'border-slate-600 hover:border-accent/60'}`}>No, likely not</button>
      </div>

      <button onClick={submit} disabled={selected === null || submitted} className="w-full rounded-lg bg-accent text-slate-900 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Submit Answer</button>

      {submitted ? (
        <div className={`space-y-3 card p-4 ${correct ? 'border-success/70' : 'border-warning/70'}`}>
          <div>
            <p className="font-semibold text-base">{correct ? 'Correct verdict' : 'Not quite — review the evidence logic'}</p>
            <p className="text-sm text-textSecondary mt-1">{explanation.decisionSummary}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent">Evidence signals</p>
            <ul className="mt-2 list-disc list-inside text-sm text-textSecondary space-y-1">
              {explanation.evidenceSignals.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent">How to read the charts</p>
            <ul className="mt-2 list-disc list-inside text-sm text-textSecondary space-y-1">
              {explanation.graphReadingGuide.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-accent">How to read the metrics</p>
            <ul className="mt-2 list-disc list-inside text-sm text-textSecondary space-y-1">
              {explanation.metricsInterpretation.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
            <p className="text-sm"><span className="font-semibold">Confidence rationale:</span> {explanation.confidenceRationale}</p>
            <p className="text-sm text-textSecondary mt-2"><span className="font-semibold text-textPrimary">Learning takeaway:</span> {explanation.learningTakeaway}</p>
            <p className="text-xs mt-2 text-textSecondary">Common pitfall: {candidate.explanations.commonPitfall}</p>
          </div>
        </div>
      ) : (
        <div className="card p-3 text-sm text-textSecondary">
          Tip: prioritize repeated dips at a stable interval and a coherent folded trough over isolated deep events.
        </div>
      )}
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
