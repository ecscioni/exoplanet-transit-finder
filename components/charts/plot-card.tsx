'use client';

import dynamic from 'next/dynamic';
import type { Layout, Data } from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  title: string;
  data: Data[];
  yLabel: string;
  xLabel: string;
};

export function PlotCard({ title, data, yLabel, xLabel }: Props) {
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
    <div className="card p-4">
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '280px' }}
        useResizeHandler
      />
    </div>
  );
}
