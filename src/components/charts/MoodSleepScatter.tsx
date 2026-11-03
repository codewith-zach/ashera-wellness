'use client';

import {
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Point {
  date: string;
  sleepHours: number | null;
  mood: number | null;
}

interface Props {
  data: Point[];
  height?: number;
}

function trendLine(pts: { x: number; y: number }[]) {
  if (pts.length < 3) return null;
  const n = pts.length;
  const sumX = pts.reduce((a, p) => a + p.x, 0);
  const sumY = pts.reduce((a, p) => a + p.y, 0);
  const sumXY = pts.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = pts.reduce((a, p) => a + p.x * p.x, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const m = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

export function MoodSleepScatter({ data, height = 260 }: Props) {
  const pts = data
    .filter((d): d is { date: string; sleepHours: number; mood: number } =>
      d.sleepHours != null && d.mood != null,
    )
    .map((d) => ({ x: d.sleepHours, y: d.mood, date: d.date }));

  const trend = trendLine(pts);
  const trendPts = trend
    ? [
        { x: 0, y: trend.b },
        { x: 12, y: trend.m * 12 + trend.b },
      ]
    : [];

  const insight = trend
    ? trend.m > 0.1
      ? 'Your mood tends to be higher when you sleep more — the connection is clear.'
      : trend.m < -0.05
        ? 'Your mood pattern is complex — sleep alone may not be the main driver right now.'
        : 'Your mood is fairly consistent regardless of sleep hours this period.'
    : null;

  if (pts.length < 5) {
    return (
      <div style={{ padding: 24, color: '#5f8b66', fontSize: 14, fontStyle: 'italic' }}>
        Log at least 5 entries with both mood and sleep data to see the scatter plot.
      </div>
    );
  }

  return (
    <div>
      <div aria-label="Mood vs Sleep scatter plot" role="img">
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: -16 }}>
            <CartesianGrid stroke="#dde9de" strokeDasharray="3 6" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 12]}
              name="Sleep"
              stroke="#8db99f"
              fontSize={11}
              tickLine={false}
            >
              <Label value="Sleep (hours)" position="bottom" offset={12} style={{ fill: '#5f8b66', fontSize: 12 }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              name="Mood"
              stroke="#8db99f"
              fontSize={11}
              tickLine={false}
            >
              <Label value="Mood" angle={-90} position="left" offset={20} style={{ fill: '#5f8b66', fontSize: 12 }} />
            </YAxis>
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#b5ceb8' }}
              contentStyle={{
                background: '#fff',
                border: '1px solid rgba(122,158,126,0.2)',
                borderRadius: 12,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
              }}
              formatter={(v: number, name: string) => [name === 'x' ? `${v}h` : `${v}/5`, name === 'x' ? 'Sleep' : 'Mood']}
            />
            <Scatter
              data={pts}
              fill="#7A9E7E"
              fillOpacity={0.75}
              stroke="#4A7050"
              strokeWidth={1}
              r={5}
              isAnimationActive
              animationDuration={800}
            />
            {trendPts.length > 0 && (
              <ReferenceLine
                stroke="#C9A96E"
                strokeWidth={2}
                strokeDasharray="6 3"
                segment={trendPts as [{ x: number; y: number }, { x: number; y: number }]}
                label={{
                  value: 'trend',
                  position: 'insideTopRight',
                  fill: '#C9A96E',
                  fontSize: 11,
                }}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {insight && (
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#5f8b66', fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>
          {insight}
        </p>
      )}
    </div>
  );
}
