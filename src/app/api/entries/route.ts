import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest } from '@/lib/api';
import { dailyEntrySchema } from '@/lib/validations/entry';
import { toView, toDbWrite } from '@/lib/entry-mapper';
import { computeStreak } from '@/lib/utils/streak';
import { newlyEarned } from '@/lib/milestones';
import { packArr, unpackArr } from '@/lib/utils/json-array';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = dailyEntrySchema.safeParse(json.body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid entry', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { date, ...rest } = parsed.data;
  const data = toDbWrite(rest);

  const existing = await prisma.dailyEntry.findUnique({
    where: { userId_date: { userId: user.id, date } },
  });

  const entry = await prisma.dailyEntry.upsert({
    where: { userId_date: { userId: user.id, date } },
    create: { userId: user.id, date, ...data },
    update: data,
  });

  const allDates = (
    await prisma.dailyEntry.findMany({
      where: { userId: user.id },
      select: { date: true },
    })
  ).map((e) => e.date);

  const { current } = computeStreak(allDates);

  // Detect newly-earned streak milestones and persist them on the user.
  const earned = unpackArr<number>(user.milestones);
  const fresh = newlyEarned(current, earned);
  if (fresh.length > 0) {
    const next = [...earned, ...fresh.map((m) => m.days)].sort((a, b) => a - b);
    await prisma.user.update({
      where: { id: user.id },
      data: { milestones: packArr(next) },
    });
  }

  return NextResponse.json({
    entry: toView(entry),
    isNew: !existing,
    streak: current,
    milestones: fresh,
  });
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: { userId: string; date?: { gte?: string; lte?: string } } = {
    userId: user.id,
  };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = from;
    if (to) where.date.lte = to;
  }

  const entries = await prisma.dailyEntry.findMany({
    where,
    orderBy: { date: 'desc' },
  });
  return NextResponse.json({
    entries: entries.map(toView),
    total: entries.length,
  });
}
