"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type MasonryItem = { key: string; span?: number; node: ReactNode };

/**
 * Masonry via the CSS-grid row-span technique: the grid uses 1px auto-rows, and
 * each item's `grid-row-end` is set to its measured height (+ gap) so columns
 * pack tightly with no gaps. `grid-auto-flow: dense` backfills around items that
 * span 2 columns. Auto-fill columns keep it fluid; supports any content.
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;

    const layout = () => {
      for (const wrapper of Array.from(grid.children) as HTMLElement[]) {
        const content = wrapper.firstElementChild as HTMLElement | null;
        if (!content) continue;
        // offsetHeight ignores transforms, so the entrance scale/translate
        // animation doesn't skew the measurement.
        const h = content.offsetHeight;
        // 1px rows → span ≈ height; + gap rows leave the vertical gap below.
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
  }, [items, gap]);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColWidth}px, 1fr))`,
        gridAutoRows: "1px",
        gridAutoFlow: "row dense",
        columnGap: `${gap}px`,
        rowGap: 0,
      }}
    >
      {items.map((it) => (
        <div key={it.key} style={{ gridColumnEnd: `span ${Math.max(1, it.span ?? 1)}` }}>
          {it.node}
        </div>
      ))}
    </div>
  );
}
