import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toView } from '@/lib/entry-mapper';
import { computeStreak, entriesThisWeek } from '@/lib/utils/streak';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const coach = await requireUser();
  if (coach.role !== 'coach') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const client = await prisma.user.findFirst({
    where: { id: params.id, coachId: coach.id },
  });
  if (!client) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const entries = await prisma.dailyEntry.findMany({
    where: { userId: params.id },
    orderBy: { date: 'desc' },
    take: 60,
  });

  const dates = entries.map((e) => e.date);
  const { current, longest } = computeStreak(dates);

  return NextResponse.json({
    client: {
      id: client.id,
      displayName: client.displayName,
      email: client.email,
    },
    entries: entries.map(toView),
    streak: { current, longest, thisWeek: entriesThisWeek(dates) },
  });
}
