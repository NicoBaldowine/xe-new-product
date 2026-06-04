"use client";

import { motion } from "motion/react";
import { Sidebar, type NavItem } from "@/components/Sidebar";
import { Icon } from "@/components/primitives/Icon";
import { WidgetShell } from "@/components/primitives/WidgetShell";
import { containerVariants, spring } from "@/lib/motion";
import { HERO_WIDGET, PRIMARY_WIDGETS, SECONDARY_WIDGETS } from "./consumer/widgets";

/** Consumer (personal) app navigation — see reference screenshot 2. */
const CONSUMER_NAV: NavItem[] = [
  { label: "Home", icon: "home", active: true },
  { label: "Recipients", icon: "users" },
  { label: "Payment Methods", icon: "card" },
  { label: "Payments", icon: "convert" },
  { label: "Rate Alerts", icon: "bell" },
  { label: "Help Center", icon: "help" },
];

/** "Hi, Ziai" greeting with notification + profile actions. */
function ConsumerHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="font-display text-2xl font-semibold text-content">Hi, Ziai</h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="grid h-10 w-10 place-items-center rounded-full bg-surface-1 text-content transition-colors hover:bg-surface-adaptive"
        >
          <Icon name="bell" size={18} />
        </button>
        <button
          type="button"
          aria-label="Profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-surface-1 text-content transition-colors hover:bg-surface-adaptive"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * The "consumer" (personal) web-app shell. Same sidebar + container as the
 * corporate view, but with the personal navigation and the dashboard content
 * assembled from existing bento blocks (reference screenshot 1).
 */
export function ConsumerView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="overflow-hidden rounded-card border border-stroke bg-surface"
    >
      <div className="flex">
        <Sidebar items={CONSUMER_NAV} />
        <main className="flex min-w-0 flex-1 flex-col p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto flex w-full max-w-5xl flex-col gap-6"
          >
            <ConsumerHeader />

            {/* Hero spans the full width. */}
            <WidgetShell variant="desktop" layoutId={HERO_WIDGET.id}>
              {HERO_WIDGET.el}
            </WidgetShell>

            {/* Two-column dashboard (Figma desktop "big columns"). */}
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                {PRIMARY_WIDGETS.map((w) => (
                  <WidgetShell key={w.id} variant="desktop" layoutId={w.id}>
                    {w.el}
                  </WidgetShell>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                {SECONDARY_WIDGETS.map((w) => (
                  <WidgetShell key={w.id} variant="desktop" layoutId={w.id}>
                    {w.el}
                  </WidgetShell>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}
