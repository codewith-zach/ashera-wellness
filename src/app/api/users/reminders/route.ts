import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const schema = z.object({
  enabled: z.boolean(),
  hour: z.number().int().min(0).max(23),
});

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      reminderEnabled: parsed.data.enabled,
      reminderHour: parsed.data.hour,
    },
    select: { reminderEnabled: true, reminderHour: true },
  });
  return NextResponse.json(updated);
}
