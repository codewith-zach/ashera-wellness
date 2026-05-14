'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs from 'dayjs';

interface Point {
  date: string;
  mood: number | null;
}

export function MoodSparkline({ data, height = 160 }: { data: Point[]; height?: number }) {
  const filled = data.map((d) => ({
    ...d,
    label: dayjs(d.date).format('ddd'),
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={filled}
        margin={{ top: 8, right: 8, bottom: 0, left: -24 }}
        aria-label="Mood trend chart"
        role="img"
      >
        <defs>
          <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7A9E7E" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#7A9E7E" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#dde9de" strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" stroke="#8db99f" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 3, 5]}
          stroke="#8db99f"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid rgba(122,158,126,0.2)',
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
            color: '#3a5a3f',
          }}
          labelFormatter={(label, payload) => {
            const date = payload?.[0]?.payload?.date;
            return date ? dayjs(date).format('ddd, D MMM') : label;
          }}
          formatter={(v: number) => [v?.toFixed?.(1) ?? v, 'Mood']}
        />
        <Area
          type="monotone"
          dataKey="mood"
          stroke="#4A7050"
          strokeWidth={2.5}
          fill="url(#moodFill)"
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
