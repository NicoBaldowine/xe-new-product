"use client";

import { useEffect, useId, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

type DotProps = { cx?: number; cy?: number; index?: number };

const DRAW_MS = 1100;

/**
 * Pro area chart for the rate card — smooth (monotone) line that reads like a
 * real market tape, branded gradient fill, and a single glowing end dot with a
 * soft halo. Points are actual rate values; rendering is purely presentational.
 *
 * The end dot stays hidden while the line draws in (otherwise it floats at the
 * far-right final position, disconnected from the still-drawing line) and fades
 * in once it settles. A timer keyed to `points` drives this — more reliable than
 * recharts' animation callbacks, which don't always re-fire on data changes — so
 * the dot reliably re-appears after every range switch.
 */
export function RateAreaChart({ points }: { points: number[] }) {
  const gradientId = useId();
  const [drawn, setDrawn] = useState(false);
  const data = points.map((v, i) => ({ i, v }));
  const last = data.length - 1;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const pad = (max - min || 1) * 0.12;

  // Hide the dot, then reveal it when the draw-in finishes — re-runs whenever
  // the series changes (range switch) because `points` is a dependency.
  useEffect(() => {
    setDrawn(false);
    const id = setTimeout(() => setDrawn(true), DRAW_MS + 60);
    return () => clearTimeout(id);
  }, [points]);

  function EndDot({ cx, cy, index }: DotProps) {
    if (!drawn || index !== last || cx == null || cy == null) return <g />;
    return (
      <g style={{ animation: "rate-dot-in 220ms ease-out", transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={cx} cy={cy} r={9} fill="var(--color-brand-blue-bright)" opacity={0.18} />
        <circle
          cx={cx}
          cy={cy}
          r={4.5}
          fill="var(--color-brand-blue-bright)"
          stroke="var(--color-surface)"
          strokeWidth={2.5}
        />
      </g>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={140}>
      <AreaChart data={data} margin={{ top: 12, right: 14, bottom: 4, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-blue-bright)" stopOpacity={0.26} />
            <stop offset="75%" stopColor="var(--color-brand-blue-bright)" stopOpacity={0.02} />
            <stop offset="100%" stopColor="var(--color-brand-blue-bright)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={[min - pad, max + pad]} />
        <Area
          type="monotone"
          dataKey="v"
          stroke="var(--color-brand-blue-bright)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={`url(#${gradientId})`}
          dot={EndDot}
          activeDot={false}
          isAnimationActive
          animationDuration={DRAW_MS}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
