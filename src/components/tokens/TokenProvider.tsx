"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Edits, ResolvedTokens, Theme } from "@/lib/tokens/types";
import { TOKEN_BY_NAME } from "@/lib/tokens/registry";
import { buildOverrideCss, buildResolved, resolveValue } from "@/lib/tokens/css";
import {
  clearEdits,
  loadEdits,
  saveEdits,
  loadVersions,
  saveVersions,
  type TokenVersion,
} from "@/lib/tokens/storage";

const STYLE_ID = "xe-token-overrides";

interface TokenContextValue {
  /** Sparse edits over registry defaults. */
  edits: Edits;
  /** Whether any edit exists. */
  isDirty: boolean;
  /** Theme the panel is currently editing (decoupled from the displayed theme). */
  editingTheme: Theme;
  setEditingTheme: (t: Theme) => void;
  /** Resolved value (edit ?? default) for a token in a theme. */
  getValue: (name: string, theme: Theme) => string;
  /** Set one token's value for a theme — applies live + persists. */
  setValue: (name: string, theme: Theme, value: string) => void;
  /** Reset one token (both themes) to its registry default. */
  resetToken: (name: string) => void;
  /** Reset everything. */
  resetAll: () => void;
  /** Full resolved snapshot for the exporters. */
  snapshot: () => ResolvedTokens;
  /** Saved named+dated snapshots (sources of truth). */
  versions: TokenVersion[];
  /** Save the current edits as a named version (the new source of truth). */
  saveVersion: (name: string) => void;
  /** Restore a saved version's edits. */
  applyVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
}

const TokenContext = createContext<TokenContextValue | null>(null);

export function useTokens(): TokenContextValue {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useTokens must be used within <TokenProvider>");
  return ctx;
}

export function TokenProvider({ children }: { children: React.ReactNode }) {
  // Server + first client render start empty → SSR-safe (no hydration mismatch).
  const [edits, setEdits] = useState<Edits>({});
  const [editingTheme, setEditingTheme] = useState<Theme>("light");
  const [versions, setVersions] = useState<TokenVersion[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted edits + versions after mount. Starting empty on the server +
  // first client render keeps SSR markup identical; hydrating from localStorage
  // here is the intended one-time sync (not a cascading-render loop).
  useEffect(() => {
    const stored = loadEdits();
    if (Object.keys(stored).length) setEdits(stored);
    const v = loadVersions();
    if (v.length) setVersions(v);
  }, []);

  // Keep the runtime override <style> in sync with edits.
  useEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = buildOverrideCss(edits);
  }, [edits]);

  // Debounced persistence (color/dimension drags fire rapidly).
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (Object.keys(edits).length) saveEdits(edits);
      else clearEdits();
    }, 150);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [edits]);

  const getValue = useCallback(
    (name: string, theme: Theme) => resolveValue(name, theme, edits),
    [edits],
  );

  const setValue = useCallback((name: string, theme: Theme, value: string) => {
    setEdits((prev) => {
      const def = TOKEN_BY_NAME[name];
      if (!def) return prev;
      // Theme-invariant tokens only ever write `light`.
      const key = def.dark == null ? "light" : theme;
      return { ...prev, [name]: { ...prev[name], [key]: value } };
    });
  }, []);

  const resetToken = useCallback((name: string) => {
    setEdits((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => setEdits({}), []);

  const snapshot = useCallback(() => buildResolved(edits), [edits]);

  const persistVersions = useCallback((next: TokenVersion[]) => {
    setVersions(next);
    saveVersions(next);
  }, []);

  const saveVersion = useCallback(
    (name: string) => {
      const version: TokenVersion = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        name: name.trim() || `Version ${versions.length + 1}`,
        date: new Date().toISOString(),
        edits,
      };
      persistVersions([version, ...versions]);
    },
    [edits, versions, persistVersions],
  );

  const applyVersion = useCallback(
    (id: string) => {
      const v = versions.find((x) => x.id === id);
      if (v) setEdits(v.edits);
    },
    [versions],
  );

  const deleteVersion = useCallback(
    (id: string) => persistVersions(versions.filter((v) => v.id !== id)),
    [versions, persistVersions],
  );

  const value = useMemo<TokenContextValue>(
    () => ({
      edits,
      isDirty: Object.keys(edits).length > 0,
      editingTheme,
      setEditingTheme,
      getValue,
      setValue,
      resetToken,
      resetAll,
      snapshot,
      versions,
      saveVersion,
      applyVersion,
      deleteVersion,
    }),
    [edits, editingTheme, getValue, setValue, resetToken, resetAll, snapshot, versions, saveVersion, applyVersion, deleteVersion],
  );

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}
