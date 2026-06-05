import { WIDGETS } from "./registry";

/**
 * The Bento showcase is a LIST of instances — each is a widget rendered with a
 * specific configuration (props + width). The same widget can appear multiple
 * times with different variants (e.g. Hero balance / card / eSIM), so the
 * showcase demonstrates many configurations, not just one master per widget.
 *
 * The registry's `inBento` flags seed the default list (one default instance per
 * flagged widget). The Playground edits the list — toggle the default instance,
 * add the current live config as a new instance, remove instances — persisted to
 * localStorage so it survives reloads (per browser). Export bakes a new default
 * into the repo.
 */
const KEY = "xe-bento-instances";

export type BentoInstance = {
  /** Unique key. For the per-widget "default" instance this equals the widget id. */
  key: string;
  widgetId: string;
  /** Prop overrides; undefined → the widget's default props. */
  props?: Record<string, unknown>;
  /** Column span override; undefined → randomised from the widget's allowed widths. */
  cols?: number;
};

/** Treated as "full row" — clamped to the live column count by the masonry. */
export const FULL_SPAN = 99;

/** Seed list from the registry's inBento flags — one default instance each. */
export function defaultBentoInstances(): BentoInstance[] {
  return WIDGETS.filter((w) => w.inBento).map((w) => ({ key: w.id, widgetId: w.id }));
}

/** Load the saved list, or null if the user has never customised it. */
export function loadBentoInstances(): BentoInstance[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BentoInstance[]) : null;
  } catch {
    return null;
  }
}

export function saveBentoInstances(list: BentoInstance[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

/** Column widths a widget may take in the bento (for the layout randomiser). */
export function bentoColsFor(id: string): number[] {
  const w = WIDGETS.find((x) => x.id === id);
  return w?.bentoCols ?? [w?.bentoSpan ?? 1];
}

/** Row-unit cap for a widget's bento height (undefined = uncapped). */
export function bentoMaxRowsFor(id: string): number | undefined {
  return WIDGETS.find((x) => x.id === id)?.bentoMaxRows;
}
