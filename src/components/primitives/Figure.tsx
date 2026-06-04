import Image from "next/image";
import { cn } from "@/lib/cn";
import { flagSrc, flagEmoji } from "@/lib/assets";

type FigureProps = {
  size?: number;
  /** White ring for stacked emblems. */
  ring?: boolean;
  /** Currency/country code → flag image (emoji fallback). */
  flag?: string;
  /** Avatar initials (e.g. "JE"). */
  initials?: string;
  className?: string;
  children?: React.ReactNode;
};

/** Circular emblem — flag, initials, or arbitrary icon child. */
export function Figure({ size = 40, ring = false, flag, initials, className, children }: FigureProps) {
  const src = flag ? flagSrc(flag) : null;

  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-surface-1 text-content",
        ring && "ring-4 ring-surface",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : flag ? (
        <span style={{ fontSize: size * 0.62, lineHeight: 1 }}>{flagEmoji(flag)}</span>
      ) : initials ? (
        <span className="font-display font-medium" style={{ fontSize: size * 0.36 }}>
          {initials}
        </span>
      ) : (
        children
      )}
    </span>
  );
}
