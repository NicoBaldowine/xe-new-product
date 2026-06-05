import type { Edits, ResolvedTokens, Theme, TokenDef } from "./types";
import { TOKEN_BY_NAME, TOKENS } from "./registry";

/**
 * Generate the static `:root` / `.dark` custom-property block (the content that
 * lives between the `@generated:tokens` sentinels in globals.css). Theme-invariant
 * tokens (no `dark`) are emitted only in `:root`.
 */
export function buildBaseCss(tokens: TokenDef[] = TOKENS): string {
  // Aliased tokens emit `var(--xe-<ref>)` so editing the foundation cascades;
  // others emit their literal `light`.
  const baseLight = (t: TokenDef) =>
    t.ref && TOKEN_BY_NAME[t.ref] ? `var(${TOKEN_BY_NAME[t.ref].cssVar})` : t.light;
  const root = tokens.map((t) => `  ${t.cssVar}: ${baseLight(t)};`).join("\n");
  const dark = tokens
    .filter((t) => t.dark != null)
    .map((t) => `  ${t.cssVar}: ${t.dark};`)
    .join("\n");
  return `:root {\n${root}\n}\n\n.dark {\n${dark}\n}`;
}

/** Resolve a token's value for a theme = edit ?? registry default. */
export function resolveValue(name: string, theme: Theme, edits: Edits): string {
  const def = TOKEN_BY_NAME[name];
  // Unknown token name (e.g. a stale pairWith) → no value rather than a crash.
  if (!def) return "";
  const edit = edits[name];
  // Aliased token with no direct edit → follow its foundation (live cascade).
  if (def.ref && !edit) return resolveValue(def.ref, theme, edits);
  if (theme === "dark") {
    return edit?.dark ?? def.dark ?? edit?.light ?? def.light;
  }
  return edit?.light ?? def.light;
}

/** Full resolved snapshot for the exporters. */
export function buildResolved(edits: Edits, tokens: TokenDef[] = TOKENS): ResolvedTokens {
  const out: ResolvedTokens = {};
  for (const t of tokens) {
    out[t.name] = {
      // resolveValue follows `ref`, so an aliased token exports its foundation's
      // (possibly edited) value.
      light: resolveValue(t.name, "light", edits),
      // Keep dark when the registry has one OR an edit introduced one, so a dark
      // override isn't silently dropped from the export.
      ...(t.dark != null || edits[t.name]?.dark != null
        ? { dark: resolveValue(t.name, "dark", edits) }
        : {}),
    };
  }
  return out;
}

/**
 * Build the runtime override stylesheet text from the sparse edits map. Only
 * edited vars are emitted, scoped so dark edits land under `html.dark`. Injected
 * AFTER the base stylesheet, so it wins on source order and cascades through
 * `--color-*` → Tailwind utilities → inline `var(--color-*)`.
 */
export function buildOverrideCss(edits: Edits): string {
  const rootLines: string[] = [];
  const darkLines: string[] = [];
  for (const [name, edit] of Object.entries(edits)) {
    const def = TOKEN_BY_NAME[name];
    if (!def || !edit) continue;
    if (edit.light != null) rootLines.push(`${def.cssVar}: ${edit.light};`);
    if (edit.dark != null) darkLines.push(`${def.cssVar}: ${edit.dark};`);
  }
  const blocks: string[] = [];
  // Mirror the base token scopes (globals.css): light → :root + [data-theme=light],
  // dark → .dark + [data-theme=dark]. The data-theme scopes let the Playground
  // force a per-stage theme island that overrides the global theme either way.
  if (rootLines.length) blocks.push(`:root,[data-theme="light"]{${rootLines.join("")}}`);
  if (darkLines.length) blocks.push(`.dark,[data-theme="dark"]{${darkLines.join("")}}`);
  return blocks.join("\n");
}
