"use client";

import { useEffect, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { containerVariants } from "@/lib/motion";
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
import { Masonry, type MasonryItem } from "@/components/primitives/Masonry";
import { MOBILE_ORDER } from "./consumer/widgets";
import { WIDGETS } from "@/lib/playground/registry";
import { defaultProps } from "@/lib/playground/types";
import {
  loadBentoOverrides,
  saveBentoOverrides,
  isInBento,
  type BentoOverrides,
} from "@/lib/playground/bentoConfig";

export function BentoStage() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewMode>("bento");
  const [editorOpen, setEditorOpen] = useState(false);
  const [bentoOverrides, setBentoOverrides] = useState<BentoOverrides>({});

  // Load the saved bento selection after mount (SSR-safe; defaults come from
  // the registry's inBento flags until then).
  useEffect(() => {
    setBentoOverrides(loadBentoOverrides());
  }, []);

  const toggleBento = (id: string) =>
    setBentoOverrides((prev) => {
      const next = { ...prev, [id]: !isInBento(id, prev) };
      saveBentoOverrides(next);
      return next;
    });

  // Catalog widgets selected for the bento, as masonry items.
  const bentoItems: MasonryItem[] = WIDGETS.filter((w) => isInBento(w.id, bentoOverrides)).map((w) => ({
    key: w.id,
    span: w.bentoSpan ?? 1,
    node:
      w.source === "figma-widget" ? (
        <WidgetShell variant="desktop">{w.render(defaultProps(w))}</WidgetShell>
      ) : (
        w.render(defaultProps(w))
      ),
  }));
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
            <PlaygroundView
              isInBento={(id) => isInBento(id, bentoOverrides)}
              onToggleBento={toggleBento}
            />
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
            /* Bento: a true masonry of the widgets selected in the Playground
               ("Show in bento"); large widgets span 2 columns. Cards draw their
               grey border on entrance. */
            <DrawStrokeContext.Provider value={!reduce}>
              <motion.div
                variants={containerVariants}
                initial={reduce ? false : "hidden"}
                animate="visible"
              >
                <Masonry items={bentoItems} minColWidth={320} gap={32} />
              </motion.div>
            </DrawStrokeContext.Provider>
          )}
        </LayoutGroup>
      </div>

      <TokenEditorPanel open={editorOpen} onClose={() => setEditorOpen(false)} />
    </main>
  );
}
