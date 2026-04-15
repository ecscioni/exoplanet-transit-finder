import type { Candidate } from '@/lib/data/types';

export type ExplanationSections = {
  decisionSummary: string;
  evidenceSignals: string[];
  graphReadingGuide: string[];
  metricsInterpretation: string[];
  confidenceRationale: string;
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

  const evidenceSignals = likely
    ? [
        `Periodicity appears ${periodicity}, with recurring dips around every ${candidate.metrics.periodDays.toFixed(3)} days.`,
        `Depth near ${candidate.metrics.depthPpm} ppm stays comparatively stable across repeated events.`,
        'Phase-folded points align into a coherent transit-like valley rather than scattered random dips.',
      ]
    : [
        `Periodicity appears ${periodicity}, which is not strong enough for a robust transit claim.`,
        `Depth and shape vary too much relative to expected stable transit behavior (~${candidate.metrics.depthPpm} ppm target).`,
        'Phase-folded points do not condense into one clean transit trough, indicating likely non-transit structure.',
      ];

  const graphReadingGuide = [
    'Raw curve: first check whether dips are visible repeatedly and not only once.',
    'Detrended curve: verify whether dips survive baseline removal; real signals usually persist.',
    'Phase-folded view: this is the decisive panel—look for one consistent trough around a fixed phase.',
  ];

  const metricsInterpretation = [
    `SNR = ${candidate.metrics.snr.toFixed(1)}: ${candidate.metrics.snr >= 7 ? 'high enough to support trust in the observed pattern.' : 'relatively weak, so false-positive risk is higher.'}`,
    `Consistency score = ${candidate.metrics.consistencyScore.toFixed(2)}: ${periodicity === 'strong' ? 'timing/shape are repeatable.' : 'repeatability is limited or unstable.'}`,
    `Noise index = ${candidate.metrics.noiseIndex.toFixed(2)}: ${noise === 'low' ? 'noise is controlled, so morphology is easier to trust.' : noise === 'medium' ? 'moderate noise means caution is needed.' : 'high noise can mimic transit-like dips.'}`,
  ];

  return {
    decisionSummary: likely
      ? 'More likely to be an exoplanet candidate because the combined chart and metric evidence points to repeated, coherent transit behavior.'
      : 'Less likely to be an exoplanet candidate because periodic and morphological evidence is insufficient once noise and inconsistency are considered.',
    evidenceSignals,
    graphReadingGuide,
    metricsInterpretation,
    confidenceRationale: likely
      ? 'Confidence is driven by repeating structure + stable depth + coherent folded pattern, not by any single deep dip.'
      : 'Confidence against transit is driven by instability and noise across multiple panels, not by one isolated feature.',
    learningTakeaway: likely
      ? 'When raw/detrended/folded panels agree and metrics reinforce each other, a transit interpretation becomes credible.'
      : 'If panels disagree or folded structure is messy, prioritize caution even when one chart segment looks transit-like.',
  };
}
