import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email/send';
import { dailyReminderEmail, weeklyPromptEmail } from '@/lib/email/templates';
import { todayISO } from '@/lib/utils/date';
import { journalNow } from '@/lib/utils/journal-time';

export const dynamic = 'force-dynamic';

function isValidBearer(auth: string | null, secret: string): boolean {
  if (!auth?.startsWith('Bearer ')) return false;
  const token = Buffer.from(auth.slice(7));
  const expected = Buffer.from(secret);
  if (token.length !== expected.length) return false;
  return timingSafeEqual(token, expected);
}

/**
 * Cron handler — protected by CRON_SECRET. Sends:
 *  - Daily reminder to opted-in users who haven't logged today, at their preferred hour.
 *  - Weekly review prompt on Mondays.
 *
 * Pair with a Vercel Cron job (vercel.json) running hourly. Without
 * RESEND_API_KEY set it dry-runs and just logs what it would send.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');

  if (!secret) {
    // No secret configured: only local development may call this endpoint.
    // Preview/staging/production deployments must set CRON_SECRET.
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'CRON_SECRET is required' }, { status: 500 });
    }
  } else if (!isValidBearer(auth, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = todayISO();
  const now = new Date();
  const hour = now.getUTCHours();
  const isMonday = now.getUTCDay() === 1;

  const users = (await prisma.user.findMany({
    where: { reminderEnabled: true },
    select: {
      id: true,
      email: true,
      displayName: true,
      reminderHour: true,
      journalStartDate: true,
    },
  })).filter((u) => (u.reminderHour ?? 9) === hour);

  // reminderHour is interpreted in UTC until per-user timezones exist.
  if (users.length === 0) {
    return NextResponse.json({ fired: 0, dryRun: !process.env.RESEND_API_KEY });
  }

  const userIds = users.map((u) => u.id);

  // Batch the lookups instead of querying per user inside the loop.
  const [todaysEntries, existingReviews] = await Promise.all([
    prisma.dailyEntry.findMany({
      where: { date: today, userId: { in: userIds } },
      select: { userId: true },
    }),
    isMonday
      ? prisma.weeklyReview.findMany({
          where: { userId: { in: userIds } },
          select: { userId: true, weekNumber: true },
        })
      : Promise.resolve([] as { userId: string; weekNumber: number }[]),
  ]);
  const loggedToday = new Set(todaysEntries.map((e) => e.userId));
  const reviewDone = new Set(existingReviews.map((r) => `${r.userId}:${r.weekNumber}`));

  const jobs: Promise<void>[] = [];
  let daily = 0;
  let weekly = 0;

  for (const u of users) {
    if (!loggedToday.has(u.id)) {
      daily += 1;
      const { subject, html } = dailyReminderEmail(u.displayName);
      jobs.push(sendEmail({ to: u.email, subject, html }).then(() => undefined));
    }

    if (isMonday) {
      const { weekNumber } = journalNow(u.journalStartDate);
      const prev = weekNumber - 1;
      if (prev >= 1 && !reviewDone.has(`${u.id}:${prev}`)) {
        weekly += 1;
        const { subject, html } = weeklyPromptEmail(u.displayName, prev);
        jobs.push(sendEmail({ to: u.email, subject, html }).then(() => undefined));
      }
    }
  }

  await Promise.allSettled(jobs);

  // Counts only — never echo recipient addresses out of this endpoint.
  return NextResponse.json({
    fired: daily + weekly,
    daily,
    weekly,
    dryRun: !process.env.RESEND_API_KEY,
  });
}
