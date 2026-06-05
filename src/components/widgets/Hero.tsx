"use client";

import { AssetIcon } from "@/components/primitives/AssetIcon";
import { Button } from "@/components/primitives/Button";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { RollingNumber } from "@/components/primitives/RollingNumber";
import { useWidgetContainer } from "@/components/primitives/WidgetShell";
import { FlagStack } from "@/components/primitives/FlagStack";
import { flagSrc, heroIllustration } from "@/lib/assets";
import { cn } from "@/lib/cn";

/**
 * Hero — top-of-screen widget. Two shapes share one component:
 *  · balance / all-accounts → flag(s) + label + total + quick actions.
 *  · card / esim            → emblem + title + subtitle + one CTA.
 * Mirrors the Figma "Hero" set. Desktop balance gets the special treatment:
 * a large blurred flag behind a fade-to-surface gradient (Figma node 8571:21496).
 * Pure content — surface comes from <WidgetShell>; no <Card>/layoutId here.
 */
export type HeroVariant =
  | "balance"
  | "all-accounts"
  | "rate"
  | "card"
  | "esim"
  | "send"
  | "send-quick";

type QuickAction = { icon: IconName; label: string; primary?: boolean };

// Real Figma icon exports (mask-rendered via AssetIcon) for the quick-action
// glyphs that have a 1:1 Figma asset. Anything not listed (e.g. "send") keeps
// the inline stroke <Icon>.
const ASSET_ACTION_ICONS: Partial<Record<IconName, string>> = {
  plus: "plus",
  convert: "convert",
};

/** Action glyph: real Figma asset when available, else inline <Icon>. */
function ActionIcon({ icon, size }: { icon: IconName; size: number }) {
  const asset = ASSET_ACTION_ICONS[icon];
  return asset ? <AssetIcon name={asset} size={size} /> : <Icon name={icon} size={size} />;
}

const DEFAULTS = {
  balance: {
    flags: ["US"],
    label: "USD Account",
    amount: "$380.00",
    actions: [
      { icon: "send", label: "Send money", primary: true },
      { icon: "plus", label: "Top up" },
      { icon: "convert", label: "Exchange" },
    ] as QuickAction[],
  },
  "all-accounts": {
    flags: ["US", "EU"],
    label: "All accounts",
    amount: "$500.00",
    actions: [
      { icon: "send", label: "Send money", primary: true },
      { icon: "plus", label: "Top up" },
      { icon: "convert", label: "Exchange" },
    ] as QuickAction[],
  },
  rate: {
    emblem: "chart" as IconName,
    title: "Never miss a good rate",
    subtitle: "Track 200+ currencies and get alerted the moment yours moves.",
    cta: "Check rates",
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
  send: {
    emblem: "send" as IconName,
    title: "Send money, keep more of it",
    subtitle: "Reach 200+ countries at the real rate, with no hidden fees.",
    cta: "Send money",
    ctaIcon: "send" as IconName,
  },
  "send-quick": {
    emblem: "send" as IconName,
    title: "Send some money?",
    subtitle: "It's quick, just pick who and how much.",
    cta: "Send money",
    ctaIcon: "send" as IconName,
  },
} as const;

/** Promo variants render the emblem/illustration + title + subtitle + one CTA. */
const PROMO_VARIANTS: HeroVariant[] = ["rate", "card", "esim", "send", "send-quick"];

export type HeroProps = {
  variant?: HeroVariant;
  flags?: string[];
  /** Single-flag override (e.g. the Playground flag picker) — wins over `flags`. */
  flag?: string;
  showOverflow?: boolean;
  label?: string;
  amount?: string;
  actions?: QuickAction[];
  emblem?: IconName;
  title?: string;
  subtitle?: string;
  cta?: string;
  className?: string;
};

export function Hero({ variant = "balance", className, ...overrides }: HeroProps) {
  const isPromo = PROMO_VARIANTS.includes(variant);
  return isPromo ? (
    <PromoHero variant={variant} className={className} {...overrides} />
  ) : (
    <BalanceHero variant={variant} className={className} {...overrides} />
  );
}

/** Mobile: round icon button + caption. */
function QuickAccessButton({ icon, label, primary }: QuickAction) {
  return (
    <div className="flex w-20 flex-col items-center gap-2">
      <Button aria-label={label} variant={primary ? "primary" : "secondary"} className="h-12 w-12 rounded-full px-0">
        <ActionIcon icon={icon} size={20} />
      </Button>
      <span className="font-display text-caption text-content">{label}</span>
    </div>
  );
}

/** Top-bar round icon button (bell / profile) for the mobile hero. */
function TopIcon({ kind }: { kind: "bell" | "profile" }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-adaptive text-content">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {kind === "bell" ? (
          <>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </>
        ) : (
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </>
        )}
      </svg>
    </span>
  );
}

/** Carousel page dots — decorative (mirrors the app's swipeable hero). */
function PageDots({ count = 4, active = 1 }: { count?: number; active?: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === active ? "w-4 bg-content" : "w-1.5 bg-surface-3",
          )}
        />
      ))}
    </div>
  );
}

/** Desktop: full-width pill button (icon + label). */
function PillButton({ icon, label }: QuickAction) {
  return (
    <button
      type="button"
      className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-button bg-surface-adaptive px-4 font-display text-body-sm font-semibold text-content transition-colors hover:brightness-95"
    >
      <ActionIcon icon={icon} size={16} />
      {label}
    </button>
  );
}

function BalanceHero({ variant, flags, flag, showOverflow, label, amount, actions, className }: HeroProps) {
  const container = useWidgetContainer();
  const isDesktop = container === "desktop";
  const d = DEFAULTS[variant === "all-accounts" ? "all-accounts" : "balance"];
  // A single-flag override (the Playground picker) wins, so you can swap the flag
  // and see its blurred backdrop; otherwise use the multi-flag set.
  const resolvedFlags = flag ? [flag] : (flags ?? d.flags);
  const resolvedActions = actions ?? d.actions;
  const overflow = showOverflow ?? variant === "all-accounts";
  // Desktop drops the round "Send money" (it lives in the top nav) → Top up + Exchange pills.
  const desktopActions = resolvedActions.filter((a) => !a.primary);
  const bgFlag = flagSrc(resolvedFlags[0] ?? "US");

  const content = (
    <div className="relative flex w-full flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <FlagStack flags={resolvedFlags} overflow={overflow} size={48} />

        <div className="flex flex-col items-center gap-1">
          <Eyebrow className="uppercase">
            {label ?? d.label}
            <AssetIcon name="info-circle" size={16} className="text-content-secondary" />
          </Eyebrow>
          <RollingNumber
            value={amount ?? d.amount}
            className="font-display text-h1 leading-none text-content"
          />
        </div>
      </div>

      {isDesktop ? (
        <div className="flex w-full items-center justify-center gap-2">
          {desktopActions.map((a) => (
            <PillButton key={a.label} {...a} />
          ))}
        </div>
      ) : (
        <div className="flex w-full items-start justify-center gap-2">
          {resolvedActions.map((a) => (
            <QuickAccessButton key={a.label} {...a} />
          ))}
        </div>
      )}
    </div>
  );

  // Mobile: full-bleed hero that blends with the device — a blurred-flag + fade-
  // to-canvas gradient (sits behind the status bar), top icons, then the emblem /
  // amount / quick actions / page dots. No card surface.
  if (container === "mobile") {
    return (
      <div className={cn("relative isolate overflow-hidden", className)}>
        {bgFlag && (
          <div
            aria-hidden
            style={{ backgroundImage: `url(${bgFlag})` }}
            className="pointer-events-none absolute left-1/2 top-0 size-[340px] -translate-x-1/2 -translate-y-1/3 bg-contain bg-center bg-no-repeat opacity-25 blur-2xl"
          />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-canvas" />
        <div className="relative z-10 flex flex-col gap-6 px-5 pb-2 pt-11">
          <div className="flex items-center justify-between">
            <TopIcon kind="bell" />
            <TopIcon kind="profile" />
          </div>
          {content}
          <PageDots count={4} active={1} />
        </div>
      </div>
    );
  }

  // Desktop: full-bleed blurred flag + fade-to-surface gradient behind the content.
  if (isDesktop) {
    return (
      <div className={cn("relative -m-6 flex min-h-[224px] flex-col justify-between overflow-hidden rounded-card p-6", className)}>
        {bgFlag && (
          <div
            aria-hidden
            style={{ backgroundImage: `url(${bgFlag})` }}
            className="pointer-events-none absolute left-1/2 top-1/2 size-[392px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-20 blur-2xl"
          />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
        {content}
      </div>
    );
  }

  return <div className={cn("flex flex-col", className)}>{content}</div>;
}

function PromoHero({ variant, emblem, title, subtitle, cta, className }: HeroProps) {
  const container = useWidgetContainer();
  const d = DEFAULTS[(variant ?? "card") as keyof typeof DEFAULTS] as {
    emblem: IconName;
    title: string;
    subtitle: string;
    cta: string;
    ctaIcon?: IconName;
  };

  // Transparent Figma SVG illustration per promo variant; falls back to an icon.
  const illustration = variant ? heroIllustration[variant] : undefined;

  return (
    <div className={cn("flex flex-col items-center gap-8 px-2 py-4 text-center", className)}>
      <div className="flex flex-col items-center gap-4">
        {illustration ? (
          <img
            src={illustration}
            alt=""
            aria-hidden
            className={cn("w-auto object-contain", container === "mobile" ? "h-24" : "h-28")}
          />
        ) : (
          <Figure size={container === "mobile" ? 96 : 120} className="bg-surface-1">
            <Icon name={emblem ?? d.emblem} size={48} className="text-brand-blue-bright" />
          </Figure>
        )}
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-display text-h3 tracking-[-0.01em] text-content">{title ?? d.title}</h3>
          <p className="text-body-sm text-content-secondary">{subtitle ?? d.subtitle}</p>
        </div>
      </div>
      <Button variant="primary" icon={d.ctaIcon}>{cta ?? d.cta}</Button>
    </div>
  );
}
