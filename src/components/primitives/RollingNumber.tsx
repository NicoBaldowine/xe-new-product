"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

const SPRING = { type: "spring", stiffness: 240, damping: 28 } as const;

/** One digit slot: a 0–9 column that slides to show the target digit. */
function DigitColumn({
  digit,
  rollFromZero,
  delay,
}: {
  digit: number;
  rollFromZero: boolean;
  delay: number;
}) {
  return (
    <span className="relative block h-[1em] w-[1ch] overflow-hidden">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        // On mount, roll up from 0 (like the chart's rate). `false` keeps the
        // value-change behaviour: animate from whatever digit was showing.
        initial={rollFromZero ? { y: "0em" } : false}
        animate={{ y: `${-digit}em` }}
        transition={{ ...SPRING, delay }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="flex h-[1em] items-end justify-center leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Renders a numeric string where each digit animates like an odometer. On mount
 * it rolls up from 0 (the entrance "count-up", matching the rate chart); on
 * value change it rolls from the previous digit. Non-digit characters (".", ",",
 * currency) stay static. Tabular figures keep every slot the same width.
 *
 * @param rollOnMount Count up from 0 on first render (default true).
 * @param delay Seconds to wait before rolling (stagger numbers behind the card).
 */
export function RollingNumber({
  value,
  className,
  rollOnMount = true,
  delay = 0,
}: {
  value: string;
  className?: string;
  rollOnMount?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const rollFromZero = rollOnMount && !reduce;
  return (
    <span
      className={cn("inline-flex items-end tabular-nums leading-none", className)}
      role="text"
      aria-label={value}
    >
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <DigitColumn key={i} digit={Number(ch)} rollFromZero={rollFromZero} delay={delay} />
        ) : (
          <span key={i} aria-hidden className="flex h-[1em] items-end leading-none">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
