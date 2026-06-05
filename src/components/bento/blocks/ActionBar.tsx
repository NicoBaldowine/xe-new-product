"use client";

import { motion } from "motion/react";
import { cardVariants } from "@/lib/motion";
import { Button } from "@/components/primitives/Button";
import { actions } from "@/lib/fixtures";
import type { IconName } from "@/components/primitives/Icon";

/** Bare row of quick actions across the top of the right region. */
export function ActionBar() {
  return (
    <motion.div layoutId="action-bar" variants={cardVariants} className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Button key={a.label} icon={a.icon as IconName} variant={a.primary ? "primary" : "outline"}>
          {a.label}
        </Button>
      ))}
    </motion.div>
  );
}
