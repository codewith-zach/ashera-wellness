import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { weeklyReviewSchema } from '@/lib/validations/monthly';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = weeklyReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { weekNumber, ...rest } = parsed.data;
  const review = await prisma.weeklyReview.upsert({
    where: { userId_weekNumber: { userId: user.id, weekNumber } },
    create: { userId: user.id, weekNumber, ...rest },
    update: rest,
  });
  return NextResponse.json({ review });
}

export async function GET() {
  const user = await requireUser();
  const reviews = await prisma.weeklyReview.findMany({
    where: { userId: user.id },
    orderBy: { weekNumber: 'asc' },
  });
  return NextResponse.json({ reviews });
}
