'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs from 'dayjs';

interface Point {
  date: string;
  hours: number | null;
  quality: string | null;
}

const COLOR_BY_QUALITY: Record<string, string> = {
  Deep: '#4A7050',
  Good: '#7A9E7E',
  Fair: '#C9A96E',
  Poor: '#D4827A',
};

export function SleepBarChart({ data, height = 180 }: { data: Point[]; height?: number }) {
  const series = data.map((d) => ({
    ...d,
    label: dayjs(d.date).format('ddd'),
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <XAxis dataKey="label" stroke="#8db99f" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          domain={[0, 12]}
          ticks={[0, 4, 8, 12]}
          stroke="#8db99f"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(184,174,212,0.10)' }}
          contentStyle={{
            background: '#fff',
            border: '1px solid rgba(122,158,126,0.2)',
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
          labelFormatter={(label, payload) => {
            const date = payload?.[0]?.payload?.date;
            return date ? dayjs(date).format('ddd, D MMM') : label;
          }}
          formatter={(v: number, _name, p) => [
            `${v}h · ${p.payload.quality ?? '—'}`,
            'Sleep',
          ]}
        />
        <Bar dataKey="hours" radius={[8, 8, 4, 4]} isAnimationActive animationDuration={900}>
          {series.map((d, i) => (
            <Cell
              key={i}
              fill={COLOR_BY_QUALITY[d.quality ?? ''] ?? '#B5CEB8'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
