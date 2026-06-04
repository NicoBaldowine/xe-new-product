import { Icon } from "./Icon";
import { flagSrc, flagEmoji } from "@/lib/assets";
import { cn } from "@/lib/cn";

type StackItem = { flag: string } | { overflow: true };

/**
 * Overlapping flag stack with a real circular **mask cutout** (no faux ring):
 * each flag after the first carves a hole where the previous one overlaps,
 * revealing a clean gap through to the surface. A single flag has no cutout.
 * Used everywhere flags stack (Hero, Rate Watch, balances, charts …).
 */
export function FlagStack({
  flags,
  overflow = false,
  size = 40,
  className,
}: {
  flags: readonly string[];
  overflow?: boolean;
  size?: number;
  className?: string;
}) {
  const overlap = Math.round(size / 3);
  const gap = Math.max(2, Math.round(size * 0.06));
  const r = size / 2 + gap;
  const cx = overlap - size / 2;
  const cy = size / 2;
  const cutout = `radial-gradient(circle ${r}px at ${cx}px ${cy}px, transparent ${r}px, #000 ${r + 1}px)`;

  const items: StackItem[] = [
    ...flags.map((f) => ({ flag: f })),
    ...(overflow ? [{ overflow: true as const }] : []),
  ];

  return (
    <div className={cn("flex", className)}>
      {items.map((it, i) => {
        const src = "flag" in it ? flagSrc(it.flag) : null;
        return (
          <div
            key={i}
            className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-1 bg-cover bg-center text-content"
            style={{
              width: size,
              height: size,
              marginLeft: i > 0 ? -overlap : 0,
              ...(src ? { backgroundImage: `url(${src})` } : {}),
              ...(i > 0 ? { WebkitMaskImage: cutout, maskImage: cutout } : {}),
            }}
          >
            {"overflow" in it && <Icon name="plus" size={Math.round(size * 0.42)} />}
            {"flag" in it && !src && (
              <span style={{ fontSize: Math.round(size * 0.42) }}>{flagEmoji(it.flag)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
