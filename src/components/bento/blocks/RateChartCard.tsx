"use client";

import { useState } from "react";
import { Card } from "@/components/primitives/Card";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { RateAreaChart } from "@/components/primitives/RateAreaChart";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { cn } from "@/lib/cn";
import { rateChart as data } from "@/lib/fixtures";
import { RANGES, getSeries, type RangeKey } from "@/lib/rate-series";

function Selector({ code }: { code: string }) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center gap-2 rounded-xl bg-surface-1 px-3 py-2"
    >
      <Figure flag={code} size={24} />
      <span className="font-display text-sm font-medium text-content">{code}</span>
      <Icon name="chevronDown" size={16} className="ml-auto text-content-secondary" />
    </button>
  );
}

/**
 * @param fillHeight When true (consumer desktop), the card stretches to its grid
 *   cell and the chart area flexes — so a shorter sibling (Send internationally)
 *   drives the row height and the chart shrinks to match. Off by default so the
 *   bento / mobile layouts keep the fixed chart height.
 */
export function RateChartCard({ fillHeight = false }: { fillHeight?: boolean } = {}) {
  const [range, setRange] = useState<RangeKey>("1D");
  const series = getSeries(range);

  return (
    <Card layoutId="rate-chart" className={cn("flex flex-col gap-4", fillHeight && "lg:h-full")}>
      <div className="flex items-center gap-2">
        <Selector code={data.from} />
        <Icon name="swapV" size={18} className="rotate-90 text-content-secondary" />
        <Selector code={data.to} />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <RollingNumber
            value={series.rate}
            className="font-sans text-3xl font-semibold tracking-[-0.04em] text-content"
          />
          <span
            className={cn(
              "flex items-center gap-1 font-display text-sm font-medium",
              series.positive ? "text-success-on-muted" : "text-danger-on-muted",
            )}
          >
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full",
                series.positive ? "bg-success-muted" : "bg-danger-muted",
              )}
            >
              <Icon name="arrowUp" size={12} className={series.positive ? "" : "rotate-180"} />
            </span>
            {series.delta}
          </span>
        </div>
        <span className="text-xs text-content-secondary">{data.timestamp}</span>
      </div>

      <div className={cn("w-full", fillHeight ? "h-44 lg:h-auto lg:min-h-0 lg:flex-1" : "h-44")}>
        <RateAreaChart points={series.points} />
      </div>

      <div className="flex gap-1">
        {RANGES.map((r) => {
          const active = r === range;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={active}
              onClick={() => setRange(r)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-center font-display text-xs font-medium transition-colors",
                active
                  ? "bg-brand-blue-bright text-content-white"
                  : "text-content-secondary hover:bg-surface-1 hover:text-content",
              )}
            >
              {r}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
