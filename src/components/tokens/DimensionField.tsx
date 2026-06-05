"use client";

import { cn } from "@/lib/cn";

/** Plain text editor for dimensions (`12px`), weights (`600`), etc. */
export function DimensionField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-7 w-full min-w-0 rounded-md border border-stroke bg-surface-1 px-2",
        "font-mono text-xs text-content tabular-nums outline-none",
        "focus:ring-2 focus:ring-stroke-action",
      )}
    />
  );
}
