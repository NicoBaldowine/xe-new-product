"use client";

import { motion, useReducedMotion } from "motion/react";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { FlagStack } from "@/components/primitives/FlagStack";
import { AssetIcon } from "@/components/primitives/AssetIcon";
import { CurrencyRow } from "@/components/primitives/CurrencyRow";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** One watched rate: a base currency, an optional quote currency, and the rate. */
export type RateWatchItem = {
  /** Leading flag/currency code (e.g. "USD"). */
  base: string;
  /** Trailing flag/currency code for a pair (e.g. "CAD"). Omit for a single. */
  quote?: string;
  /** Row label, e.g. "USD" or "USD to CAD". */
  label: string;
  /** Formatted rate, e.g. "$1,38". Rendered with RollingNumber. */
  rate: string;
};

/** Mirrors the Figma variants — all share one row template, differing by length. */
export type ConvertVariant =
  | "First time - Default"
  | "Max items"
  | "First Time - Only Convert";

type ConvertProps = {
  /** Section label above the list. */
  title?: string;
  /** The watched currency pairs/rates. */
  items?: RateWatchItem[];
  /** Named Figma variant — selects a default item set when `items` is omitted. */
  variant?: ConvertVariant;
  /** Show the trailing refresh / last-update affordance. */
  showRefresh?: boolean;
  className?: string;
};

const DEFAULT_ITEMS: RateWatchItem[] = [
  { base: "USD", label: "USD", rate: "$1" },
  { base: "USD", quote: "CAD", label: "USD to CAD", rate: "$1,38" },
];

const ONLY_CONVERT_ITEMS: RateWatchItem[] = [
  { base: "USD", label: "USD", rate: "$1" },
  { base: "USD", quote: "CAD", label: "USD to CAD", rate: "$1,38" },
  { base: "USD", quote: "EUR", label: "USD to EUR", rate: "€0,86" },
  { base: "USD", quote: "GBP", label: "USD to GBP", rate: "£0,74" },
];

const MAX_ITEMS: RateWatchItem[] = [
  ...ONLY_CONVERT_ITEMS,
  { base: "USD", quote: "CLP", label: "USD to CLP", rate: "$889" },
];

const VARIANT_ITEMS: Record<ConvertVariant, RateWatchItem[]> = {
  "First time - Default": DEFAULT_ITEMS,
  "Max items": MAX_ITEMS,
  "First Time - Only Convert": ONLY_CONVERT_ITEMS,
};

/** Stacked flag emblem — a single flag, or an overlapping pair (with the mask
 *  cutout, via FlagStack) for FX rows. */
function PairEmblem({ base, quote }: { base: string; quote?: string }) {
  return <FlagStack flags={quote ? [base, quote] : [base]} size={24} />;
}

/**
 * Convert — the Rate Watch list. Rows of currency pairs with live rates; the
 * variants only change how many rows are shown (first-time vs populated).
 * Pure content (no surface / no layoutId): wrap in <WidgetShell>.
 */
export function Convert({
  title = "Rate watch",
  items,
  variant = "First time - Default",
  showRefresh = true,
  className,
}: ConvertProps = {}) {
  const reduce = useReducedMotion();
  const rows = items ?? VARIANT_ITEMS[variant];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2.5">
        <Eyebrow chevron className="flex-1">
          {title}
        </Eyebrow>
        {showRefresh && (
          <AssetIcon
            name="last-update"
            size={12}
            className="shrink-0 text-brand-blue-bright"
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((item, i) => (
          <motion.div
            key={item.label}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: reduce ? 0 : i * 0.04 }}
          >
            <CurrencyRow
              name={item.label}
              amount={item.rate}
              emblem={<PairEmblem base={item.base} quote={item.quote} />}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
