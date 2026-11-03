import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest, validationError } from '@/lib/api';
import { weeklyReviewSchema } from '@/lib/validations/weekly';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = weeklyReviewSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError('Invalid weekly review', parsed.error);
  }
  const { weekNumber, ...rest } = parsed.data;
  const review = await prisma.weeklyReview.upsert({
    where: { userId_weekNumber: { userId: user.id, weekNumber } },
    create: { userId: user.id, weekNumber, ...rest },
    update: rest,
  });
  return NextResponse.json({ review });
}

