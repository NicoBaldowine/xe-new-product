"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type MasonryItem = {
  key: string;
  /** Column footprint (clamped to the live column count). */
  cols?: number;
  /** Cap on the tile's height in row units (clips overflow). */
  maxRows?: number;
  node: ReactNode;
};

/**
 * Bento grid: a fixed responsive column count + **row-quantised, best-fit**
 * packing.
 *
 * Heights are measured then snapped up to a fixed `rowUnit`, so tiles align to a
 * shared row grid (the deliberate "bento" look) and `maxRows` can cap content-
 * heavy widgets so nothing grows unbounded. Placement uses a best-fit packer
 * (fill the lowest frontier with the widest fitting item) so there are no gaps —
 * CSS `grid-auto-flow: dense` can't guarantee this. Items are absolutely
 * positioned; the tile clips overflow and its child fills it (`h-full`).
 */
export function Masonry({
  items,
  minColWidth = 340,
  maxCols = 4,
  gap = 24,
  rowUnit = 72,
}: {
  items: MasonryItem[];
  minColWidth?: number;
  maxCols?: number;
  gap?: number;
  /** Height grid: tile heights snap to a multiple of this (+ gaps). */
  rowUnit?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;

    const layout = () => {
      const width = grid.clientWidth;
      if (!width) return;
      const els = Array.from(grid.children) as HTMLElement[];

      const cols = Math.max(
        1,
        Math.min(maxCols, Math.floor((width + gap) / (minColWidth + gap))),
      );
      const colWidth = (width - (cols - 1) * gap) / cols;
      const spans = els.map((w) => Math.min(cols, Math.max(1, Number(w.dataset.cols) || 1)));

      // Pass 1 — set widths, then measure natural content height and snap it up
      // to a whole number of row units (capped per item).
      els.forEach((w, i) => {
        w.style.width = `${colWidth * spans[i] + gap * (spans[i] - 1)}px`;
        w.style.height = "auto";
      });
      const tileHeights = els.map((w) => {
        const natural = (w.firstElementChild as HTMLElement | null)?.offsetHeight ?? rowUnit;
        let rows = Math.max(1, Math.ceil((natural + gap) / (rowUnit + gap)));
        const cap = Number(w.dataset.maxRows) || 0;
        if (cap > 0) rows = Math.min(rows, cap);
        return rows * rowUnit + (rows - 1) * gap;
      });

      // Pass 2 — best-fit packing on the quantised heights.
      const colTops = new Array(cols).fill(0);
      const remaining = els.map((_, i) => i);
      const place = (idx: number, col: number, sp: number) => {
        const top = Math.max(...colTops.slice(col, col + sp));
        els[idx].style.left = `${col * (colWidth + gap)}px`;
        els[idx].style.top = `${top}px`;
        els[idx].style.height = `${tileHeights[idx]}px`;
        for (let k = col; k < col + sp; k++) colTops[k] = top + tileHeights[idx] + gap;
      };

      while (remaining.length) {
        const minTop = Math.min(...colTops);
        const c0 = colTops.findIndex((t) => t <= minTop + 0.5);
        let run = 0;
        while (c0 + run < cols && colTops[c0 + run] <= minTop + 0.5) run++;

        let pick = -1;
        let pickSpan = 0;
        for (const idx of remaining) {
          if (spans[idx] <= run && spans[idx] > pickSpan) {
            pick = idx;
            pickSpan = spans[idx];
          }
        }
        if (pick >= 0) {
          place(pick, c0, pickSpan);
        } else {
          let narrow = remaining[0];
          for (const idx of remaining) if (spans[idx] < spans[narrow]) narrow = idx;
          const sp = spans[narrow];
          let bestCol = 0;
          let bestTop = Infinity;
          for (let c = 0; c <= cols - sp; c++) {
            let top = 0;
            for (let k = c; k < c + sp; k++) top = Math.max(top, colTops[k]);
            if (top < bestTop - 0.5) {
              bestTop = top;
              bestCol = c;
            }
          }
          place(narrow, bestCol, sp);
          pick = narrow;
        }
        remaining.splice(remaining.indexOf(pick), 1);
      }

      setHeight(Math.max(0, Math.max(0, ...colTops) - gap));
    };

    layout();
    // Don't observe the tiles for size changes — we set their height, which
    // would retrigger and loop. Width changes come from the viewport; re-pack
    // once fonts load (they shift content height).
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout).catch(() => {});
    return () => window.removeEventListener("resize", layout);
  }, [items, gap, minColWidth, maxCols, rowUnit]);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height }}>
      {items.map((it) => (
        <div
          key={it.key}
          data-cols={it.cols ?? 1}
          data-max-rows={it.maxRows ?? 0}
          // The tile clips to the card radius; its child (the Card) fills it.
          className="overflow-hidden rounded-card [&>*]:h-full"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {it.node}
        </div>
      ))}
    </div>
  );
}
