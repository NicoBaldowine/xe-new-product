"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type MasonryItem = { key: string; span?: number; node: ReactNode };

/**
 * Bento masonry on CSS grid.
 *
 * Columns are a **fixed, responsive count** (as many `minColWidth`-wide columns
 * as fit, capped at `maxCols`) rather than `auto-fill` — a stable count makes
 * `col-span` predictable, so wide widgets (tables, action bars, charts) reliably
 * occupy 2 columns and read as deliberate instead of breaking the rhythm. Each
 * item's `span` is clamped to the current column count (so a 2-wide widget
 * becomes a single full-width column on mobile).
 *
 * Vertical packing keeps the row-span technique: 1px auto-rows + a measured
 * `grid-row-end` per item, with `grid-auto-flow: dense` backfilling the gaps a
 * wide item leaves — the "flowing, no-gaps" look.
 */
export function Masonry({
  items,
  minColWidth = 340,
  maxCols = 4,
  gap = 32,
}: {
  items: MasonryItem[];
  /** Target column width — drives how many fixed columns fit. */
  minColWidth?: number;
  /** Hard cap on column count on wide screens. */
  maxCols?: number;
  gap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;

    const layout = () => {
      const width = grid.clientWidth;
      // As many target-width columns as fit, capped — a stable integer count.
      const cols = Math.max(
        1,
        Math.min(maxCols, Math.floor((width + gap) / (minColWidth + gap))),
      );
      grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

      for (const wrapper of Array.from(grid.children) as HTMLElement[]) {
        // Clamp the requested span to the live column count (a 2-wide widget
        // is a single full column on a 1-column phone layout).
        const span = Math.min(cols, Math.max(1, Number(wrapper.dataset.span) || 1));
        wrapper.style.gridColumnEnd = `span ${span}`;

        const content = wrapper.firstElementChild as HTMLElement | null;
        if (!content) continue;
        // offsetHeight ignores transforms, so the entrance scale/translate
        // animation doesn't skew the measurement. 1px rows → span ≈ height;
        // the extra `gap` rows leave the vertical gap below.
        const h = content.offsetHeight;
        wrapper.style.gridRowEnd = `span ${Math.max(1, h + gap)}`;
      }
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(grid);
    for (const wrapper of Array.from(grid.children)) {
      const content = wrapper.firstElementChild;
      if (content) ro.observe(content);
    }
    return () => ro.disconnect();
  }, [items, gap, minColWidth, maxCols]);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        // First-paint fallback before the effect computes the exact count.
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColWidth}px, 1fr))`,
        gridAutoRows: "1px",
        gridAutoFlow: "row dense",
        columnGap: `${gap}px`,
        rowGap: 0,
      }}
    >
      {items.map((it) => (
        <div key={it.key} data-span={it.span ?? 1} style={{ gridColumnEnd: `span ${it.span ?? 1}` }}>
          {it.node}
        </div>
      ))}
    </div>
  );
}
