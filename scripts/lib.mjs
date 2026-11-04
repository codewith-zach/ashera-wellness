// Shared helpers for seed scripts.
import { randomBytes, scryptSync } from 'node:crypto';

export const DEV_PASSWORD = process.env.DEV_PASSWORD ?? 'ashera-dev-1';

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function passwordHashForDev() {
  return hashPassword(DEV_PASSWORD);
}

export function pad(n) {
  return String(n).padStart(2, '0');
}

export function isoDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
