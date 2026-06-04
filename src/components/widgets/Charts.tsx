"use client";

import { useState } from "react";
import { AssetIcon } from "@/components/primitives/AssetIcon";
import { Figure } from "@/components/primitives/Figure";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { RateAreaChart } from "@/components/primitives/RateAreaChart";
import { useWidgetContainer } from "@/components/primitives/WidgetShell";
import { cn } from "@/lib/cn";

/**
 * Charts — the rate chart widget (Rates group).
 *
 * Figma: Mobile 8443:36375 / Desktop 8443:22752.
 *  · Both variants share the same body: big rate + delta + timestamp, then a
 *    branded area chart (the shared <RateAreaChart> primitive).
 *  · Desktop leads with a currency-selector row (two rate items + a swap
 *    button); mobile trails the pair as a compact stacked-flag badge.
 *  · Range tabs (1D…5Y) let the series be re-sampled — driving the chart's
 *    draw-in animation on switch.
 *
 * Pure content component: no outer surface / no layoutId (WidgetShell supplies
 * the container). Demo defaults are inline; every stressable value is a prop.
 */

// --- demo defaults (inline; do NOT edit src/lib/fixtures.ts) ---------------
const DEFAULT_POINTS = [
  0.2, 0.215, 0.205, 0.24, 0.25, 0.235, 0.27, 0.285, 0.275, 0.3, 0.295, 0.32,
  0.335, 0.355, 0.37, 0.36, 0.4, 0.43, 0.45, 0.44, 0.48, 0.52, 0.55, 0.545,
  0.55, 0.535, 0.54, 0.51, 0.48, 0.46, 0.42, 0.4, 0.415, 0.45, 0.49, 0.52, 0.5,
  0.55, 0.59, 0.62, 0.66, 0.68, 0.66, 0.63, 0.61, 0.64, 0.67, 0.7, 0.69, 0.72,
  0.74, 0.73, 0.79, 0.86, 0.84, 0.91, 0.95,
];

const DEFAULT_RANGES = ["1D", "1W", "3M", "6M", "1Y", "5Y"] as const;

type Trend = "up" | "down";

type ChartsProps = {
  /** Currency you convert from (leading flag/selector). */
  from?: string;
  /** Currency you convert to. */
  to?: string;
  /** The headline rate. */
  rate?: string;
  /** Period change, e.g. "+0.07%". */
  delta?: string;
  /** Sign of the delta — drives the arrow + success/warning colour. */
  trend?: Trend;
  /** Quote timestamp line. */
  timestamp?: string;
  /** Normalized 0..1 series rendered by RateAreaChart. */
  points?: number[];
  /** Selectable range labels. */
  ranges?: readonly string[];
  /** Initially active range. */
  activeRange?: string;
  /**
   * Figma variants. "selector" (desktop default) shows the editable from→to
   * currency row; "badge" (mobile default) trails a compact stacked-flag pair.
   * `undefined` resolves from the WidgetShell container.
   */
  variant?: "selector" | "badge";
  /** Hide the range tabs (compact embeds). */
  showRanges?: boolean;
  className?: string;
};

function RateItem({ code }: { code: string }) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-1 items-center justify-between gap-2 rounded-xl bg-surface-1 px-3 py-2",
        "cursor-pointer select-none transition-colors hover:bg-surface-adaptive",
      )}
    >
      <span className="flex items-center gap-2">
        <Figure flag={code} size={24} />
        <span className="font-display text-sm font-medium text-content">{code}</span>
      </span>
      <AssetIcon name="chevron-down" size={16} className="text-content-secondary" />
    </button>
  );
}

export function Charts({
  from = "CAD",
  to = "USD",
  rate = "0.7249",
  delta = "+0.07%",
  trend = "up",
  timestamp = "May 29, 5:57:00 PM UTC",
  points = DEFAULT_POINTS,
  ranges = DEFAULT_RANGES,
  activeRange = "1D",
  variant,
  showRanges = true,
  className,
}: ChartsProps = {}) {
  const container = useWidgetContainer();
  const resolved = variant ?? (container === "mobile" ? "badge" : "selector");
  const [active, setActive] = useState(activeRange);

  // Re-sample the series per range so switching tabs re-runs the chart draw-in.
  // Higher ranges show more of the walk; lower ranges zoom the recent tail.
  const seriesFor = (range: string) => {
    const idx = ranges.indexOf(range);
    const frac = ranges.length > 1 ? idx / (ranges.length - 1) : 1;
    const take = Math.max(8, Math.round(points.length * (0.45 + 0.55 * frac)));
    return points.slice(points.length - take);
  };

  const up = trend === "up";

  const pair = (
    <span className="flex items-center">
      <Figure flag={from} size={24} />
      <span className="z-10 -mx-1 flex size-5 items-center justify-center rounded-full bg-surface text-content-secondary">
        <AssetIcon name="arrow-right" size={12} />
      </span>
      <Figure flag={to} size={24} />
    </span>
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {resolved === "selector" ? (
        <div className="flex items-center gap-2">
          <RateItem code={from} />
          <button
            type="button"
            aria-label={`Swap ${from} and ${to}`}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              "cursor-pointer text-content-secondary transition-colors hover:bg-surface-1",
            )}
          >
            <AssetIcon name="convert" size={16} />
          </button>
          <RateItem code={to} />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-baseline gap-2">
            <RollingNumber
              value={rate}
              className="font-display text-3xl font-semibold tracking-[-0.02em] text-content"
            />
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                up ? "text-success-on-muted" : "text-warning-on-muted",
              )}
            >
              <AssetIcon
                name="arrow-up"
                size={16}
                className={cn(!up && "rotate-180")}
              />
              {delta}
            </span>
          </div>
          <p className="text-xs text-content-secondary">{timestamp}</p>
        </div>
        {resolved === "badge" ? pair : null}
      </div>

      <div className={cn("w-full", container === "mobile" ? "h-[123px]" : "h-[160px]")}>
        <RateAreaChart points={seriesFor(active)} />
      </div>

      {showRanges && ranges.length > 1 ? (
        <div className="flex items-center gap-1" role="tablist" aria-label="Chart range">
          {ranges.map((r) => {
            const selected = r === active;
            return (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(r)}
                className={cn(
                  "flex-1 rounded-full py-1.5 font-display text-xs font-medium",
                  "cursor-pointer select-none transition-colors",
                  selected
                    ? "bg-surface-1 text-content"
                    : "text-content-secondary hover:bg-surface-1",
                )}
              >
                {r}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
