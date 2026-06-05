"use client";

import Image from "next/image";
import { AssetIcon } from "@/components/primitives/AssetIcon";
import { cn } from "@/lib/cn";
import { illustrationSrc } from "@/lib/assets";

/**
 * MKT Card — marketing promo card (image + title + subtitle + optional dismiss).
 *
 * Figma variants (8504:58552 Small, 8504:58551 Large):
 *  · Small → image is an 88×88 square on the leading edge, text to its right (row layout).
 *  · Large → image is a full-width 88px band on top, text below (column layout).
 *
 * Pure content component — the surface/morph is supplied by <WidgetShell>.
 */

type MktCardVariant = "Small" | "Large";

type MktCardProps = {
  /** Figma variant name. */
  variant?: MktCardVariant;
  title?: string;
  subtitle?: string;
  /** Promo image source. */
  imageSrc?: string;
  /** Show the top-right dismiss control. */
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
};

const demo = {
  title: "Marketing demo title",
  subtitle:
    "Stay connected in minutes, not hours. Say goodbye to hefty fees and hello to instant connections.",
  imageSrc: illustrationSrc,
};

export function MktCard({
  variant = "Small",
  title = demo.title,
  subtitle = demo.subtitle,
  imageSrc = demo.imageSrc,
  dismissible = true,
  onDismiss,
  className,
}: MktCardProps = {}) {
  const large = variant === "Large";

  const image = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-surface-1",
        large ? "h-[88px] w-full" : "size-[88px]",
      )}
    >
      <Image src={imageSrc} alt="" fill sizes="208px" className="object-cover" />
    </div>
  );

  const text = (
    <div
      className={cn(
        // Align to the top of the image (not vertically centered) so wrapped
        // copy reads naturally at narrow widths.
        "flex min-w-0 flex-col justify-start",
        large ? "w-full" : "flex-1",
      )}
    >
      <h3 className="font-display text-body font-semibold text-content">{title}</h3>
      <p className="text-body-sm text-content-secondary">{subtitle}</p>
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex gap-4",
        large ? "flex-col" : "items-start",
        className,
      )}
    >
      {image}
      {text}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{ touchAction: "manipulation" }}
          className={cn(
            "absolute right-0 top-0 inline-flex size-6 items-center justify-center",
            "cursor-pointer rounded-full text-content-secondary",
            "transition-colors hover:bg-surface-1 hover:text-content",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-bright",
          )}
        >
          <AssetIcon name="x-close" size={18} />
        </button>
      )}
    </div>
  );
}
