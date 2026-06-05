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
import { Icon } from "@/components/primitives/Icon";
import { MOBILE_ORDER } from "./consumer/widgets";
import { WIDGETS } from "@/lib/playground/registry";
import { defaultProps } from "@/lib/playground/types";
import {
  loadBentoOverrides,
  saveBentoOverrides,
  isInBento,
  loadBentoSpans,
  saveBentoSpans,
  bentoSpanFor,
  bentoColsFor,
  bentoMaxRowsFor,
  type BentoOverrides,
  type BentoSpans,
} from "@/lib/playground/bentoConfig";

/** Deterministic PRNG (mulberry32) so a layout seed reproduces the same arrangement. */
function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BentoStage() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewMode>("bento");
  const [editorOpen, setEditorOpen] = useState(false);
  const [bentoOverrides, setBentoOverrides] = useState<BentoOverrides>({});
  const [bentoSpans, setBentoSpans] = useState<BentoSpans>({});
  // 0 = deterministic default arrangement (SSR + first paint); a non-zero seed
  // picks a random width/order per widget. Set on mount and on "Shuffle" so each
  // refresh shows a different composition (same widgets, different layout).
  const [layoutSeed, setLayoutSeed] = useState(0);

  // Load the saved bento selection + per-widget spans after mount (SSR-safe;
  // defaults come from the registry's inBento/bentoSpan until then).
  useEffect(() => {
    setBentoOverrides(loadBentoOverrides());
    setBentoSpans(loadBentoSpans());
    setLayoutSeed(Math.floor(Math.random() * 1e9) + 1);
  }, []);

  const reshuffle = () => setLayoutSeed(Math.floor(Math.random() * 1e9) + 1);

  const toggleBento = (id: string) =>
    setBentoOverrides((prev) => {
      const next = { ...prev, [id]: !isInBento(id, prev) };
      saveBentoOverrides(next);
      return next;
    });

  const setBentoSpan = (id: string, span: number) =>
    setBentoSpans((prev) => {
      const next = { ...prev, [id]: span };
      saveBentoSpans(next);
      return next;
    });

  /** Replace the bento config from an imported list ([{id, inBento, bentoSpan?}]). */
  const importBento = (config: { id: string; inBento: boolean; bentoSpan?: number }[]) => {
    const nextOverrides: BentoOverrides = {};
    const nextSpans: BentoSpans = {};
    for (const c of config) {
      if (!c || typeof c.id !== "string") continue;
      nextOverrides[c.id] = !!c.inBento;
      if (typeof c.bentoSpan === "number") nextSpans[c.id] = c.bentoSpan;
    }
    setBentoOverrides(nextOverrides);
    saveBentoOverrides(nextOverrides);
    setBentoSpans(nextSpans);
    saveBentoSpans(nextSpans);
  };

  // Catalog widgets selected for the bento, as masonry items. When a layout seed
  // is set, order and per-widget width are randomised (within each widget's
  // allowed bentoCols) to showcase how flexibly the same widgets compose; an
  // explicit Playground width override always wins.
  const seeded = layoutSeed > 0;
  const rand = rngFrom(layoutSeed || 1);
  const selected = WIDGETS.filter((w) => isInBento(w.id, bentoOverrides));
  const bentoItems: MasonryItem[] = (seeded ? shuffled(selected, rand) : selected).map((w) => {
    const allowed = bentoColsFor(w.id);
    const override = w.id in bentoSpans ? bentoSpans[w.id] : undefined;
    const cols = override ?? (seeded ? allowed[Math.floor(rand() * allowed.length)] : allowed[0]);
    return {
      key: w.id,
      cols,
      maxRows: bentoMaxRowsFor(w.id),
      node:
        w.source === "figma-widget" ? (
          <WidgetShell variant="desktop">{w.render(defaultProps(w))}</WidgetShell>
        ) : (
          w.render(defaultProps(w))
        ),
    };
  });
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
            {view === "bento" && (
              <button
                type="button"
                onClick={reshuffle}
                title="Shuffle the bento layout — same widgets, new composition"
                className="flex items-center gap-1.5 rounded-full border border-stroke bg-surface px-3 py-1.5 text-xs font-medium text-content transition-colors hover:bg-surface-1"
              >
                <Icon name="shuffle" size={14} /> Shuffle
              </button>
            )}
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
              onImportBento={importBento}
              getSpan={(id) => bentoSpanFor(id, bentoSpans)}
              onSetSpan={setBentoSpan}
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
            /* Bento: a fixed-column grid (up to 4 cols) of the widgets selected
               in the Playground. Heights snap to a row unit so tiles align and
               content-heavy widgets are capped (bentoMaxRows); width + order are
               randomised per refresh / Shuffle. Best-fit packing keeps it
               gap-free; cards draw their grey border on entrance. */
            <DrawStrokeContext.Provider value={!reduce}>
              <motion.div
                key={layoutSeed}
                variants={containerVariants}
                initial={reduce ? false : "hidden"}
                animate="visible"
              >
                <Masonry items={bentoItems} minColWidth={260} maxCols={4} gap={24} rowUnit={72} />
              </motion.div>
            </DrawStrokeContext.Provider>
          )}
        </LayoutGroup>
      </div>

      <TokenEditorPanel open={editorOpen} onClose={() => setEditorOpen(false)} />
    </main>
  );
}
