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
  loadBentoInstances,
  saveBentoInstances,
  defaultBentoInstances,
  bentoColsFor,
  bentoMaxRowsFor,
  type BentoInstance,
} from "@/lib/playground/bentoConfig";

let instanceSeq = 0;
const newInstanceKey = (widgetId: string) => `${widgetId}:${++instanceSeq}-${Math.floor(Math.random() * 1e6)}`;

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
  // The bento is a LIST of instances (widget + config). Default seeds from the
  // registry's inBento flags until the user customises it.
  const [instances, setInstances] = useState<BentoInstance[]>([]);
  // 0 = deterministic default arrangement (SSR + first paint); a non-zero seed
  // picks a random width/order per instance. Set on mount and on "Shuffle" so
  // each refresh shows a different composition (same widgets, different layout).
  const [layoutSeed, setLayoutSeed] = useState(0);

  useEffect(() => {
    setInstances(loadBentoInstances() ?? defaultBentoInstances());
    setLayoutSeed(Math.floor(Math.random() * 1e9) + 1);
  }, []);

  const reshuffle = () => setLayoutSeed(Math.floor(Math.random() * 1e9) + 1);

  const persist = (next: BentoInstance[]) => {
    setInstances(next);
    saveBentoInstances(next);
  };

  /** Whether a widget's DEFAULT instance (key === widgetId) is in the bento. */
  const isInBento = (id: string) => instances.some((i) => i.key === id);

  /** Toggle the default instance for a widget (the "Show in bento" checkbox). */
  const toggleBento = (id: string, cols?: number) =>
    persist(
      isInBento(id)
        ? instances.filter((i) => i.key !== id)
        : [...instances, { key: id, widgetId: id, cols }],
    );

  /** Add the current live config as a NEW instance (a variant). */
  const addConfig = (widgetId: string, props: Record<string, unknown>, cols?: number) =>
    persist([...instances, { key: newInstanceKey(widgetId), widgetId, props, cols }]);

  const removeInstance = (key: string) => persist(instances.filter((i) => i.key !== key));

  /** Replace an instance's props + width (editing an existing config). */
  const updateInstance = (key: string, props: Record<string, unknown>, cols: number) =>
    persist(instances.map((i) => (i.key === key ? { ...i, props, cols } : i)));

  /** Set the width of an instance by key (default instance live width). */
  const setCols = (key: string, cols: number) =>
    persist(instances.map((i) => (i.key === key ? { ...i, cols } : i)));

  /** Replace the whole list from an imported config. */
  const importBento = (config: BentoInstance[]) => {
    const next = config
      .filter((c) => c && typeof c.widgetId === "string")
      .map((c) => ({ ...c, key: c.key || newInstanceKey(c.widgetId) }));
    persist(next);
  };

  // Instances → masonry items. When a layout seed is set, order + width (for
  // instances without an explicit cols) are randomised within each widget's
  // allowed bentoCols, so the same set composes differently each refresh.
  const seeded = layoutSeed > 0;
  const rand = rngFrom(layoutSeed || 1);
  const bentoItems: MasonryItem[] = (seeded ? shuffled(instances, rand) : instances)
    .map((inst) => {
      const w = WIDGETS.find((x) => x.id === inst.widgetId);
      if (!w) return null;
      const allowed = bentoColsFor(inst.widgetId);
      const cols = inst.cols ?? (seeded ? allowed[Math.floor(rand() * allowed.length)] : allowed[0]);
      const props = inst.props ?? defaultProps(w);
      return {
        key: inst.key,
        cols,
        maxRows: bentoMaxRowsFor(inst.widgetId),
        node:
          w.source === "figma-widget" ? (
            <WidgetShell variant="desktop">{w.render(props)}</WidgetShell>
          ) : (
            w.render(props)
          ),
      } as MasonryItem;
    })
    .filter((x): x is MasonryItem => x !== null);
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
              instances={instances}
              isInBento={isInBento}
              onToggleBento={toggleBento}
              onAddConfig={addConfig}
              onUpdateInstance={updateInstance}
              onSetCols={setCols}
              onRemoveInstance={removeInstance}
              onImportBento={importBento}
            />
          ) : isMobile ? (
            /* Mobile: the consumer widget set in the phone frame. Same widgets +
               layoutIds as the desktop consumer view → they morph on toggle. */
            <MobileFrame>
              {MOBILE_ORDER.map((w) => (
                <WidgetShell key={w.id} variant="mobile" layoutId={w.id} bare={w.bare || w.bareMobile}>
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
