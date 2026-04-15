import type { Candidate } from '@/lib/data/types';

export type ExplanationSections = {
  decisionSummary: string;
  evidenceFor: string[];
  evidenceAgainst: string[];
  graphReadingGuide: string[];
  metricsInterpretation: string[];
  confidenceRationale: string;
  confidenceLabel: string;
  learningTakeaway: string;
};

function evaluatePeriodicity(candidate: Candidate) {
  const c = candidate.metrics.consistencyScore;
  if (c >= 0.75) return 'strong';
  if (c >= 0.5) return 'moderate';
  return 'weak';
}

function evaluateNoise(candidate: Candidate) {
  const n = candidate.metrics.noiseIndex;
  if (n <= 0.35) return 'low';
  if (n <= 0.6) return 'medium';
  return 'high';
}

export function buildExplanation(candidate: Candidate): ExplanationSections {
  const periodicity = evaluatePeriodicity(candidate);
  const noise = evaluateNoise(candidate);
  const likely = candidate.groundTruth.isExoplanet;

  const evidenceFor = [
    `Recurring features align near a period of ${candidate.metrics.periodDays.toFixed(3)} days (${periodicity} repeatability).`,
    `Observed depth (~${candidate.metrics.depthPpm} ppm) is coherent enough to track across events.`,
    candidate.metrics.snr >= 7
      ? `SNR ${candidate.metrics.snr.toFixed(1)} keeps the signal distinguishable from background scatter.`
      : `SNR ${candidate.metrics.snr.toFixed(1)} is modest, so confidence must rely on shape and periodic agreement too.`,
  ];

  const evidenceAgainst = [
    noise === 'high'
      ? 'Noise level is high; random fluctuations can imitate transit-like features.'
      : noise === 'medium'
        ? 'Moderate noise means shallow dip interpretations should stay cautious.'
        : 'Noise is comparatively controlled, reducing random false-dip risk.',
    periodicity === 'weak'
      ? 'Repeatability is weak, which strongly undermines transit confidence.'
      : 'Periodicity is not the only check—morphology and noise must still agree.',
    candidate.metrics.consistencyScore < 0.62
      ? 'Depth and/or duration vary enough to create a false-positive concern.'
      : 'Depth and duration stay reasonably consistent, supporting physical plausibility.',
  ];

  const graphReadingGuide = [
    'Raw curve: ask whether the dimming events recur at rough intervals, not just once.',
    'Detrended curve: confirm the same events remain after baseline correction.',
    'Folded view: treat this as the periodicity stress-test—one coherent trough is the target pattern.',
  ];

  const metricsInterpretation = [
    `Period ${candidate.metrics.periodDays.toFixed(3)} d and consistency ${candidate.metrics.consistencyScore.toFixed(2)} indicate ${periodicity} temporal reliability.`,
    `Duration ${candidate.metrics.durationHours.toFixed(1)} h should remain similar between events; inconsistency lowers trust quickly.`,
    `Noise index ${candidate.metrics.noiseIndex.toFixed(2)} is ${noise}, so confidence should be ${noise === 'high' ? 'conservative' : noise === 'medium' ? 'moderate' : 'less constrained by noise'}.`,
  ];

  const confidenceLabel = likely
    ? candidate.metrics.snr >= 8 && candidate.metrics.consistencyScore >= 0.75
      ? 'Medium-high confidence transit candidate'
      : 'Moderate confidence transit candidate'
    : 'Low confidence for transit interpretation';

  return {
    decisionSummary: likely
      ? 'Overall evidence leans toward a transit interpretation: periodicity and morphology align well enough to support a likely exoplanet verdict.'
      : 'Overall evidence does not support a robust transit interpretation once instability and noise are weighted together.',
    evidenceFor,
    evidenceAgainst,
    graphReadingGuide,
    metricsInterpretation,
    confidenceLabel,
    confidenceRationale: likely
      ? 'Confidence comes from multi-panel agreement (raw + detrended + folded) reinforced by acceptable metrics—not from one chart feature.'
      : 'Confidence against transit comes from inconsistent or noisy evidence across panels, even when isolated segments appear transit-like.',
    learningTakeaway: likely
      ? 'Strong reasoning means combining repeatability, shape coherence, and metric support before saying yes.'
      : 'If periodic structure is weak or unstable, the correct move is caution, even if one dip looks compelling.',
  };
}
