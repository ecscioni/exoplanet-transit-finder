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
    title: { text: title, font: { color: '#F4F7FF', size: 17 } },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(12,18,32,0.72)',
    margin: { l: 52, r: 18, t: 48, b: 44 },
    xaxis: {
      title: xLabel,
      gridcolor: 'rgba(168,182,214,0.12)',
      zerolinecolor: 'rgba(168,182,214,0.16)',
      color: '#B4C3E5',
    },
    yaxis: {
      title: yLabel,
      gridcolor: 'rgba(168,182,214,0.12)',
      zerolinecolor: 'rgba(168,182,214,0.16)',
      color: '#B4C3E5',
    },
    font: { color: '#EAF1FF' },
  };

  return (
    <div className="card plot-frame p-4">
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '320px' }}
        useResizeHandler
      />
    </div>
  );
}
