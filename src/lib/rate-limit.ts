/**
 * Minimal in-memory sliding-window rate limiter — enough for a single
 * server instance. On horizontally scaled deployments, swap for a shared
 * store (Redis/Upstash) before the auth routes see real traffic.
 */

const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 10 * 60 * 1000,
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const window = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (window.length >= limit) {
    const retryAfterSec = Math.ceil((window[0] + windowMs - now) / 1000);
    hits.set(key, window);
    return { allowed: false, retryAfterSec };
  }
  window.push(now);
  hits.set(key, window);
  // Opportunistic cleanup so the map doesn't grow forever.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}
