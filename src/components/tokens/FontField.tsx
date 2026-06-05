"use client";

import { FONT_OPTIONS } from "@/lib/tokens/registry";
import { cn } from "@/lib/cn";

/** Select a font face (by CSS value) for a font-role token. */
export function FontField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const known = FONT_OPTIONS.some((o) => o.value === value);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-7 w-full min-w-0 rounded-md border border-stroke bg-surface-1 px-1.5",
        "text-xs text-content outline-none focus:ring-2 focus:ring-stroke-action",
      )}
    >
      {!known && <option value={value}>Custom</option>}
      {FONT_OPTIONS.map((o) => (
        <option key={o.label} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
