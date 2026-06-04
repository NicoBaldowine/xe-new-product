/**
 * Deterministic rate-history generator for the rate chart. Each range produces
 * its own smooth, organically-trending series that lands on the headline rate,
 * plus the period delta. Generation is seeded (no Date/Math.random) so server
 * and client render identical paths — no hydration mismatch.
 *
 * The shape is built from a trend line + a couple of low-frequency sine waves
 * (organic swings) + a touch of fine noise, tapered near the end so the curve
 * lands cleanly on `end`. Combined with monotone interpolation in the chart it
 * reads like a real, polished market tape rather than a jagged scribble.
 */

export type RangeKey = "1D" | "1W" | "3M" | "6M" | "1Y" | "5Y";

export const RANGES: RangeKey[] = ["1D", "1W", "3M", "6M", "1Y", "5Y"];

type RangeConfig = {
  count: number;
  seed: number;
  /** Headline rate for this range (where the line ends). */
  end: number;
  /** % change over the period (drives sign / colour, and the visible trend). */
  delta: number;
};

const CONFIG: Record<RangeKey, RangeConfig> = {
  "1D": { count: 56, seed: 11, end: 0.7249, delta: 0.62 },
  "1W": { count: 56, seed: 23, end: 0.7232, delta: -0.48 },
  "3M": { count: 64, seed: 37, end: 0.7188, delta: 1.85 },
  "6M": { count: 72, seed: 41, end: 0.7301, delta: -1.1 },
  "1Y": { count: 80, seed: 53, end: 0.7042, delta: 4.2 },
  "5Y": { count: 96, seed: 67, end: 0.6585, delta: 12.4 },
};

/** Tiny seeded LCG → deterministic [0,1). */
function makeRng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export type RateSeries = {
  points: number[];
  rate: string;
  delta: string;
  positive: boolean;
};

export function getSeries(range: RangeKey): RateSeries {
  const { count, seed, end, delta } = CONFIG[range];
  const start = end / (1 + delta / 100);
  const rnd = makeRng(seed);

  // Swings stay a fraction of the trend move, so the line always reads as a
  // clear direction (up / down) with organic texture — never an aimless wander.
  const swing = Math.max(Math.abs(end - start) * 0.5, end * 0.0014);

  // Seed-derived frequencies / phases so each range has a distinct organic shape.
  const f1 = 1.5 + rnd() * 1.6;
  const f2 = 3.2 + rnd() * 3.2;
  const p1 = rnd() * Math.PI * 2;
  const p2 = rnd() * Math.PI * 2;

  const points: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const trend = start + (end - start) * t;
    const wave =
      swing *
      (Math.sin(t * Math.PI * f1 + p1) * 0.62 + Math.sin(t * Math.PI * f2 + p2) * 0.38);
    const noise = (rnd() - 0.5) * swing * 0.22;
    const taper = 1 - Math.pow(t, 5); // settle the swings as we approach `end`
    points.push(trend + (wave + noise) * taper);
  }
  points[count - 1] = end; // pin the last point to this range's headline rate

  return {
    points,
    rate: end.toFixed(4),
    delta: `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%`,
    positive: delta >= 0,
  };
}
