"use client";

import { Fragment } from "react";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

/** Figma node 8443:17035 — "In progress / Pending action". 6 named variants. */
export type InProgressVariant =
  | "Add funds - Scheduled"
  | "Waiting for funds"
  | "Scheduled"
  | "In progress"
  | "Received money"
  | "Transaction created";

type StepState = "done" | "clock" | "warning" | "scheduled" | "future";

type Spec = {
  status: string;
  tone: "secondary" | "warning";
  steps: [StepState, StepState, StepState, StepState];
  trailing: "amount" | "add-funds" | "view-info";
};

const SPEC: Record<InProgressVariant, Spec> = {
  "Add funds - Scheduled": { status: "Add funds before May 21 to complete your transfer", tone: "warning", steps: ["done", "done", "warning", "future"], trailing: "add-funds" },
  "Waiting for funds": { status: "Waiting for funds to complete your transfer", tone: "warning", steps: ["done", "warning", "future", "future"], trailing: "view-info" },
  "Scheduled": { status: "Scheduled for May 22", tone: "secondary", steps: ["scheduled", "future", "future", "future"], trailing: "amount" },
  "In progress": { status: "Transfer in progress", tone: "secondary", steps: ["done", "done", "clock", "future"], trailing: "amount" },
  "Received money": { status: "We received your money", tone: "secondary", steps: ["done", "done", "done", "clock"], trailing: "amount" },
  "Transaction created": { status: "Transaction created", tone: "secondary", steps: ["done", "future", "future", "future"], trailing: "amount" },
};

function Dot({ state }: { state: StepState }) {
  if (state === "future") {
    return <span className="size-2 shrink-0 rounded-full bg-surface-3" aria-hidden />;
  }
  const base = "grid size-5 shrink-0 place-items-center rounded-full";
  if (state === "warning") {
    // Solid amber fill (not the *-on-muted text token) so the white "!" stays
    // legible in both themes.
    return (
      <span className={cn(base, "bg-surface-warning text-content-white font-display text-caption font-semibold")} aria-hidden>
        !
      </span>
    );
  }
  if (state === "scheduled") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-3 text-content" aria-hidden>
        <Icon name="calendar" size={12} />
      </span>
    );
  }
  // done | clock — neutral fill (inverts with theme); the glyph uses the reverse
  // content colour so it never washes out (white-on-white) in dark.
  return (
    <span className={cn(base, "bg-content text-content-reverse")} aria-hidden>
      <Icon name={state === "clock" ? "clock" : "check"} size={12} />
    </span>
  );
}

type InProgressProps = {
  variant?: InProgressVariant;
  recipient?: string;
  /** Trailing amount (e.g. "100 EUR") for the in-flight states. */
  amount?: string;
  className?: string;
};

export function InProgress({
  variant = "Add funds - Scheduled",
  recipient = "To Matias",
  amount = "100 EUR",
  className,
}: InProgressProps = {}) {
  const spec = SPEC[variant];
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* content row */}
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate font-display text-body font-medium text-content">{recipient}</p>
          <p
            className={cn(
              "truncate text-body-sm",
              spec.tone === "warning" ? "text-warning-on-muted" : "text-content-secondary",
            )}
          >
            {spec.status}
          </p>
        </div>
        {spec.trailing === "amount" ? (
          <span className="shrink-0 font-display text-body font-medium text-content">{amount}</span>
        ) : (
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded-xl bg-surface-1 px-3 py-1.5 font-display text-caption font-semibold text-content transition-colors hover:bg-surface-adaptive"
          >
            {spec.trailing === "add-funds" ? "Add funds" : "View info"}
          </button>
        )}
      </div>

      {/* 4-step progress stepper */}
      <div className="flex items-center" aria-hidden>
        {spec.steps.map((s, i) => (
          <Fragment key={i}>
            <Dot state={s} />
            {i < spec.steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 flex-1",
                  s === "done" ? "bg-content" : "bg-stroke",
                )}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
