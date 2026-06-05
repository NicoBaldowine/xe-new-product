"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type MasonryItem = { key: string; span?: number; node: ReactNode };

type Placement = { x: number; y: number; w: number };

/**
 * A real masonry that supports multi-column items. Cards pack into N columns
 * (N derived from `minColWidth`); each item drops into the position that keeps
 * the columns most balanced, so there are no gaps — and "large" items can span
 * 2+ columns. Transform-based positioning, so it composes with the entrance
 * animation (transforms don't affect the measured layout height).
 */
export function Masonry({
  items,
  minColWidth = 320,
  gap = 32,
}: {
  items: MasonryItem[];
  minColWidth?: number;
  gap?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    if (width === 0) return;
    const cols = Math.max(1, Math.min(items.length, Math.floor((width + gap) / (minColWidth + gap))));
    const colW = (width - gap * (cols - 1)) / cols;
    const heights = new Array(cols).fill(0);
    const pos: Record<string, Placement> = {};

    for (const it of items) {
      const span = Math.max(1, Math.min(it.span ?? 1, cols));
      const node = itemRefs.current.get(it.key);
      const h = node ? node.offsetHeight : 0;
      // Pick the window of `span` adjacent columns whose tallest column is lowest.
      let best = 0;
      let bestTop = Infinity;
      for (let c = 0; c + span <= cols; c++) {
        const top = Math.max(...heights.slice(c, c + span));
        if (top < bestTop - 0.5) {
          bestTop = top;
          best = c;
        }
      }
      pos[it.key] = { x: best * (colW + gap), y: bestTop, w: span * colW + (span - 1) * gap };
      const next = bestTop + h + gap;
      for (let c = best; c < best + span; c++) heights[c] = next;
    }

    setPlacements(pos);
    setHeight(Math.max(0, Math.max(...heights) - gap));
  }, [items, minColWidth, gap]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    itemRefs.current.forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: height || undefined }}>
      {items.map((it) => {
        const p = placements[it.key];
        return (
          <div
            key={it.key}
            ref={(n) => {
              if (n) itemRefs.current.set(it.key, n);
              else itemRefs.current.delete(it.key);
            }}
            className="absolute left-0 top-0"
            style={
              p
                ? { transform: `translate(${p.x}px, ${p.y}px)`, width: p.w }
                : { position: "relative", width: "100%" }
            }
          >
            {it.node}
          </div>
        );
      })}
    </div>
  );
}
