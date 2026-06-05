"use client";

import { motion, useReducedMotion } from "motion/react";
import { AssetIcon } from "@/components/primitives/AssetIcon";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** A pay-with / send-via method: an icon + a short label. */
type Method = {
  /** AssetIcon name under /public/assets/icons/, e.g. "building-08". */
  icon: string;
  label: string;
};

type SendAgainProps = {
  /**
   * Rate signal for the "They get" value. "higher" tints the trailing arrow
   * with the success token (a better-than-before rate); "normal" stays neutral.
   */
  rate?: "normal" | "higher";
  /** Amount the sender is sending (numeric string — animates via RollingNumber). */
  amount?: string;
  /** Currency being sent (e.g. "USD"). */
  fromCurrency?: string;
  /** Currency the recipient receives (e.g. "EUR"). */
  toCurrency?: string;
  /** Recipient label, e.g. "To Javo Esquivel". */
  recipient?: string;
  /** How the sender pays (bank / card / …). */
  payWith?: Method;
  /** How the money is delivered (bank deposit / cash pickup / …). */
  sendVia?: Method;
  /** Final received amount, e.g. "€92,00". */
  theyGet?: string;
  className?: string;
};

// Demo defaults mirror the Figma "Pinned + normal rate" variant (8443:17020).
const DEFAULTS = {
  amount: "100",
  fromCurrency: "USD",
  toCurrency: "EUR",
  recipient: "To Javo Esquivel",
  payWith: { icon: "building-08", label: "Bank transfer" } as Method,
  sendVia: { icon: "coins-hand", label: "Cash pickup" } as Method,
  theyGet: "€92,00",
};

/** A single "label / value" meta column in the footer row. */
function MetaColumn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="truncate text-xs text-content-tertiary">{label}</p>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

/**
 * Send Again — a tap-to-repeat card for a previous transfer. Shows the amount &
 * currency pair, recipient, the pay-with / send-via methods, and the resulting
 * "they get" value with a rate indicator.
 *
 * Figma variants: pinned vs regular, normal vs higher rate
 * (8443:17020 / 8443:17018 / 8443:17019).
 */
export function SendAgain({
  rate = "normal",
  amount = DEFAULTS.amount,
  fromCurrency = DEFAULTS.fromCurrency,
  toCurrency = DEFAULTS.toCurrency,
  recipient = DEFAULTS.recipient,
  payWith = DEFAULTS.payWith,
  sendVia = DEFAULTS.sendVia,
  theyGet = DEFAULTS.theyGet,
  className,
}: SendAgainProps = {}) {
  const reduce = useReducedMotion();
  const higher = rate === "higher";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Header: amount + currency pair, and a quick-send action. */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <RollingNumber
              value={amount}
              className="font-display text-h1 leading-none text-content"
            />
            <span className="flex items-center gap-1 text-body-sm text-content-secondary">
              {fromCurrency}
              <AssetIcon name="convert-arrows" size={12} className="text-content-tertiary" />
              {toCurrency}
            </span>
          </div>
          <p className="truncate font-display text-body-lg font-semibold text-content">
            {recipient}
          </p>
        </div>

        <motion.button
          type="button"
          aria-label={`Send again to ${recipient.replace(/^To\s+/i, "")}`}
          whileTap={reduce ? undefined : { scale: 0.94, transition: snappy }}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
            "bg-surface text-content",
            "cursor-pointer select-none transition-colors",
            "[touch-action:manipulation]",
          )}
        >
          <AssetIcon name="send" size={16} />
        </motion.button>
      </div>

      {/* Meta row: pay-with / send-via / they-get. */}
      <div className="flex items-start gap-4">
        <MetaColumn label="Pay with">
          <AssetIcon name={payWith.icon} size={16} className="text-content-secondary" />
          <span className="truncate text-caption text-content-secondary">
            {payWith.label}
          </span>
        </MetaColumn>

        <MetaColumn label="Send via">
          <AssetIcon name={sendVia.icon} size={16} className="text-content-secondary" />
          <span className="truncate text-caption text-content-secondary">
            {sendVia.label}
          </span>
        </MetaColumn>

        <MetaColumn label="They get">
          <span className="truncate text-caption text-content-secondary">
            {theyGet}
          </span>
          <AssetIcon
            name="arrow-up"
            size={16}
            className={higher ? "text-success-on-muted" : "text-content-tertiary"}
          />
        </MetaColumn>
      </div>
    </div>
  );
}
