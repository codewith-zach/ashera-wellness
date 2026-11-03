import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { readJsonObject, badRequest } from '@/lib/api';

export const dynamic = 'force-dynamic';

const schema = z.object({
  enabled: z.boolean(),
  hour: z.number().int().min(0).max(23),
  timezone: z
    .string()
    .max(64)
    .regex(/^[A-Za-z0-9_+\-/]+$/, 'IANA timezone name required')
    .nullable()
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  const json = await readJsonObject(req);
  if (!json.ok) return badRequest('Invalid JSON body');
  const parsed = schema.safeParse(json.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      reminderEnabled: parsed.data.enabled,
      reminderHour: parsed.data.hour,
      ...(parsed.data.timezone ? { timezone: parsed.data.timezone } : {}),
    },
    select: { reminderEnabled: true, reminderHour: true, timezone: true },
  });
  return NextResponse.json(updated);
}
