import { NextRequest, NextResponse } from 'next/server';

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

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
