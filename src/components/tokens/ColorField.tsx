"use client";

import { cn } from "@/lib/cn";

/** 6-digit hex prefix for the native color input (it can't represent alpha). */
function hex6(value: string): string {
  const m = /^#([0-9a-fA-F]{6})/.exec(value.trim());
  return m ? `#${m[1]}` : "#000000";
}

/**
 * Color editor: a native swatch (drives the 6-digit RGB) + a free hex text input
 * that accepts 8-digit hex with alpha (e.g. #0a0a0a0d). The text field is the
 * source of truth so alpha survives editing the swatch.
 */
export function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-stroke">
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: value }}
        />
        <input
          type="color"
          aria-label="Pick colour"
          value={hex6(value)}
          onChange={(e) => {
            // preserve any alpha suffix the text value carried
            const alpha = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})$/.exec(value)?.[1] ?? "";
            onChange(e.target.value + alpha);
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <input
        type="text"
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-6 w-full min-w-0 rounded-md border border-stroke bg-surface-1 px-1.5",
          "font-mono text-[11px] text-content tabular-nums outline-none",
          "focus:ring-2 focus:ring-stroke-brand",
        )}
      />
    </div>
  );
}
