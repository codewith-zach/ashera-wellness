import { describe, it, expect } from 'vitest';
import type { DailyEntry } from '@prisma/client';
import { toView, toDbWrite } from './entry-mapper';

function fakeEntry(overrides: Partial<DailyEntry> = {}): DailyEntry {
  const now = new Date('2026-01-01T00:00:00Z');
  return {
    id: 'entry1',
    userId: 'user1',
    date: '2026-01-02',
    mood: 4,
    moodEmoji: '🌤️',
    energyLevel: 3,
    stressLevel: 2,
    bodyFeelings: '["Calm"]',
    sleepHours: 7.5,
    sleepQuality: 'Good',
    waterCups: 6,
    breakfast: 'oats',
    lunch: null,
    dinner: null,
    snacks: null,
    calProtein: null,
    herbalTeas: '[]',
    bodyResponse: null,
    bowelTexture: null,
    bowelEase: null,
    afterMeals: '[]',
    symptoms: '["Fatigue"]',
    symptomsExtra: null,
    symptomBetter: null,
    symptomWorse: null,
    cyclePhase: null,
    cycleMucus: null,
    cycleMood: null,
    libido: null,
    skinCondition: null,
    painAreas: '["Lower back"]',
    moveActivity: 'yoga',
    moveDuration: 30,
    moveIntensity: 'Low',
    moveDuring: null,
    moveAfter: 'Energised',
    mindFeel: 'Calm',
    todayPracticed: '["Breathing"]',
    stressedBy: null,
    supportedBy: null,
    selfCare: '["Bath"]',
    gratitude: 'morning light',
    proudOf: null,
    notes: null,
    completedSections: '["mood","sleep"]',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('toView', () => {
  it('unpacks JSON array fields into real arrays', () => {
    const view = toView(fakeEntry());
    expect(view.symptoms).toEqual(['Fatigue']);
    expect(view.painAreas).toEqual(['Lower back']);
    expect(view.todayPracticed).toEqual(['Breathing']);
    expect(view.selfCare).toEqual(['Bath']);
    expect(view.completedSections).toEqual(['mood', 'sleep']);
    expect(view.bodyFeelings).toEqual(['Calm']);
  });

  it('leaves scalar fields untouched', () => {
    const view = toView(fakeEntry());
    expect(view.mood).toBe(4);
    expect(view.gratitude).toBe('morning light');
    expect(view.sleepHours).toBe(7.5);
  });
});

describe('toDbWrite', () => {
  it('packs array fields to JSON strings', () => {
    const write = toDbWrite({ symptoms: ['Bloating'], selfCare: ['Tea'] });
    expect(write.symptoms).toBe('["Bloating"]');
    expect(write.selfCare).toBe('["Tea"]');
  });

  it('does not touch array fields the input omitted', () => {
    const write = toDbWrite({ gratitude: 'quiet' });
    expect('symptoms' in write).toBe(false);
    expect(write.gratitude).toBe('quiet');
  });

  it('round-trips with toView', () => {
    const input = {
      date: '2026-01-02',
      symptoms: ['Fatigue', 'Headache'],
      waterCups: 5,
      notes: 'steady day',
    };
    const db = toDbWrite(input);
    const view = toView(
      fakeEntry({ ...db, id: 'x', userId: 'u', createdAt: new Date(), updatedAt: new Date() } as DailyEntry),
    );
    expect(view.symptoms).toEqual(['Fatigue', 'Headache']);
    expect(view.waterCups).toBe(5);
    expect(view.notes).toBe('steady day');
  });
});
