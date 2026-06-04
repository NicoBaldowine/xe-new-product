/**
 * Tiny FX helper for the demo. Rates are anchored to the dashboard's CAD→USD
 * rate (the same 0.7249 shown in the rate chart / send block) so the numbers
 * across blocks stay consistent.
 */

const CAD_USD = 0.7249; // 1 CAD in USD

const RATE: Record<string, number> = {
  "CAD>USD": CAD_USD,
  "USD>CAD": 1 / CAD_USD,
};

/** Convert `amount` from one currency to another using the demo rate table. */
export function convert(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const rate = RATE[`${from}>${to}`];
  if (rate == null) throw new Error(`No demo rate for ${from}→${to}`);
  return amount * rate;
}

/** Format a number with grouped thousands and two decimals (e.g. 1,655.40). */
export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
