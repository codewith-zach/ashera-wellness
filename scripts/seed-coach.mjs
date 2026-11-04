/**
 * Seed a demo coach user and two demo clients linked to them.
 * Run: node scripts/seed-coach.mjs [--make-dev-coach] [--make-admin]
 *
 * Demo logins use DEV_PASSWORD (default "ashera-dev-1"):
 *   you@ashera.local · coach@ashera.local · amara@ashera.local · priya@ashera.local
 */
import { PrismaClient } from '@prisma/client';
import { passwordHashForDev, isoDate } from './lib.mjs';

const db = new PrismaClient();
const args = process.argv.slice(2);
const makeDevCoach = args.includes('--make-dev-coach');
const makeAdmin = args.includes('--make-admin');

async function seedEntries(userId, count, dayOffset = 0) {
  for (let i = 0; i < count; i++) {
    const date = isoDate(i + dayOffset);
    const mood = Math.max(1, Math.min(5, 3 + Math.round(Math.sin(i / 2))));
    await db.dailyEntry.upsert({
      where: { userId_date: { userId, date } },
      update: {},
      create: {
        userId, date,
        mood, moodEmoji: ['😞','😔','😐','😊','🌟'][mood - 1],
        energyLevel: Math.max(1, Math.min(5, mood - (Math.random() > 0.5 ? 1 : 0))),
        stressLevel: Math.max(1, Math.min(5, 6 - mood)),
        sleepHours: Number((6.5 + Math.random() * 2).toFixed(1)),
        sleepQuality: ['Poor','Fair','Good','Deep'][Math.floor(Math.random() * 4)],
        waterCups: 4 + Math.floor(Math.random() * 5),
        bodyFeelings: JSON.stringify(mood >= 4 ? ['Calm'] : ['Tired']),
        symptoms: JSON.stringify(i % 4 === 0 ? ['Headache'] : []),
        selfCare: JSON.stringify(['Movement', 'Sunlight']),
        gratitude: 'Today was a quiet kind of good.',
        completedSections: JSON.stringify(['mood','sleep','reflection']),
      },
    });
  }
}

async function main() {
  const devUser = await db.user.findUnique({ where: { email: 'you@ashera.local' } });
  if (!devUser) { console.error('Run node scripts/seed.mjs first to create the dev user'); process.exit(1); }

  if (makeDevCoach) {
    await db.user.update({ where: { id: devUser.id }, data: { role: 'coach', onboardedAt: new Date() } });
    console.log('Dev user promoted to coach');
  }
  if (makeAdmin) {
    await db.user.update({ where: { id: devUser.id }, data: { role: 'admin', onboardedAt: new Date() } });
    console.log('Dev user promoted to admin — visit /admin');
  }

  const passwordHash = passwordHashForDev();
  const coachId = makeDevCoach ? devUser.id : (await db.user.upsert({
    where: { email: 'coach@ashera.local' },
    update: {},
    create: {
      email: 'coach@ashera.local', displayName: 'The Coach', role: 'coach',
      passwordHash, onboardedAt: new Date(), journalStartDate: new Date(),
    },
  })).id;

  const client1 = await db.user.upsert({
    where: { email: 'amara@ashera.local' },
    update: {},
    create: {
      email: 'amara@ashera.local', displayName: 'Amara', role: 'client',
      passwordHash, coachId, onboardedAt: new Date(), journalStartDate: new Date(),
    },
  });
  await seedEntries(client1.id, 21, 0);
  console.log('Seeded Amara (21 entries, active)');

  const client2 = await db.user.upsert({
    where: { email: 'priya@ashera.local' },
    update: {},
    create: {
      email: 'priya@ashera.local', displayName: 'Priya', role: 'client',
      passwordHash, coachId, onboardedAt: new Date(), journalStartDate: new Date(),
    },
  });
  await seedEntries(client2.id, 5, 10); // last entry was 10 days ago → at-risk
  console.log('Seeded Priya (5 entries, at-risk — no entry in 10d)');

  console.log(`\nCoach ID: ${coachId}`);
  if (!makeDevCoach) {
    console.log('\nTo see the coach dashboard as the dev user:');
    console.log('  node scripts/seed-coach.mjs --make-dev-coach');
  } else {
    console.log('\nVisit http://localhost:3000/coach');
  }
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
