/**
 * Phase-2 placeholder for AI-generated insights (PRD §6.6, real version is
 * Phase 4 with Anthropic API). These rule-based callouts surface a single
 * gentle observation per chart based on the user's actual data summary.
 */

interface MoodArgs {
  avgMood: number | null;
  avgEnergy: number | null;
  avgStress: number | null;
  count: number;
}

export function moodCallout({ avgMood, avgEnergy, avgStress, count }: MoodArgs): string | null {
  if (count < 3) return null;
  if (avgMood && avgMood >= 4) {
    return 'Your mood has been bright lately — note the practices showing up alongside it.';
  }
  if (avgStress && avgEnergy && avgStress > avgEnergy + 1) {
    return 'Stress is currently outweighing energy. A slow morning may be more healing than another to-do.';
  }
  if (avgMood && avgMood < 2.5) {
    return 'These have been heavier days. Rest is healing too — be tender with yourself.';
  }
  return 'A steady week. Steadiness is its own kind of progress.';
}

interface SleepArgs {
  avgHours: number | null;
  qualityDistribution: Record<string, number>;
  count: number;
}

export function sleepCallout({ avgHours, qualityDistribution, count }: SleepArgs): string | null {
  if (count < 3) return null;
  const total = Object.values(qualityDistribution).reduce((a, b) => a + b, 0);
  const deepRatio = total ? (qualityDistribution.Deep ?? 0) / total : 0;
  if (avgHours && avgHours >= 7.5 && deepRatio > 0.3) {
    return 'Your sleep is deep and generous — your nervous system is feeling the kindness.';
  }
  if (avgHours && avgHours < 6.5) {
    return `You're averaging ${avgHours}h of sleep — your body is asking for an earlier evening.`;
  }
  if (deepRatio < 0.15 && total >= 5) {
    return 'Most of your nights are landing in fair or good — what would invite a deeper kind of rest?';
  }
  return null;
}

interface SymptomArgs {
  ranked: { symptom: string; count: number }[];
  totalDays: number;
}

export function symptomCallout({ ranked, totalDays }: SymptomArgs): string | null {
  if (ranked.length === 0) {
    return totalDays >= 5
      ? "No symptoms logged yet — that's worth honouring 🌿"
      : null;
  }
  const top = ranked[0];
  if (top.count >= 3) {
    return `${top.symptom} has shown up ${top.count} time${top.count === 1 ? '' : 's'} — what tends to surround it?`;
  }
  return null;
}

interface SelfCareArgs {
  topSelfCare: string | null;
  count: number;
}

export function selfCareCallout({ topSelfCare, count }: SelfCareArgs): string | null {
  if (count < 3 || !topSelfCare) return null;
  return `${topSelfCare} is showing up most for you — that's the practice your body is reaching for.`;
}
