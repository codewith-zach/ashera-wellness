'use client';

import { Group, Stack, Text } from '@mantine/core';

interface Props {
  painCounts: Record<string, number>;
  maxCount?: number;
}

function opacity(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  return 0.25 + 0.6 * (count / max);
}

function PainRegion({
  area,
  count,
  max,
  d,
  label,
}: {
  area: string;
  count: number;
  max: number;
  d: string;
  label?: string;
}) {
  const fill = `rgba(212,130,122,${opacity(count, max)})`;
  return (
    <path
      d={d}
      fill={count > 0 ? fill : undefined}
      style={count > 0 ? undefined : { fill: 'var(--ashera-empty)' }}
      stroke="rgba(74,112,80,0.3)"
      strokeWidth={1}
      aria-label={`${area}: ${count} occurrence${count === 1 ? '' : 's'}`}
    >
      <title>{`${label ?? area}: ${count}`}</title>
    </path>
  );
}

export function PainBodyMap({ painCounts, maxCount }: Props) {
  const max = maxCount ?? Math.max(...Object.values(painCounts), 1);

  const regions = {
    Head: painCounts['Head'] ?? 0,
    Stomach: painCounts['Stomach'] ?? 0,
    'Lower back': painCounts['Lower back'] ?? 0,
    Pelvis: painCounts['Pelvis'] ?? 0,
    Joints: painCounts['Joints'] ?? 0,
  };

  const hasData = Object.values(regions).some((v) => v > 0);

  return (
    <Stack align="center" gap="md">
      <svg
        width="160"
        height="320"
        viewBox="0 0 160 320"
        role="img"
        aria-label="Body pain frequency map"
        style={{ overflow: 'visible' }}
      >
        {/* Body silhouette */}
        {/* Head */}
        <PainRegion
          area="Head"
          count={regions['Head']}
          max={max}
          d="M80 10 C60 10 46 24 46 44 C46 62 58 76 80 80 C102 76 114 62 114 44 C114 24 100 10 80 10 Z"
        />
        {/* Neck */}
        <path d="M68 78 L72 100 L88 100 L92 78 Z" style={{ fill: "var(--ashera-empty)" }} stroke="rgba(74,112,80,0.2)" strokeWidth={1} />
        {/* Torso / Stomach */}
        <PainRegion
          area="Stomach"
          count={regions['Stomach']}
          max={max}
          d="M50 100 C44 110 40 130 40 158 L120 158 C120 130 116 110 110 100 Z"
        />
        {/* Lower torso / Pelvis */}
        <PainRegion
          area="Pelvis"
          count={regions['Pelvis']}
          max={max}
          d="M40 158 L42 196 L118 196 L120 158 Z"
        />
        {/* Lower back (overlapping, shown on the sides) */}
        <PainRegion
          area="Lower back"
          count={regions['Lower back']}
          max={max}
          d="M40 160 L36 200 L44 200 L44 160 Z M116 160 L120 200 L124 200 L120 160 Z"
          label="Lower back"
        />
        {/* Left arm (Joints) */}
        <PainRegion
          area="Joints"
          count={regions['Joints']}
          max={max}
          d="M40 102 C32 102 24 118 22 148 L38 152 L46 118 Z"
          label="Joints (arms)"
        />
        {/* Right arm (Joints) */}
        <PainRegion
          area="Joints"
          count={regions['Joints']}
          max={max}
          d="M120 102 C128 102 136 118 138 148 L122 152 L114 118 Z"
          label="Joints (arms)"
        />
        {/* Left leg */}
        <path
          d="M56 196 L50 280 L68 280 L72 196 Z"
          style={{ fill: "var(--ashera-empty)" }}
          stroke="rgba(74,112,80,0.2)"
          strokeWidth={1}
        />
        {/* Right leg */}
        <path
          d="M104 196 L110 280 L92 280 L88 196 Z"
          style={{ fill: "var(--ashera-empty)" }}
          stroke="rgba(74,112,80,0.2)"
          strokeWidth={1}
        />
        {/* Left foot */}
        <path d="M50 280 L46 294 L70 294 L68 280 Z" style={{ fill: "var(--ashera-empty)" }} stroke="rgba(74,112,80,0.2)" strokeWidth={1} />
        {/* Right foot */}
        <path d="M92 280 L90 294 L114 294 L110 280 Z" style={{ fill: "var(--ashera-empty)" }} stroke="rgba(74,112,80,0.2)" strokeWidth={1} />
      </svg>

      {/* Legend */}
      <Group gap="lg" wrap="wrap" justify="center">
        {Object.entries(regions)
          .filter(([, v]) => v > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([area, count]) => (
            <Group key={area} gap={6}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: `rgba(212,130,122,${opacity(count, max)})`,
                  border: '1px solid rgba(212,130,122,0.4)',
                }}
              />
              <Text fz="xs" c="sage.6">
                {area} · {count}×
              </Text>
            </Group>
          ))}
        {!hasData && (
          <Text fz="sm" c="sage.6" fs="italic">
            No pain areas logged yet.
          </Text>
        )}
      </Group>
    </Stack>
  );
}
