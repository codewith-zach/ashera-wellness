import { describe, it, expect } from 'vitest';
import { packArr, unpackArr } from './json-array';

describe('packArr', () => {
  it('serialises arrays to JSON strings', () => {
    expect(packArr(['a', 'b'])).toBe('["a","b"]');
  });

  it('collapses non-arrays to an empty list', () => {
    expect(packArr('nope' as unknown as string[])).toBe('[]');
    expect(packArr(null)).toBe('[]');
  });
});

describe('unpackArr', () => {
  it('round-trips packed arrays', () => {
    expect(unpackArr(packArr(['x', 'y']))).toEqual(['x', 'y']);
  });

  it('unpacks numbers when typed', () => {
    expect(unpackArr<number>('[7,14]')).toEqual([7, 14]);
  });

  it('returns [] for null, undefined, invalid JSON, and non-array JSON', () => {
    expect(unpackArr(null)).toEqual([]);
    expect(unpackArr(undefined)).toEqual([]);
    expect(unpackArr('not json')).toEqual([]);
    expect(unpackArr('{"a":1}')).toEqual([]);
  });
});
