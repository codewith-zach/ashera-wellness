import { prisma } from './db';

const DEV_EMAIL = 'you@ashera.local';

/**
 * Phase-1 dev auth stub. Always returns (and lazily creates) a single dev
 * user. Phase 2 swaps this for Supabase Auth + magic-link sessions.
 */
export async function getCurrentUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DEV_EMAIL },
    include: { onboarding: true },
  });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      email: DEV_EMAIL,
      displayName: 'Friend',
      journalStartDate: new Date(),
    },
    include: { onboarding: true },
  });
}

export async function requireUser() {
  return getCurrentUser();
}
