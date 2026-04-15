import type { Candidate } from '@/lib/data/types';

export type MetricInsight = {
  label: string;
  value: string;
  hint: string;
  detail: string;
  band: string;
};

function describeSNR(snr: number) {
  if (snr >= 10) return 'high-confidence';
  if (snr >= 7) return 'workable';
  return 'fragile';
}

function describeConsistency(score: number) {
  if (score >= 0.8) return 'very repeatable';
  if (score >= 0.6) return 'moderately repeatable';
  if (score >= 0.4) return 'mixed';
  return 'poorly repeatable';
}

function describeNoise(noise: number) {
  if (noise <= 0.25) return 'quiet';
  if (noise <= 0.45) return 'manageable';
  if (noise <= 0.65) return 'noisy';
  return 'very noisy';
}

function spectralLabel(hue: number) {
  if (hue <= 45) return 'K-type inspired glow';
  if (hue <= 120) return 'G-type inspired glow';
  if (hue <= 210) return 'F-type inspired glow';
  return 'A-type inspired glow';
}

export function getMetricInsights(candidate: Candidate): MetricInsight[] {
  const { periodDays, depthPpm, durationHours, snr, consistencyScore, noiseIndex } = candidate.metrics;
  const depthPercent = depthPpm / 10000;

  return [
    {
      label: 'Period',
      value: `${periodDays.toFixed(3)} d`,
      hint: 'Measures how often the dip repeats.',
      detail:
        periodDays < 4
          ? 'This is a short cadence signal, so the observing window should contain multiple repeated events. Repetition is one of the strongest clues that the dip is orbital rather than a one-off instrumental glitch.'
          : 'This is a longer cadence signal, so each repeated event matters more. When periods stretch out, false alarms become easier to misread because there are fewer opportunities to confirm a stable rhythm.',
      band: periodDays < 4 ? 'Short-period candidate' : 'Longer-period candidate',
    },
    {
      label: 'Depth',
      value: `${depthPpm} ppm`,
      hint: 'Approximates how much starlight is blocked at mid-transit.',
      detail: `A depth of ${depthPpm} ppm is about ${depthPercent.toFixed(
        2
      )}% of the star's light. In transit work, depth is useful because genuine planets usually make a shallow, repeatable loss of light, while stellar variability often creates broader or less stable drops.`,
      band: depthPpm < 1500 ? 'Subtle dip' : depthPpm < 3000 ? 'Moderate dip' : 'Pronounced dip',
    },
    {
      label: 'Duration',
      value: `${durationHours.toFixed(1)} h`,
      hint: 'Tracks how long the target stays dim during each event.',
      detail:
        durationHours <= 3
          ? 'This is a compact event. Short, clean dips can be very planet-like when they recur at the same width and phase.'
          : durationHours <= 7
            ? 'This duration sits in a moderate range, which is often easier to inspect because the dip is long enough to resolve but not so broad that it blends into slow stellar trends.'
            : 'This is a broad event. Long durations are not wrong by themselves, but they deserve extra scrutiny because systematics and grazing eclipses can also look wide.',
      band: durationHours <= 3 ? 'Brief transit window' : durationHours <= 7 ? 'Mid-length transit window' : 'Extended transit window',
    },
    {
      label: 'SNR',
      value: snr.toFixed(1),
      hint: 'Signal-to-noise ratio estimates how strongly the dip rises above scatter.',
      detail: `This candidate lands in the ${describeSNR(
        snr
      )} range. Higher SNR means the dip stands out from background variation more cleanly, so the measured shape and depth are less likely to be dominated by noise.`,
      band: snr >= 10 ? 'Strong detection' : snr >= 7 ? 'Usable detection' : 'Borderline detection',
    },
    {
      label: 'Consistency',
      value: `${Math.round(consistencyScore * 100)}%`,
      hint: 'Scores how similar repeated events look after folding.',
      detail: `A ${Math.round(
        consistencyScore * 100
      )}% consistency score suggests the events are ${describeConsistency(
        consistencyScore
      )}. This matters because real transits should line up in phase with comparable depth and width instead of wandering from event to event.`,
      band: consistencyScore >= 0.75 ? 'Stable pattern' : consistencyScore >= 0.5 ? 'Mixed pattern' : 'Unstable pattern',
    },
    {
      label: 'Noise Index',
      value: `${Math.round(noiseIndex * 100)}%`,
      hint: 'Represents how contaminated the light curve is by scatter or structure.',
      detail: `The light curve looks ${describeNoise(
        noiseIndex
      )} by this score. Lower noise helps because transit interpretation depends on seeing the same small shape repeatedly; high noise can manufacture fake dips or hide real ones.`,
      band: noiseIndex <= 0.3 ? 'Clean baseline' : noiseIndex <= 0.55 ? 'Some contamination' : 'Heavy contamination',
    },
  ];
}

export function getCandidateSceneNotes(candidate: Candidate) {
  const { brightness, hue, zLayer, size } = candidate.starfield;
  const brightnessPct = Math.round(brightness * 100);

  return {
    spectral: spectralLabel(hue),
    scene: zLayer === 1 ? 'foreground beacon' : zLayer === 2 ? 'mid-field anchor' : 'background ember',
    appearance:
      size > 1.3
        ? 'Rendered as a larger target to make it feel like a bright survey lock.'
        : 'Rendered as a tighter point source to preserve the illusion of distance.',
    brightnessLabel: `Synthetic brightness ${brightnessPct}%`,
  };
}

export function getOverallInterpretation(candidate: Candidate) {
  const { snr, consistencyScore, noiseIndex } = candidate.metrics;
  const pull =
    consistencyScore - noiseIndex + (candidate.groundTruth.isExoplanet ? 0.15 : -0.05) + snr / 20;

  if (pull >= 0.9) {
    return 'The metrics lean toward a coherent repeating transit signature. The main reason is that repeatability stays ahead of background noise instead of being overwhelmed by it.';
  }

  if (pull >= 0.55) {
    return 'The evidence is plausible but not automatic. Readers should check whether the folded shape remains stable, because that is where a merely interesting dip becomes a believable transit candidate.';
  }

  return 'The metrics lean suspicious. The weakest link is not a single number but the combination of scatter, weak repeatability, and a shape that may not survive closer inspection.';
}
