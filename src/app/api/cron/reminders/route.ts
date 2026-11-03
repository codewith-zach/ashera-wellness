import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email/send';
import { dailyReminderEmail, weeklyPromptEmail } from '@/lib/email/templates';
import { todayISO } from '@/lib/utils/date';
import { journalNow } from '@/lib/utils/journal-time';

export const dynamic = 'force-dynamic';

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
  if (process.env.NODE_ENV === 'production' && !secret) {
    return NextResponse.json({ error: 'CRON_SECRET is required' }, { status: 500 });
  }
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = todayISO();
  const now = new Date();
  const hour = now.getUTCHours();
  const isMonday = now.getUTCDay() === 1;

  const users = await prisma.user.findMany({
    where: { reminderEnabled: true },
    select: {
      id: true,
      email: true,
      displayName: true,
      reminderHour: true,
      journalStartDate: true,
    },
  });

  const sent: { email: string; kind: string; delivered: boolean; reason?: string }[] = [];

  for (const u of users) {
    // Only fire at the user's preferred hour (default 9am UTC).
    if ((u.reminderHour ?? 9) !== hour) continue;

    const todayEntry = await prisma.dailyEntry.findUnique({
      where: { userId_date: { userId: u.id, date: today } },
    });

    if (!todayEntry) {
      const { subject, html } = dailyReminderEmail(u.displayName);
      const result = await sendEmail({ to: u.email, subject, html });
      sent.push({ email: u.email, kind: 'daily', ...result });
    }

    if (isMonday) {
      const { weekNumber } = journalNow(u.journalStartDate);
      const review = await prisma.weeklyReview.findUnique({
        where: { userId_weekNumber: { userId: u.id, weekNumber: weekNumber - 1 } },
      });
      if (!review && weekNumber > 1) {
        const { subject, html } = weeklyPromptEmail(u.displayName, weekNumber - 1);
        const result = await sendEmail({ to: u.email, subject, html });
        sent.push({ email: u.email, kind: 'weekly', ...result });
      }
    }
  }

  return NextResponse.json({
    fired: sent.length,
    dryRun: !process.env.RESEND_API_KEY,
    results: sent,
  });
}
