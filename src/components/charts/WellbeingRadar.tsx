'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface BalanceAxis {
  axis: string;
  score: number | null;
}

/**
 * Wellbeing balance radar — each axis is the last 30 days normalised to
 * 0–100%, so the shape shows which dimensions of care are thriving and
 * which are asking for attention.
 */
export function WellbeingRadar({ data, height = 280 }: { data: BalanceAxis[]; height?: number }) {
  const hasData = data.some((d) => d.score != null);
  if (!hasData) {
    return (
      <div
        style={{ height }}
        role="img"
        aria-label="Wellbeing balance — not enough entries yet"
      >
        <span
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7A9E7E',
            fontSize: 14,
            fontStyle: 'italic',
            fontFamily: 'Playfair Display, serif',
          }}
        >
          Log a few days to see your balance take shape
        </span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="62%" aria-label="Wellbeing balance radar">
        <PolarGrid stroke="#dde9de" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: '#7A9E7E', fontSize: 11 }} tickLine={false} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid rgba(122,158,126,0.2)',
            borderRadius: 12,
            fontFamily: 'DM Sans, sans-serif',
            color: '#3a5a3f',
          }}
          formatter={(v: number) => [`${v}%`, 'Balance']}
        />
        <Radar
          dataKey="score"
          stroke="#4A7050"
          strokeWidth={2}
          fill="#7A9E7E"
          fillOpacity={0.32}
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
