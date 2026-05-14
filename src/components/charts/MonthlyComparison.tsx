'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MetricRow {
  label: string;
  thisMonth: number | null;
  lastMonth: number | null;
}

interface Props {
  data: MetricRow[];
  height?: number;
}

export function MonthlyComparison({ data, height = 200 }: Props) {
  const filled = data.filter((d) => d.thisMonth != null || d.lastMonth != null);
  if (filled.length === 0) {
    return (
      <div style={{ padding: 24, color: '#5f8b66', fontSize: 14, fontStyle: 'italic' }}>
        Two months of data needed for this comparison.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height} aria-label="Monthly comparison chart" role="img">
      <BarChart data={filled} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid stroke="#dde9de" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" stroke="#8db99f" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#8db99f" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid rgba(122,158,126,0.2)',
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#5f8b66' }} iconType="circle" />
        <Bar dataKey="thisMonth" name="This month" fill="#7A9E7E" radius={[6, 6, 4, 4]} isAnimationActive animationDuration={900} />
        <Bar dataKey="lastMonth" name="Last month" fill="#B5CEB8" radius={[6, 6, 4, 4]} isAnimationActive animationDuration={900} animationBegin={150} />
      </BarChart>
    </ResponsiveContainer>
  );
}
