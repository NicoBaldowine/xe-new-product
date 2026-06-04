"use client";

import { AssetIcon } from "@/components/primitives/AssetIcon";
import { Button } from "@/components/primitives/Button";
import { Figure } from "@/components/primitives/Figure";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { cn } from "@/lib/cn";

/**
 * Send Money Flow — Figma node 8443:17007.
 *
 * Send-internationally converter: a send amount and a receive amount, each with
 * its own currency selector, an inline rate badge floating between the two
 * fields, and a primary "Send money" CTA. Pure content component (no surface /
 * no layoutId) — the container is supplied by <WidgetShell>.
 */

type Leg = {
  /** Currency / country code → flag image (e.g. "CAD", "USD"). */
  currency: string;
  /** Pre-formatted amount string (e.g. "$50.00"). */
  amount: string;
};

type SendMoneyFlowProps = {
  title?: string;
  subtitle?: string;
  /** Top field — what the sender pays. */
  send?: Leg;
  /** Bottom field — what the recipient receives. */
  receive?: Leg;
  /** Inline rate badge text (e.g. "1 CAD = 0.72 USD"). */
  rateBadge?: string;
  cta?: string;
  /** Show the inline rate badge between the two fields. */
  showRate?: boolean;
  className?: string;
};

const DEMO: Required<Omit<SendMoneyFlowProps, "className">> = {
  title: "Send internationally",
  subtitle: "Live rates, low fees, arrives in seconds",
  send: { currency: "CAD", amount: "$50.00" },
  receive: { currency: "USD", amount: "$36.17" },
  rateBadge: "1 CAD = 0.72 USD",
  cta: "Send money",
  showRate: true,
};

/** One converter field: flag + currency code + chevron, with the amount trailing. */
function AmountField({ currency, amount }: Leg) {
  return (
    <div className="flex items-center justify-between rounded-card bg-surface-1 px-4 py-6">
      <button
        type="button"
        aria-label={`Change ${currency} currency`}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <Figure flag={currency} size={24} />
        <span className="font-display text-base font-medium tracking-[-0.04em] text-content">
          {currency}
        </span>
        <AssetIcon name="chevron-down" size={16} className="text-content-secondary" />
      </button>
      <RollingNumber
        value={amount}
        className="font-display text-[22px] font-semibold tracking-[-0.02em] text-content"
      />
    </div>
  );
}

export function SendMoneyFlow({
  title = DEMO.title,
  subtitle = DEMO.subtitle,
  send = DEMO.send,
  receive = DEMO.receive,
  rateBadge = DEMO.rateBadge,
  cta = DEMO.cta,
  showRate = DEMO.showRate,
  className,
}: SendMoneyFlowProps = {}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-0.5 text-left">
          <h3 className="w-full font-display text-xl font-medium tracking-[-0.02em] text-content">
            {title}
          </h3>
          <p className="w-full text-sm text-content-secondary">{subtitle}</p>
        </div>

        <div className="relative flex flex-col gap-1">
          <AmountField currency={send.currency} amount={send.amount} />
          {showRate && (
            <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success-muted px-4 py-1 font-display text-sm font-semibold whitespace-nowrap text-success-on-muted">
              {rateBadge}
            </span>
          )}
          <AmountField currency={receive.currency} amount={receive.amount} />
        </div>
      </div>

      <Button variant="primary" full className="h-12">
        {cta}
      </Button>
    </div>
  );
}
