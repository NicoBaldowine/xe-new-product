"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  icon?: IconName;
  full?: boolean;
  children?: React.ReactNode;
};

// Each variant carries its hover + pressed (active) states from the token set,
// so interaction feedback is driven by the design system, not ad-hoc brightness.
const VARIANTS: Record<Variant, string> = {
  primary: "bg-action text-on-action hover:bg-action-hover active:bg-action-pressed",
  // Destructive — solid danger fill with its own state tokens.
  danger: "bg-surface-danger text-content-white hover:bg-surface-danger-hover active:bg-surface-danger-pressed",
  // Filled, no border — for chips / round icon tiles / subtle actions.
  secondary: "bg-surface-1 text-content hover:bg-surface-2 active:bg-surface-3",
  // Bordered — the standard rectangular secondary CTA (e.g. "Create account").
  outline: "border border-stroke bg-surface-1 text-content hover:bg-surface-2 active:bg-surface-3",
  ghost: "bg-transparent text-content hover:bg-surface-1 active:bg-surface-2",
};

export function Button({
  children,
  variant = "secondary",
  icon,
  full = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97, transition: snappy }}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-button px-4",
        "font-display text-body-sm font-medium whitespace-nowrap",
        "cursor-pointer select-none transition-colors",
        full && "w-full",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </motion.button>
  );
}
