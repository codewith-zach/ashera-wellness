import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { unpackArr } from '@/lib/utils/json-array';
import { periodFromQuery, periodStart } from '@/lib/utils/period';

export async function GET(req: NextRequest) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const period = periodFromQuery(searchParams.get('period'));
  const start = periodStart(period);

  const entries = await prisma.dailyEntry.findMany({
    where: {
      userId: user.id,
      ...(start ? { date: { gte: start } } : {}),
    },
    select: { date: true, symptoms: true },
    orderBy: { date: 'asc' },
  });

  const counts = new Map<string, number>();
  const heatmap: { date: string; count: number }[] = [];
  for (const e of entries) {
    const list = unpackArr(e.symptoms);
    heatmap.push({ date: e.date, count: list.length });
    for (const s of list) counts.set(s, (counts.get(s) ?? 0) + 1);
  }

  const ranked = [...counts.entries()]
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ period, ranked, heatmap });
}
