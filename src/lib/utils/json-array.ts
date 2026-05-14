/**
 * SQLite stores arrays as JSON strings. These helpers keep the (de)serialization
 * in one place so it's a single edit when we move to Postgres + native arrays.
 */
export function packArr(value: unknown): string {
  if (!Array.isArray(value)) return '[]';
  return JSON.stringify(value);
}

export function unpackArr<T = string>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
