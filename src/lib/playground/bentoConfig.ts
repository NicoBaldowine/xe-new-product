import { WIDGETS } from "./registry";

/**
 * Which catalog widgets appear in the Bento showcase. The registry's `inBento`
 * flags are the committed default (the project's source of truth); the Playground
 * lets you override per-widget, persisted to localStorage so the choice survives
 * rebuilds (per browser). Export the config to bake a new default into the repo.
 */
const KEY = "xe-bento-widgets";

export type BentoOverrides = Record<string, boolean>;

export function loadBentoOverrides(): BentoOverrides {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as BentoOverrides) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveBentoOverrides(o: BentoOverrides): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* ignore */
  }
}

/** Is a widget shown in the bento? override ?? registry default. */
export function isInBento(id: string, overrides: BentoOverrides): boolean {
  if (id in overrides) return overrides[id];
  return WIDGETS.find((w) => w.id === id)?.inBento ?? false;
}

/* ── Bento width (column span) ─────────────────────────────────────────────
   The span is the widget's footprint in the masonry: 1 = single column, 2 =
   wide (tables / charts / action bars), 99 = full row. The registry's
   `bentoSpan` is the committed default (derived from each widget's content
   density); the Playground lets you override it live, persisted per browser. */
const SPAN_KEY = "xe-bento-spans";

export type BentoSpans = Record<string, number>;

/** Treated as "full row" — clamped to the live column count by the masonry. */
export const FULL_SPAN = 99;

export function loadBentoSpans(): BentoSpans {
  try {
    const raw = localStorage.getItem(SPAN_KEY);
    const parsed = raw ? (JSON.parse(raw) as BentoSpans) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveBentoSpans(s: BentoSpans): void {
  try {
    localStorage.setItem(SPAN_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/** Effective span for a widget: override ?? registry default ?? 1. */
export function bentoSpanFor(id: string, spans: BentoSpans): number {
  if (id in spans) return spans[id];
  return WIDGETS.find((w) => w.id === id)?.bentoSpan ?? 1;
}
