import type { MonthlySetup } from '@prisma/client';
import { packArr, unpackArr } from './utils/json-array';
import type { MonthlySetupInput } from './validations/monthly';

const ARR = [
  'symptomsFrequent',
  'stressLevels',
  'bodyNeedsMore',
  'nervousSupport',
  'herbalSupports',
  'selfCareFocus',
  'whatChanged',
  'appointments',
] as const;

export type MonthlySetupView = Omit<MonthlySetup, (typeof ARR)[number]> & {
  symptomsFrequent: string[];
  stressLevels: number[];
  bodyNeedsMore: string[];
  nervousSupport: string[];
  herbalSupports: string[];
  selfCareFocus: string[];
  whatChanged: string[];
  appointments: string[];
};

export function toMonthlyView(row: MonthlySetup): MonthlySetupView {
  return {
    ...row,
    symptomsFrequent: unpackArr(row.symptomsFrequent),
    stressLevels: unpackArr<number>(row.stressLevels),
    bodyNeedsMore: unpackArr(row.bodyNeedsMore),
    nervousSupport: unpackArr(row.nervousSupport),
    herbalSupports: unpackArr(row.herbalSupports),
    selfCareFocus: unpackArr(row.selfCareFocus),
    whatChanged: unpackArr(row.whatChanged),
    appointments: unpackArr(row.appointments),
  };
}

export function toMonthlyDb(input: Partial<MonthlySetupInput>) {
  const out: Record<string, unknown> = { ...input };
  for (const k of ARR) {
    if (k in input) out[k] = packArr((input as Record<string, unknown>)[k]);
  }
  return out;
}
