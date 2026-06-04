"use client";

import { useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { containerVariants } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { DrawStrokeContext } from "@/components/primitives/Card";
import { ThemeToggle } from "./ThemeToggle";
import { ViewToggle, type ViewMode } from "./ViewToggle";
import { EditorToggle } from "@/components/tokens/EditorToggle";
import { TokenEditorPanel } from "@/components/tokens/TokenEditorPanel";
import { MobileFrame } from "./MobileFrame";
import { CorporateView } from "./CorporateView";
import { ConsumerView } from "./ConsumerView";
import { PlaygroundView } from "./PlaygroundView";
import { WidgetShell } from "@/components/primitives/WidgetShell";
import { MOBILE_ORDER } from "./consumer/widgets";

import { TotalBalanceCard } from "./blocks/TotalBalanceCard";
import { AccountBalanceCard } from "./blocks/AccountBalanceCard";
import { SendAgainCard } from "./blocks/SendAgainCard";
import { RateChartCard } from "./blocks/RateChartCard";
import { ActivityEmptyCard } from "./blocks/ActivityEmptyCard";
import { TransactionsTableCard } from "./blocks/TransactionsTableCard";
import { ActionBar } from "./blocks/ActionBar";
import { RateWatchCard } from "./blocks/RateWatchCard";
import { SendInternationallyCard } from "./blocks/SendInternationallyCard";
import { VerifyIdCard } from "./blocks/VerifyIdCard";
import { TravelPromoCard } from "./blocks/TravelPromoCard";
import { AccountsListCard } from "./blocks/AccountsListCard";
import { RecentActivitiesCard } from "./blocks/RecentActivitiesCard";

export function BentoStage() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewMode>("bento");
  const [editorOpen, setEditorOpen] = useState(false);
  const isMobile = view === "mobile";
  const isCorporate = view === "corporate";
  const isConsumer = view === "consumer";
  const isPlayground = view === "playground";

  return (
    <main className="min-h-screen bg-canvas px-6 py-8 transition-colors lg:px-10">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-8">
        <header className="flex items-center justify-between">
          <ViewToggle value={view} onChange={setView} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <EditorToggle open={editorOpen} onToggle={() => setEditorOpen((v) => !v)} />
          </div>
        </header>

        <LayoutGroup>
          {isPlayground ? (
            /* Interactive widget sandbox — stress widgets with live controls. */
            <PlaygroundView />
          ) : isMobile ? (
            /* Mobile: the consumer widget set in the phone frame. Same widgets +
               layoutIds as the desktop consumer view → they morph on toggle. */
            <MobileFrame>
              {MOBILE_ORDER.map((w) => (
                <WidgetShell key={w.id} variant="mobile" layoutId={w.id} bare={w.bare}>
                  {w.el}
                </WidgetShell>
              ))}
            </MobileFrame>
          ) : isConsumer ? (
            /* Consumer desktop: placeholder until the design reference lands. */
            <ConsumerView />
          ) : isCorporate ? (
            /* Corporate: web-app shell — sidebar + existing blocks. */
            <CorporateView />
          ) : (
            /* Bento: a masonry of every block. Columns are min ~300px wide so
               nothing squeezes/overlaps — cards flow and wrap as space allows.
               Each block draws its grey border on entrance. */
            <DrawStrokeContext.Provider value={!reduce}>
              <motion.div
                variants={containerVariants}
                initial={reduce ? false : "hidden"}
                animate="visible"
                className="grid grid-cols-1 gap-8 [grid-auto-flow:dense] sm:grid-cols-2 xl:grid-cols-3"
              >
                {(
                  [
                    { key: "total", el: <TotalBalanceCard /> },
                    { key: "rate", el: <RateChartCard /> },
                    { key: "acct", el: <AccountBalanceCard /> },
                    { key: "actions", el: <ActionBar />, span: true },
                    { key: "again", el: <SendAgainCard count={2} /> },
                    { key: "watch", el: <RateWatchCard /> },
                    { key: "send", el: <SendInternationallyCard /> },
                    { key: "tx", el: <TransactionsTableCard />, span: true },
                    { key: "promo", el: <TravelPromoCard /> },
                    { key: "accts", el: <AccountsListCard /> },
                    { key: "empty", el: <ActivityEmptyCard /> },
                    { key: "verify", el: <VerifyIdCard /> },
                    { key: "recent", el: <RecentActivitiesCard /> },
                  ] as const
                ).map((it) => (
                  <div
                    key={it.key}
                    className={cn("min-w-0", "span" in it && it.span && "sm:col-span-2")}
                  >
                    {it.el}
                  </div>
                ))}
              </motion.div>
            </DrawStrokeContext.Provider>
          )}
        </LayoutGroup>
      </div>

      <TokenEditorPanel open={editorOpen} onClose={() => setEditorOpen(false)} />
    </main>
  );
}
