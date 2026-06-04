"use client";

import { createContext, useContext } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

/**
 * The container a widget renders in. A pure *content* component reads this to
 * make minor responsive choices (inline vs stacked) — it must never fork into
 * two components. Mirrors the DrawStrokeContext pattern.
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
 * The only place that decides a widget's outer surface.
 *  · desktop → the standard Card (rounded-card, border-stroke, p-6).
 *  · mobile  → the phone-cell surface used inside MobileFrame (same token surface,
 *              edge-to-edge rhythm). Content stays identical → "same structure,
 *              different container."
 */
export function WidgetShell({ variant, layoutId, flush, className, children }: WidgetShellProps) {
  return (
    <WidgetContainerContext.Provider value={variant}>
      <Card
        layoutId={layoutId}
        flush={flush}
        className={cn(variant === "mobile" && "w-full", className)}
      >
        {children}
      </Card>
    </WidgetContainerContext.Provider>
  );
}
