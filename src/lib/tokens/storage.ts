import type { Edits } from "./types";

const KEY = "xe-token-edits";
const VERSION = 1;

type Stored = { v: number; edits: Edits };

/** Read persisted edits; returns {} on miss / parse error / version mismatch. */
export function loadEdits(): Edits {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed || parsed.v !== VERSION || typeof parsed.edits !== "object") return {};
    return parsed.edits ?? {};
  } catch {
    return {};
  }
}

export function saveEdits(edits: Edits): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, edits } satisfies Stored));
  } catch {
    /* quota / unavailable — ignore */
  }
}

export function clearEdits(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
