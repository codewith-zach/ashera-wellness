import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { computeStreak, entriesThisWeek } from '@/lib/utils/streak';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireUser();
  const dates = (
    await prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: { date: true },
    })
  ).map((e) => e.date);
  const { current, longest } = computeStreak(dates);
  return NextResponse.json({
    current,
    longest,
    weeklyGoal: 5,
    thisWeek: entriesThisWeek(dates),
    totalEntries: dates.length,
  });
}
