"use client";

import { createContext, useContext } from "react";
import { motion } from "motion/react";
import { Card } from "./Card";
import { cardVariants } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * The container a widget renders in. A pure *content* component reads this to
 * make minor responsive choices — it must never fork into two components.
 */
export const WidgetContainerContext = createContext<"mobile" | "desktop">("desktop");

export function useWidgetContainer() {
  return useContext(WidgetContainerContext);
}

type WidgetShellProps = {
  variant: "mobile" | "desktop";
  /** Stable id for the cross-view morph (real views only; omit in the Playground). */
  layoutId?: string;
  /** Remove default padding (tables / media manage their own). */
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * The only place that decides a widget's outer surface. Per the XE rule:
 *  · mobile  → 16px padding, surface level-1 fill, NO border.
 *  · desktop → 24px padding, base surface, base stroke (the standard Card).
 * Same content, different container → "same structure, different container".
 */
export function WidgetShell({ variant, layoutId, flush, className, children }: WidgetShellProps) {
  if (variant === "mobile") {
    return (
      <WidgetContainerContext.Provider value="mobile">
        <motion.div
          layoutId={layoutId}
          variants={cardVariants}
          className={cn(
            "w-full rounded-card bg-surface-1 text-content",
            !flush && "p-4",
            className,
          )}
        >
          {children}
        </motion.div>
      </WidgetContainerContext.Provider>
    );
  }
  return (
    <WidgetContainerContext.Provider value="desktop">
      <Card layoutId={layoutId} flush={flush} className={cn("w-full", className)}>
        {children}
      </Card>
    </WidgetContainerContext.Provider>
  );
}
