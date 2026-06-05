"use client";

import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

/** Header button that opens the token editor panel. */
export function EditorToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label="Edit design tokens"
      aria-pressed={open}
      onClick={onToggle}
      className={cn(
        "grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-stroke transition-colors",
        open ? "bg-surface-1 text-content" : "bg-surface text-content-secondary hover:text-content",
      )}
    >
      <Icon name="sliders" size={18} />
    </button>
  );
}
