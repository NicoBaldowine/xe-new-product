import { cn } from "@/lib/cn";

/**
 * Renders a monochrome SVG icon exported from Figma (in /public/assets/icons/)
 * as a CSS mask painted with `bg-current`, so it follows the surrounding text
 * colour and themes correctly — the same technique as the iOS status bar in
 * MobileFrame. Use this for icons that must match Figma exactly; the inline
 * <Icon> set stays for the stroke-based UI glyphs.
 */
export function AssetIcon({
  name,
  size = 16,
  className,
}: {
  /** File under /public/assets/icons/ without extension, e.g. "info-circle". */
  name: string;
  size?: number;
  className?: string;
}) {
  const url = `/assets/icons/${name}.svg`;
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
