"use client";

import { createContext, useContext } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cardVariants, strokeDrawVariants } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * When true, a card's grey border is drawn on (SVG trace) instead of shown
 * statically. Only the bento view opts in — consumer / corporate / mobile keep
 * a plain CSS border. */
export const DrawStrokeContext = createContext(false);

type CardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  /** Reserved (no hover lift); kept for API stability. */
  interactive?: boolean;
  /** Remove default padding (tables, media cards manage their own). */
  flush?: boolean;
  children?: React.ReactNode;
};

/**
 * The bento's base surface. Motion-enabled: inherits the parent stagger via
 * `cardVariants` and carries a `layoutId` for the future morph. No hover motion.
 */
export function Card({
  className,
  children,
  interactive: _interactive = true,
  flush = false,
  ...props
}: CardProps) {
  const drawStroke = useContext(DrawStrokeContext);
  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "relative rounded-card border bg-surface text-content",
        // When drawing, the grey CSS border is transparent (the SVG rect below
        // becomes the visible border); layout stays identical (1px reserved).
        drawStroke ? "border-transparent" : "border-stroke",
        !flush && "p-6",
        className,
      )}
      {...props}
    >
      {drawStroke && (
        // The card's own grey border, drawn on. Normalized (pathLength 1) so it
        // traces regardless of size; rx matches --radius-card (20px).
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
          fill="none"
        >
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="20"
            ry="20"
            pathLength={1}
            stroke="var(--color-stroke)"
            strokeWidth={1}
            variants={strokeDrawVariants}
          />
        </svg>
      )}
      {children}
    </motion.div>
  );
}
