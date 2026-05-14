import type { DailyEntry } from '@prisma/client';
import { packArr, unpackArr } from './utils/json-array';
import type { DailyEntryInput } from './validations/entry';

const ARRAY_FIELDS = [
  'bodyFeelings',
  'herbalTeas',
  'afterMeals',
  'symptoms',
  'painAreas',
  'todayPracticed',
  'selfCare',
  'completedSections',
] as const;

export type DailyEntryView = Omit<DailyEntry, (typeof ARRAY_FIELDS)[number]> & {
  bodyFeelings: string[];
  herbalTeas: string[];
  afterMeals: string[];
  symptoms: string[];
  painAreas: string[];
  todayPracticed: string[];
  selfCare: string[];
  completedSections: string[];
};

export function toView(entry: DailyEntry): DailyEntryView {
  return {
    ...entry,
    bodyFeelings: unpackArr(entry.bodyFeelings),
    herbalTeas: unpackArr(entry.herbalTeas),
    afterMeals: unpackArr(entry.afterMeals),
    symptoms: unpackArr(entry.symptoms),
    painAreas: unpackArr(entry.painAreas),
    todayPracticed: unpackArr(entry.todayPracticed),
    selfCare: unpackArr(entry.selfCare),
    completedSections: unpackArr(entry.completedSections),
  };
}

export function toDbWrite(input: Partial<DailyEntryInput>) {
  const out: Record<string, unknown> = { ...input };
  for (const field of ARRAY_FIELDS) {
    if (field in input) {
      out[field] = packArr((input as Record<string, unknown>)[field]);
    }
  }
  return out;
}
