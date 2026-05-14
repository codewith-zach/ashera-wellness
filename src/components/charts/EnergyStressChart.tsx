'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs from 'dayjs';

interface Point {
  date: string;
  energy: number | null;
  stress: number | null;
}

export function EnergyStressChart({ data, height = 180 }: { data: Point[]; height?: number }) {
  const series = data.map((d) => ({ ...d, label: dayjs(d.date).format('ddd') }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
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
          }}
          labelFormatter={(label, payload) => {
            const date = payload?.[0]?.payload?.date;
            return date ? dayjs(date).format('ddd, D MMM') : label;
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: '#5f8b66', paddingTop: 4 }}
        />
        <Line
          type="monotone"
          name="Energy"
          dataKey="energy"
          stroke="#7A9E7E"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#7A9E7E' }}
          isAnimationActive
          animationDuration={900}
          connectNulls
        />
        <Line
          type="monotone"
          name="Stress"
          dataKey="stress"
          stroke="#D4827A"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#D4827A' }}
          isAnimationActive
          animationDuration={900}
          animationBegin={150}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
