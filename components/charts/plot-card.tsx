'use client';

import dynamic from 'next/dynamic';
import type { Layout, Data } from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  title: string;
  data: Data[];
  yLabel: string;
  xLabel: string;
  teachingTitle?: string;
  teachingBullets?: string[];
};

export function PlotCard({ title, data, yLabel, xLabel, teachingTitle, teachingBullets }: Props) {
  const layout: Partial<Layout> = {
    title: { text: title, font: { color: '#EAF1FF', size: 16 } },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(20,27,45,0.45)',
    margin: { l: 50, r: 16, t: 42, b: 42 },
    xaxis: { title: xLabel, gridcolor: 'rgba(168,182,214,0.18)', color: '#A8B6D6' },
    yaxis: { title: yLabel, gridcolor: 'rgba(168,182,214,0.18)', color: '#A8B6D6' },
    font: { color: '#EAF1FF' },
  };

  return (
    <div className="card p-4 space-y-3">
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '280px' }}
        useResizeHandler
      />

      {teachingBullets?.length ? (
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/45 p-3">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">{teachingTitle ?? 'What to look for'}</p>
          <ul className="mt-2 text-sm text-textSecondary list-disc list-inside space-y-1">
            {teachingBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
