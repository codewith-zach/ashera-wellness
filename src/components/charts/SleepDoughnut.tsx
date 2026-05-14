'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  distribution: Record<string, number>;
  height?: number;
}

const ORDER = ['Deep', 'Good', 'Fair', 'Poor'];
const COLORS: Record<string, string> = {
  Deep: '#4A7050',
  Good: '#7A9E7E',
  Fair: '#C9A96E',
  Poor: '#D4827A',
};

export function SleepDoughnut({ distribution, height = 180 }: Props) {
  const data = ORDER.map((q) => ({ name: q, value: distribution[q] ?? 0 })).filter(
    (d) => d.value > 0,
  );
  if (data.length === 0) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5f8b66',
          fontSize: 13,
        }}
      >
        No sleep data yet.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          cornerRadius={6}
          isAnimationActive
          animationDuration={900}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={COLORS[d.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid rgba(122,158,126,0.2)',
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
