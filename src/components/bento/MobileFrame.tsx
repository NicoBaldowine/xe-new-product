"use client";

import { motion } from "motion/react";
import { groupVariants, spring } from "@/lib/motion";

/**
 * iOS-style status bar rendered from the exported `statusbar.svg`. The asset is
 * white-only, so we paint it via a CSS mask + `bg-content` to make it follow the
 * theme's text color (black in light, white in dark).
 */
function StatusBar() {
  return (
    <div
      aria-hidden="true"
      className="w-full bg-content"
      style={{
        aspectRatio: "393 / 62",
        WebkitMaskImage: "url(/assets/statusbar.svg)",
        maskImage: "url(/assets/statusbar.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

/** "Welcome, Ziai" greeting row with bell + avatar — mirrors the app reference. */
function Greeting() {
  return (
    <div className="flex items-center justify-between px-5 pb-2 pt-2">
      <span className="font-display text-lg font-semibold text-content">Welcome, Ziai</span>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-1 text-content">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-1 text-content">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/**
 * A centered phone-device frame. The chrome (status bar / greeting / bezel)
 * fades in while the bento cards morph into the stacked content below.
 */
export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...spring, delay: 0.05 }}
      className="mx-auto w-full max-w-[400px]"
    >
      <div className="flex max-h-[82vh] flex-col overflow-hidden rounded-[40px] border border-stroke bg-canvas">
        <StatusBar />
        <Greeting />
        <motion.div
          variants={groupVariants}
          initial={false}
          animate="visible"
          className="flex flex-col gap-5 overflow-y-auto px-5 pb-8 pt-2"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
