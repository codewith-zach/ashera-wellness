'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Item {
  name: string;
  value: number;
}

const PALETTE = [
  '#7A9E7E',
  '#B8AED4',
  '#C9A96E',
  '#E8C4B8',
  '#8db99f',
  '#9a91c0',
  '#efd4a0',
  '#d9a898',
  '#5f8b66',
  '#cac4e8',
];

export function SelfCareDonut({ data, height = 220 }: { data: Item[]; height?: number }) {
  const filtered = data.filter((d) => d.value > 0).slice(0, 10);
  if (filtered.length === 0) {
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
        Self-care data appears once you log a few entries.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="value"
          nameKey="name"
          innerRadius={56}
          outerRadius={88}
          paddingAngle={2}
          cornerRadius={4}
          isAnimationActive
          animationDuration={900}
        >
          {filtered.map((d, i) => (
            <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />
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
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#5f8b66' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
