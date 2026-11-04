// Phase-2 verification seed: 14 days of varied entries for the dev user.
// Run: node scripts/seed.mjs [--make-admin]
// Demo login: you@ashera.local / DEV_PASSWORD (default "ashera-dev-1")
import { PrismaClient } from '@prisma/client';
import { passwordHashForDev, isoDate } from './lib.mjs';

const prisma = new PrismaClient();
const DEV_EMAIL = 'you@ashera.local';
const makeAdmin = process.argv.includes('--make-admin');

const SYMPTOMS = [
  ['Headache', 'Anxiety'],
  ['Fatigue'],
  [],
  ['Brain Fog'],
  [],
  ['Cramps'],
  ['Headache'],
  [],
  [],
  ['Anxiety'],
  ['Fatigue', 'Brain Fog'],
  [],
  [],
  ['Headache'],
];

const SELF_CARE = [
  ['Movement', 'Sunlight'],
  ['Rest', 'Reading'],
  ['Meditation', 'Stretching'],
  ['Movement', 'Nature Walk'],
  ['Sunlight', 'Bath or Shower'],
  ['Rest'],
  ['Movement', 'Stretching'],
  ['Meditation'],
  ['Nature Walk', 'Sunlight'],
  ['Reading', 'Bath or Shower'],
  ['Rest', 'Reading'],
  ['Movement', 'Sunlight'],
  ['Stretching'],
  ['Meditation', 'Nature Walk'],
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: DEV_EMAIL },
    update: {},
    create: {
      email: DEV_EMAIL,
      displayName: 'Friend',
      passwordHash: passwordHashForDev(),
      onboardedAt: new Date(),
      journalStartDate: new Date(),
    },
  });
  if (makeAdmin) {
    await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } });
    console.log('Dev user promoted to admin — visit /admin');
  }

  for (let i = 0; i < 14; i++) {
    const date = isoDate(i);
    const moodSeed = (3 + Math.sin(i / 2) * 1.4) | 0;
    const mood = Math.max(1, Math.min(5, moodSeed + (Math.random() > 0.7 ? 1 : 0)));
    const energy = Math.max(1, Math.min(5, mood - (Math.random() > 0.6 ? 1 : 0)));
    const stress = Math.max(1, Math.min(5, 3 + (Math.random() > 0.5 ? 1 : -1)));
    const sleepHours = Number((6 + Math.random() * 3).toFixed(1));
    const sleepQuality =
      sleepHours >= 8.2 ? 'Deep' : sleepHours >= 7 ? 'Good' : sleepHours >= 5.5 ? 'Fair' : 'Poor';
    const waterCups = 4 + ((i % 5) | 0);

    await prisma.dailyEntry.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: {},
      create: {
        userId: user.id,
        date,
        mood,
        moodEmoji: ['😞', '😔', '😐', '😊', '🌟'][mood - 1],
        energyLevel: energy,
        stressLevel: stress,
        bodyFeelings: JSON.stringify(
          mood >= 4 ? ['Calm', 'Light'] : mood <= 2 ? ['Tired', 'Heavy'] : ['Calm'],
        ),
        sleepHours,
        sleepQuality,
        waterCups,
        breakfast: 'Oats with berries',
        lunch: 'Quinoa bowl',
        dinner: 'Roast veg + greens',
        herbalTeas: JSON.stringify(['Herbal tea']),
        symptoms: JSON.stringify(SYMPTOMS[i] ?? []),
        selfCare: JSON.stringify(SELF_CARE[i] ?? []),
        gratitude:
          i % 3 === 0
            ? 'The morning light through the kitchen window'
            : i % 3 === 1
              ? 'A slow phone call with someone I love'
              : 'My body letting me rest without protest',
        completedSections: JSON.stringify([
          'mood',
          'body',
          'sleep',
          'nutrition',
          'reflection',
        ]),
      },
    });
  }
  console.log('Seeded 14 days of entries for', user.email);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
