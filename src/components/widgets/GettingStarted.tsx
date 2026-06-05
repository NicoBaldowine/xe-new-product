"use client";

import { motion, useReducedMotion } from "motion/react";
import { AssetIcon } from "@/components/primitives/AssetIcon";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** A single onboarding step. `done` collapses it to the completed (struck-through) state. */
export type GettingStartedStep = {
  /** Pending-state leading icon (an existing Icon name). */
  icon: IconName;
  /** Step title — e.g. "Add a recipient". */
  title: string;
  /** Pending helper line; replaced by `doneSub` once completed. */
  sub: string;
  /** Completed helper line — e.g. "Done - Ready to send". */
  doneSub: string;
  done?: boolean;
};

/** Named Figma variants → which leading steps are pre-completed. */
export type GettingStartedVariant = "first-time" | "middle" | "all-done";

/** Demo defaults — inline, not from fixtures.ts. Mirrors the Figma checklist copy. */
const DEFAULT_STEPS: GettingStartedStep[] = [
  {
    icon: "users",
    title: "Create your account",
    sub: "Verify your details to get started",
    doneSub: "Done - Welcome aboard",
  },
  {
    icon: "users",
    title: "Add a recipient",
    sub: "Tell us who you want to send money to",
    doneSub: "Done - Ready to send",
  },
  {
    icon: "card",
    title: "Add payment method",
    sub: "Choose how you'll fund your transfers",
    doneSub: "Done - Funding set up",
  },
  {
    icon: "chart",
    title: "Check the exchange rate",
    sub: "See live rates and what your recipient gets",
    doneSub: "Done - Live rates unlocked",
  },
  {
    icon: "send",
    title: "Make your first transfer",
    sub: "Move money to over 200 countries",
    doneSub: "Done - You're officially sending",
  },
];

/** How many leading steps each named variant marks complete. */
const VARIANT_DONE: Record<GettingStartedVariant, number> = {
  "first-time": 1,
  middle: 4,
  "all-done": 5,
};

type GettingStartedProps = {
  title?: string;
  steps?: GettingStartedStep[];
  /** Named Figma variant — drives how many steps start completed. */
  variant?: GettingStartedVariant;
  /** Override the completed count directly (wins over `variant`). */
  completed?: number;
  helpLabel?: string;
  helpLinkLabel?: string;
  className?: string;
};

/**
 * Maps the approximated inline <Icon> names used by the default steps to the
 * real Figma icon SVGs (in /public/assets/icons/). Steps whose icon isn't
 * mapped fall back to the inline <Icon> set.
 */
const STEP_ASSET_ICON: Partial<Record<IconName, string>> = {
  users: "user-plus",
  card: "credit-card-plus",
  chart: "line-chart-up",
  send: "send",
};

/** One checklist row — completed shows a filled success check + struck-through copy. */
function StepRow({ step, done, reduce }: { step: GettingStartedStep; done: boolean; reduce: boolean }) {
  const assetIcon = STEP_ASSET_ICON[step.icon];
  const emblem = done ? (
    <motion.span
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-success text-content-white"
    >
      <Icon name="check" size={14} />
    </motion.span>
  ) : (
    <span className="inline-flex size-6 items-center justify-center">
      {assetIcon ? (
        <AssetIcon name={assetIcon} size={22} className="text-content" />
      ) : (
        <Icon name={step.icon} size={22} className="text-content" />
      )}
    </span>
  );

  return (
    <div className="flex h-16 items-center gap-4">
      {emblem}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-display text-body font-medium",
            done ? "text-content-tertiary line-through" : "text-content",
          )}
        >
          {step.title}
        </p>
        <p
          className={cn(
            "truncate text-body-sm",
            done ? "text-content-tertiary line-through" : "text-content-secondary",
          )}
        >
          {done ? step.doneSub : step.sub}
        </p>
      </div>
    </div>
  );
}

export function GettingStarted({
  title = "Getting started",
  steps = DEFAULT_STEPS,
  variant = "first-time",
  completed,
  helpLabel = "Need help?",
  helpLinkLabel = "Visit the Help Centre",
  className,
}: GettingStartedProps = {}) {
  const reduce = useReducedMotion() ?? false;
  const doneCount = completed ?? VARIANT_DONE[variant];
  const total = steps.length;
  const allDone = doneCount >= total;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header: title + counter (or a success check once everything's done). */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-h3 text-content">
          {title}
        </h3>
        {allDone ? (
          <Icon name="check" size={20} className="text-success" aria-label="All steps complete" />
        ) : (
          <p className="font-display text-h4 font-medium tabular-nums text-content-tertiary">
            {doneCount}/{total}
          </p>
        )}
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-1">
        {steps.map((step, i) => (
          <StepRow
            key={step.title}
            step={step}
            done={step.done ?? i < doneCount}
            reduce={reduce}
          />
        ))}
      </div>

      {/* Help footer */}
      <div className="flex items-center gap-3">
        <AssetIcon name="help-circle" size={20} className="text-content-secondary" />
        <span className="text-body-sm text-content-secondary">{helpLabel}</span>
        <a
          href="#"
          className="text-body-sm font-medium text-action underline underline-offset-2 hover:opacity-80"
        >
          {helpLinkLabel}
        </a>
      </div>
    </div>
  );
}
