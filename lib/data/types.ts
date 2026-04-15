export type SeriesPoint = { t: number; flux: number };
export type FoldedPoint = { phase: number; flux: number; bin?: number };

export type Candidate = {
  id: string;
  displayName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starfield: {
    x: number;
    y: number;
    zLayer: number;
    size: number;
    brightness: number;
    hue: number;
    selectable: boolean;
  };
  groundTruth: {
    isExoplanet: boolean;
    class: 'transit' | 'false_positive';
  };
  series: {
    raw: SeriesPoint[];
    detrended: SeriesPoint[];
    folded: FoldedPoint[];
  };
  metrics: {
    periodDays: number;
    depthPpm: number;
    durationHours: number;
    snr: number;
    consistencyScore: number;
    noiseIndex: number;
  };
  precomputedTags: string[];
  explanations: {
    conciseVerdict: string;
    beginnerBullets: string[];
    deepDive: string;
    commonPitfall: string;
  };
};

export type Attempt = {
  id: string;
  userAnswer: boolean;
  correct: boolean;
  answeredAt: string;
};
