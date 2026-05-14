'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Item {
  symptom: string;
  count: number;
}

export function SymptomBars({ data, height = 220 }: { data: Item[]; height?: number }) {
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
        No symptoms logged yet — that's a good sign 🌿
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data.slice(0, 8)}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 0, left: 12 }}
      >
        <XAxis
          type="number"
          stroke="#8db99f"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="symptom"
          stroke="#5f8b66"
          fontSize={12}
          width={100}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(212,130,122,0.08)' }}
          contentStyle={{
            background: '#fff',
            border: '1px solid rgba(122,158,126,0.2)',
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
        <Bar
          dataKey="count"
          fill="#D4827A"
          radius={[6, 6, 6, 6]}
          isAnimationActive
          animationDuration={900}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
