"use client";

import { Children } from "react";
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

/**
 * A centered phone-device frame. The first child is the Hero — rendered full-
 * bleed at the top with the status bar overlaid on its gradient, so it blends
 * into the device. The rest stack in a padded, scrollable column below.
 */
export function MobileFrame({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  const [hero, ...rest] = items;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...spring, delay: 0.05 }}
      className="mx-auto w-full max-w-[400px]"
    >
      <div className="relative flex max-h-[82vh] flex-col overflow-hidden rounded-[40px] border border-stroke bg-canvas">
        {/* Hero — full-bleed; the status bar floats over its gradient. */}
        <div className="relative shrink-0">
          {hero}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
            <StatusBar />
          </div>
        </div>
        <motion.div
          variants={groupVariants}
          initial={false}
          animate="visible"
          className="flex flex-col gap-6 overflow-y-auto px-5 pb-8 pt-5"
        >
          {rest}
        </motion.div>
      </div>
    </motion.div>
  );
}
