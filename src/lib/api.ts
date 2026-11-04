import { NextRequest, NextResponse } from 'next/server';
import type { ZodError } from 'zod';
import { flattenError } from 'zod';

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    { error: 'Too many attempts. Please slow down.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
  );
}

export function validationError(message: string, error: ZodError) {
  return NextResponse.json(
    { error: message, issues: flattenError(error) },
    { status: 400 },
  );
}

/**
 * Parse a JSON request body and confirm it is a plain object. Returns
 * { ok: false } instead of throwing when the payload isn't valid JSON or
 * isn't an object, so routes can answer 400 rather than 500.
 */
export async function readJsonObject(
  req: NextRequest,
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false }> {
  try {
    const body: unknown = await req.json();
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return { ok: false };
    }
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false };
  }
}
