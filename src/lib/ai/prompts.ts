/**
 * Prompt builders for each insights section.
 * Each returns a 1–2 sentence compassionate observation — never clinical,
 * never demanding. Written as a gentle wellness coach per PRD §2.5.
 */

const SYSTEM = `You are a warm, compassionate wellness journal companion.
Speak directly to the user in second person, present tense.
Your observations are gentle, non-judgmental, and genuinely useful.
Never use clinical language. Never guilt or pressure.
Respond with exactly 1–2 sentences — no lists, no headers, no markdown.
Keep it under 40 words.`;

interface MoodData {
  avgMood: number | null;
  avgEnergy: number | null;
  avgStress: number | null;
  entryCount: number;
  period: string;
}

interface SleepData {
  avgHours: number | null;
  topQuality: string | null;
  entryCount: number;
}

interface SymptomData {
  topSymptoms: string[];
  entryCount: number;
}

interface SelfCareData {
  topActivity: string | null;
  activityCount: number;
  totalEntries: number;
}

interface OverallData {
  currentStreak: number;
  totalEntries: number;
  avgMood: number | null;
  avgSleep: number | null;
  topSelfCare: string | null;
  topSymptom: string | null;
}

export function moodPrompt(d: MoodData): string {
  return `The user's wellness journal data for the ${d.period}:
- Average mood: ${d.avgMood?.toFixed(1) ?? 'no data'}/5
- Average energy: ${d.avgEnergy?.toFixed(1) ?? 'no data'}/5
- Average stress: ${d.avgStress?.toFixed(1) ?? 'no data'}/5
- Entries logged: ${d.entryCount}

Write a single warm, insightful observation about their mood and energy patterns.`;
}

export function sleepPrompt(d: SleepData): string {
  return `The user's sleep journal data:
- Average sleep: ${d.avgHours?.toFixed(1) ?? 'no data'} hours
- Most common quality: ${d.topQuality ?? 'no data'}
- Entries: ${d.entryCount}

Write a single gentle observation about their sleep and what it might mean for their body.`;
}

export function symptomPrompt(d: SymptomData): string {
  if (d.entryCount === 0) return '';
  const list = d.topSymptoms.length > 0 ? d.topSymptoms.slice(0, 3).join(', ') : 'none';
  return `The user's top symptoms over the period: ${list}. Total entries: ${d.entryCount}.

Write one gentle, non-alarming observation connecting this symptom pattern to something actionable or hopeful.`;
}

export function selfCarePrompt(d: SelfCareData): string {
  if (!d.topActivity) return '';
  return `The user's most-practiced self-care activity is "${d.topActivity}" (appearing ${d.activityCount} times across ${d.totalEntries} entries).

Write one warm sentence celebrating this practice and what it reveals about what their body is reaching for.`;
}

export function overallPrompt(d: OverallData): string {
  return `Journal summary for a wellness client:
- Current streak: ${d.currentStreak} days
- Total entries: ${d.totalEntries}
- Average mood: ${d.avgMood?.toFixed(1) ?? '—'}/5
- Average sleep: ${d.avgSleep?.toFixed(1) ?? '—'} hours
- Most-practiced self-care: ${d.topSelfCare ?? '—'}
- Most common symptom: ${d.topSymptom ?? 'none'}

Write 1–2 sentences that feel like a letter of recognition — acknowledging the work they've done and one gentle invitation forward.`;
}

export { SYSTEM };
