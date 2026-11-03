import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest, validationError } from '@/lib/api';
import { onboardingSchema } from '@/lib/validations/onboarding';
import { packArr } from '@/lib/utils/json-array';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = onboardingSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError('Invalid onboarding', parsed.error);
  }
  const { bodyRelationship, timezone, ...rest } = parsed.data;
  const data = {
    ...rest,
    bodyRelationship: packArr(bodyRelationship),
    commitmentDate: rest.commitmentLetter ? new Date() : null,
    completedAt: new Date(),
  };
  await prisma.onboarding.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardedAt: new Date(),
      ...(timezone ? { timezone } : {}),
    },
  });
  return NextResponse.json({ ok: true });
}
