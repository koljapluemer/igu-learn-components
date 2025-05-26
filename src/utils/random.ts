/**
 * A seeded random number generator using the Mulberry32 algorithm
 */
export class SeededRandom {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 2147483647);
  }

  next(): number {
    this.seed = (this.seed + 0x6D2B79F5) | 0;
    let t = Math.imul(this.seed ^ (this.seed >>> 15), 1 | this.seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

/**
 * Selects n random items from an array without replacement
 * @param array The array to select from
 * @param n Number of items to select
 * @param seed Optional seed for deterministic selection
 * @returns Array of selected items
 */
export function selectRandom<T>(array: T[], n: number, seed?: number): T[] {
  if (n >= array.length) {
    return [...array];
  }

  const random = new SeededRandom(seed);
  const result: T[] = [];
  const indices = new Set<number>();

  while (result.length < n) {
    const index = Math.floor(random.next() * array.length);
    if (!indices.has(index)) {
      indices.add(index);
      result.push(array[index]);
    }
  }

  return result;
} 