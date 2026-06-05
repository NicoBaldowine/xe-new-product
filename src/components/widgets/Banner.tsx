"use client";

import { bannerImage } from "@/lib/assets";
import { cn } from "@/lib/cn";

/**
 * Banner — wide marketing promo (Figma 8443:36638). Three treatments of the same
 * anatomy (title + serif accent + body + glass CTA over media):
 *  · image    (eSIM L) — full-bleed photo, dark text, glass-white CTA.
 *  · gradient (eSIM M) — brand-blue gradient + cut-out subject, white text, glass-white CTA.
 *  · light    (Large transfers) — side photo with a white scrim, dark text, glass-black CTA.
 * Pure content component — the morph/shell is supplied by the view.
 */
export type BannerVariant = "image" | "gradient" | "light";

type BannerProps = {
  variant?: string;
  title?: string;
  /** Serif-italic accent line under the title. */
  accent?: string;
  subtitle?: string;
  cta?: string;
  className?: string;
};

const DEFAULTS: Record<BannerVariant, { title: string; accent: string; subtitle: string; cta: string }> = {
  image: { title: "Travel without", accent: "Limits", subtitle: "Get instant data in 190+\nNo roaming fees", cta: "Get it now" },
  gradient: { title: "Travel without", accent: "Limits", subtitle: "Get instant data in 190+\nNo roaming fees", cta: "Get it now" },
  light: { title: "Large transfer?", accent: "Talk to an expert.", subtitle: "24/5 dedicated support for transfers over $50K", cta: "Transfer now" },
};

// Soft-blue used by the gradient variant (Figma #b5d2fa) — both for the gradient's
// light stop and that variant's accent. A one-off marketing value, not yet a token.
const SOFT_BLUE = "#b5d2fa";
const BLUE_GRADIENT = `linear-gradient(124deg, var(--color-brand-blue-bright) 36%, ${SOFT_BLUE} 118%)`;

export function Banner({ variant = "image", title, accent, subtitle, cta, className }: BannerProps = {}) {
  const v = (["image", "gradient", "light"].includes(String(variant).toLowerCase())
    ? String(variant).toLowerCase()
    : "image") as BannerVariant;
  const d = DEFAULTS[v];
  const t = title ?? d.title;
  const a = accent ?? d.accent;
  const sub = subtitle ?? d.subtitle;
  const c = cta ?? d.cta;

  const onLight = v !== "gradient"; // dark text sits over light media
  const fg = onLight ? "text-content-black" : "text-content-white";
  const ctaGlass = v === "light" ? "bg-glass-black" : "bg-glass-white";

  return (
    <div className={cn("relative flex min-h-[208px] items-stretch overflow-hidden rounded-card p-6", className)}>
      {/* ── backgrounds (absolute CSS layers; content sits above via z-10) ── */}
      {v === "image" && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage.esimBg})` }}
        />
      )}
      {v === "gradient" && (
        <>
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: BLUE_GRADIENT }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImage.esimCutout}
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-1 h-[116%] w-auto object-contain object-bottom"
          />
        </>
      )}
      {v === "light" && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-right"
            style={{ backgroundImage: `url(${bannerImage.largeTransfer})` }}
          />
          {/* White scrim so the dark copy reads over the photo (fixed, not themed). */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-white from-45% to-transparent" />
        </>
      )}

      {/* ── content ── */}
      <div className="relative z-10 flex max-w-[64%] flex-col">
        <div className="flex flex-col leading-tight">
          <span className={cn("font-display text-h3 font-semibold", fg)}>{t}</span>
          <span
            className={cn("font-serif text-h3 italic leading-tight", v !== "gradient" && "text-brand-blue-bright")}
            style={v === "gradient" ? { color: SOFT_BLUE } : undefined}
          >
            {a}
          </span>
        </div>
        <p className={cn("mt-1.5 whitespace-pre-line text-body-sm opacity-90", fg)}>{sub}</p>
        <button
          type="button"
          style={{ touchAction: "manipulation" }}
          className={cn(
            "mt-auto inline-flex h-10 w-fit cursor-pointer items-center rounded-xl px-4 backdrop-blur-md",
            "font-display text-body-sm font-medium text-content-white transition-[filter] hover:brightness-110",
            ctaGlass,
          )}
        >
          {c}
        </button>
      </div>
    </div>
  );
}
