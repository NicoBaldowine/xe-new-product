import type { Edits } from "./types";
import { TOKEN_BY_NAME } from "./registry";

/**
 * Parse a pasted token document into an Edits map. Accepts:
 *  · W3C DTCG JSON (our export) — groups of { $value, $extensions["xe.theme.dark"] }
 *  · CSS variables — `:root { --xe-name: value }` + `.dark { … }`
 * Unknown token names are ignored. Throws on unparseable input.
 */
export function parseTokens(text: string): Edits {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Empty input");
  return trimmed.startsWith("{") ? parseDTCG(trimmed) : parseCss(trimmed);
}

function setEdit(edits: Edits, name: string, theme: "light" | "dark", value: string) {
  if (!TOKEN_BY_NAME[name]) return; // ignore unknown tokens
  edits[name] = { ...edits[name], [theme]: value };
}

function parseDTCG(text: string): Edits {
  const json = JSON.parse(text) as Record<string, Record<string, unknown>>;
  const edits: Edits = {};
  for (const group of Object.values(json)) {
    if (!group || typeof group !== "object") continue;
    for (const [name, token] of Object.entries(group)) {
      if (!token || typeof token !== "object" || !("$value" in token)) continue;
      const t = token as { $value: unknown; $extensions?: Record<string, unknown> };
      if (typeof t.$value === "string") setEdit(edits, name, "light", t.$value);
      const dark = t.$extensions?.["xe.theme.dark"];
      if (typeof dark === "string") setEdit(edits, name, "dark", dark);
    }
  }
  return edits;
}

function parseCss(text: string): Edits {
  const edits: Edits = {};
  // crude scope split: everything after `.dark` is dark.
  const darkIdx = text.search(/\.dark\s*\{/);
  const lightPart = darkIdx >= 0 ? text.slice(0, darkIdx) : text;
  const darkPart = darkIdx >= 0 ? text.slice(darkIdx) : "";
  const re = /--xe-([\w-]+)\s*:\s*([^;]+);/g;
  for (const [, name, value] of lightPart.matchAll(re)) setEdit(edits, name, "light", value.trim());
  for (const [, name, value] of darkPart.matchAll(re)) setEdit(edits, name, "dark", value.trim());
  return edits;
}
