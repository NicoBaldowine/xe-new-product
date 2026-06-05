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
