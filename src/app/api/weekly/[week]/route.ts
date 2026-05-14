import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { weeklyReviewSchema } from '@/lib/validations/monthly';

function parseWeek(value: string) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1 || n > 44) return null;
  return n;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { week: string } },
) {
  const user = await requireUser();
  const weekNumber = parseWeek(params.week);
  if (!weekNumber) return NextResponse.json({ review: null }, { status: 400 });
  const review = await prisma.weeklyReview.findUnique({
    where: { userId_weekNumber: { userId: user.id, weekNumber } },
  });
  return NextResponse.json({ review });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { week: string } },
) {
  const user = await requireUser();
  const weekNumber = parseWeek(params.week);
  if (!weekNumber) return NextResponse.json({ error: 'Bad week' }, { status: 400 });
  const body = await req.json();
  const parsed = weeklyReviewSchema.partial().safeParse({ ...body, weekNumber });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { weekNumber: _ignored, ...rest } = parsed.data;
  const review = await prisma.weeklyReview.update({
    where: { userId_weekNumber: { userId: user.id, weekNumber } },
    data: rest,
  });
  return NextResponse.json({ review });
}
