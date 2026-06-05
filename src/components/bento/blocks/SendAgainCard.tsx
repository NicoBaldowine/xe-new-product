"use client";

import { motion } from "motion/react";
import { cardVariants } from "@/lib/motion";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { sendAgain as data } from "@/lib/fixtures";

/** Bare block (no card surface) — a label over a row of recipient chips. */
export function SendAgainCard({ count }: { count?: number } = {}) {
  const rows = count ? data.slice(0, count) : data;
  return (
    <motion.div layoutId="send-again" variants={cardVariants} className="flex flex-col gap-3">
      <Eyebrow>Send again</Eyebrow>
      {/* Fixed-width chips that scroll horizontally; a right-edge mask fades the
          overflow so it reads as "more to scroll" (bg-agnostic, works in any
          container / theme). */}
      <div className="flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [mask-image:linear-gradient(to_right,#000_90%,transparent)] [&::-webkit-scrollbar]:hidden">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex w-44 shrink-0 items-center gap-2 rounded-xl border border-stroke bg-surface px-3 py-2.5"
          >
            <Figure initials={r.initials} flag={undefined} size={32} />
            <div className="min-w-0">
              <p className="truncate font-display text-body-sm font-medium text-content">{r.name}</p>
              <p className="truncate text-xs text-content-secondary">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
