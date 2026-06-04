"use client";

import { Button } from "@/components/primitives/Button";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { useWidgetContainer } from "@/components/primitives/WidgetShell";
import { cn } from "@/lib/cn";

/**
 * Hero — top-of-screen widget. Two shapes share one component:
 *  · balance / all-accounts → flag(s) + label + total + quick-access actions.
 *  · card / esim            → illustration emblem + title + subtitle + one CTA.
 * Mirrors the Figma "Hero" variant set (mobile Default/Balance/Card/eSIM,
 * desktop Hero Balance/All accounts). Pure content — the surface comes from
 * <WidgetShell>; no <Card>, no layoutId here.
 */
export type HeroVariant = "balance" | "all-accounts" | "card" | "esim";

type QuickAction = { icon: IconName; label: string; primary?: boolean };

/** A single quick-access action: round icon button + caption. */
function QuickAccessButton({ icon, label, primary }: QuickAction) {
  return (
    <div className="flex w-20 flex-col items-center gap-2">
      <Button
        aria-label={label}
        variant={primary ? "primary" : "secondary"}
        className="h-12 w-12 rounded-full px-0"
      >
        <Icon name={icon} size={20} />
      </Button>
      <span className="font-display text-xs font-medium text-content">{label}</span>
    </div>
  );
}

const DEFAULTS = {
  balance: {
    flags: ["US"],
    label: "USD Account",
    amount: "$380.00",
    actions: [
      { icon: "send", label: "Send money", primary: true },
      { icon: "plus", label: "Top up" },
      { icon: "swapV", label: "Exchange" },
    ] as QuickAction[],
  },
  "all-accounts": {
    flags: ["US", "EU"],
    label: "All accounts",
    amount: "$500.00",
    actions: [
      { icon: "send", label: "Send money", primary: true },
      { icon: "plus", label: "Top up" },
      { icon: "swapV", label: "Exchange" },
    ] as QuickAction[],
  },
  card: {
    emblem: "card" as IconName,
    title: "Spend like a local, anywhere",
    subtitle: "One card, every currency — at the real exchange rate.",
    cta: "Get card",
  },
  esim: {
    emblem: "phone" as IconName,
    title: "Land already connected",
    subtitle: "Mobile data in 190+ countries, no roaming fees, no SIM swap.",
    cta: "Get eSIM",
  },
} as const;

export type HeroProps = {
  variant?: HeroVariant;
  /** Stacked currency flags (balance variants). A trailing "+" tile is added when more accounts exist. */
  flags?: string[];
  /** Show the "+" overflow tile after the flag stack (all-accounts). */
  showOverflow?: boolean;
  /** Eyebrow label above the total. */
  label?: string;
  /** The total balance (balance variants). */
  amount?: string;
  /** Quick-access actions row (balance variants). */
  actions?: QuickAction[];
  /** Promo emblem icon (card / esim variants). */
  emblem?: IconName;
  /** Promo title (card / esim variants). */
  title?: string;
  /** Promo subtitle (card / esim variants). */
  subtitle?: string;
  /** Promo CTA label (card / esim variants). */
  cta?: string;
  className?: string;
};

export function Hero({ variant = "balance", className, ...overrides }: HeroProps) {
  const isPromo = variant === "card" || variant === "esim";
  return isPromo ? (
    <PromoHero variant={variant} className={className} {...overrides} />
  ) : (
    <BalanceHero variant={variant} className={className} {...overrides} />
  );
}

function BalanceHero({
  variant,
  flags,
  showOverflow,
  label,
  amount,
  actions,
  className,
}: HeroProps) {
  const d = DEFAULTS[variant === "all-accounts" ? "all-accounts" : "balance"];
  const resolvedFlags = flags ?? d.flags;
  const resolvedActions = actions ?? d.actions;
  const overflow = showOverflow ?? variant === "all-accounts";

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center">
          {resolvedFlags.map((f, i) => (
            <Figure key={f} flag={f} size={48} ring className={i > 0 ? "-ml-3" : ""} />
          ))}
          {overflow && (
            <Figure size={48} ring className="-ml-3">
              <Icon name="plus" size={20} className="text-content" />
            </Figure>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <Eyebrow className="uppercase">
            {label ?? d.label}
            <Icon name="help" size={16} className="text-content-secondary" />
          </Eyebrow>
          <RollingNumber
            value={amount ?? d.amount}
            className="font-display text-4xl font-semibold tracking-[-0.02em] text-content"
          />
        </div>
      </div>

      <div className="flex w-full items-start justify-center gap-2">
        {resolvedActions.map((a) => (
          <QuickAccessButton key={a.label} {...a} />
        ))}
      </div>
    </div>
  );
}

function PromoHero({ variant, emblem, title, subtitle, cta, className }: HeroProps) {
  const container = useWidgetContainer();
  const d = DEFAULTS[variant === "esim" ? "esim" : "card"];

  return (
    <div className={cn("flex flex-col items-center gap-8 px-2 py-4 text-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Figure size={container === "mobile" ? 96 : 120} className="bg-surface-1">
          <Icon name={emblem ?? d.emblem} size={48} className="text-brand-blue-bright" />
        </Figure>
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-display text-2xl font-semibold tracking-[-0.01em] text-content">
            {title ?? d.title}
          </h3>
          <p className="text-sm text-content-secondary">{subtitle ?? d.subtitle}</p>
        </div>
      </div>

      <Button variant="primary">{cta ?? d.cta}</Button>
    </div>
  );
}
