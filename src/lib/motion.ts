import type { Variants, Transition } from "motion/react";

/** Shared settling spring used across the bento. */
export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/** Snappier spring for hover/press micro-interactions. */
export const snappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
};

/** Parent orchestrator — staggers its children's entrance. */
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.08 },
  },
};

/** Intermediate wrapper (region/column) — cascades the stagger to its children. */
export const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

/** Per-card entrance. Cards inherit these keys from the container — lift + fade
 *  + settle, no blur. */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
};

/** Reduced-motion variant: fade only, no transform. */
export const cardVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

/**
 * The card's own (grey) border draws itself on entrance. A normalized SVG rect
 * in the stroke colour traces the outline (pathLength 0→1) and STAYS — it is the
 * border, not an overlay. Inherits hidden/visible from the card so it staggers
 * in sync with the entrance. Bento view only (see DrawStrokeContext). */
export const strokeDrawVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
  },
};
