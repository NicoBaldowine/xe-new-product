"use client";

import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type ViewMode = "bento" | "mobile" | "consumer" | "corporate";

type Option = {
  value: ViewMode;
  icon: IconName;
  label: string;
  /** Stub modes are visible but not yet selectable. */
  disabled?: boolean;
};

const OPTIONS: Option[] = [
  { value: "bento", icon: "grid", label: "Bento" },
  { value: "mobile", icon: "phone", label: "Mobile view" },
  { value: "consumer", icon: "monitor", label: "Desktop (consumer)" },
  { value: "corporate", icon: "building", label: "Desktop (corporate)" },
];

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Layout view"
      className="flex items-center gap-1 rounded-full border border-stroke bg-surface-1 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={opt.label}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.value)}
            className={cn(
              "relative grid h-9 w-9 place-items-center rounded-full transition-colors",
              opt.disabled
                ? "cursor-not-allowed text-content-tertiary opacity-50"
                : active
                  ? "text-content"
                  : "text-content-secondary hover:text-content",
            )}
          >
            {active && (
              <motion.span
                layoutId="view-pill"
                transition={snappy}
                className="absolute inset-0 rounded-full bg-surface"
              />
            )}
            <Icon name={opt.icon} size={18} className="relative z-10" />
          </button>
        );
      })}
    </div>
  );
}
