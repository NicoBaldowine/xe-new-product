"use client";

import { motion } from "motion/react";
import { Sidebar } from "@/components/Sidebar";
import { Figure } from "@/components/primitives/Figure";
import { containerVariants, spring } from "@/lib/motion";

import { ActionBar } from "./blocks/ActionBar";
import { SendInternationallyCard } from "./blocks/SendInternationallyCard";
import { AccountsListCard } from "./blocks/AccountsListCard";
import { TransactionsTableCard } from "./blocks/TransactionsTableCard";

/** Greeting + user chip, mirroring the corporate web-app reference. */
function CorporateHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <h1 className="font-display text-2xl font-semibold text-content">Welcome, Javo</h1>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="font-display text-sm font-semibold text-content">Javo Esquivel</p>
          <p className="text-xs text-content-secondary">Domble Industries</p>
        </div>
        <Figure initials="JE" size={40} />
      </div>
    </div>
  );
}

/**
 * The "corporate" web-app shell: a persistent left sidebar plus a main content
 * column assembled entirely from existing bento blocks. Only the Sidebar is new.
 */
export function CorporateView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="overflow-hidden rounded-card border border-stroke bg-surface"
    >
      <div className="flex">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col p-8">
          {/* All content sits in one centered, width-capped column — header,
              user chip, action bar and cards share the same bounds and stay
              centered instead of stretching edge-to-edge on wide screens. */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto flex w-full max-w-5xl flex-col gap-8"
          >
            <CorporateHeader />
            <ActionBar />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <SendInternationallyCard />
              <AccountsListCard />
            </div>
            <TransactionsTableCard />
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}
