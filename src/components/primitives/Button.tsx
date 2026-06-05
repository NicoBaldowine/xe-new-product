"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { snappy } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  icon?: IconName;
  full?: boolean;
  children?: React.ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-blue-bright text-on-action",
  // Filled, no border — for chips / round icon tiles / subtle actions.
  secondary: "bg-surface-1 text-content",
  // Bordered — the standard rectangular secondary CTA (e.g. "Create account").
  outline: "border border-stroke bg-surface-1 text-content",
  ghost: "bg-transparent text-content hover:bg-surface-1",
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
