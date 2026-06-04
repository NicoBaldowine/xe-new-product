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

/** A saved, named snapshot of the token edits — a "source of truth" you can restore. */
export type TokenVersion = { id: string; name: string; date: string; edits: Edits };

const VERSIONS_KEY = "xe-token-versions";

export function loadVersions(): TokenVersion[] {
  try {
    const raw = localStorage.getItem(VERSIONS_KEY);
    const parsed = raw ? (JSON.parse(raw) as TokenVersion[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVersions(versions: TokenVersion[]): void {
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  } catch {
    /* ignore */
  }
}
