import { TOKENS, TOKEN_BY_NAME } from "./registry";

/**
 * Map a rendered widget's Tailwind classes back to the design tokens it uses, so
 * the Playground can show + edit exactly the tokens a component consumes.
 *
 * The reverse map is derived from each token's `themeKeys` (the Tailwind `@theme`
 * vars it drives), so it stays in sync with the registry automatically:
 *   --color-X      → text-X / bg-X / border-X / from-X / …   (colour utilities)
 *   --text-X       → text-X                                   (size / typeset)
 *   --radius-X     → rounded-X
 *   --font-X       → font-X                                   (family + weight)
 *   --blur-X       → blur-X / backdrop-blur-X
 */

// Full utility class → token name (radius, fonts, weights, blur, text sizes).
const byUtility = new Map<string, string>();
// Colour name (the part after the prefix) → token name.
const byColorName = new Map<string, string>();

for (const t of TOKENS) {
  for (const key of t.themeKeys ?? []) {
    if (key.startsWith("--color-")) {
      byColorName.set(key.slice("--color-".length), t.name);
    } else if (key.startsWith("--text-") && !key.slice("--text-".length).includes("--")) {
      byUtility.set("text-" + key.slice("--text-".length), t.name);
    } else if (key.startsWith("--radius-")) {
      byUtility.set("rounded-" + key.slice("--radius-".length), t.name);
    } else if (key.startsWith("--font-weight-")) {
      byUtility.set("font-" + key.slice("--font-weight-".length), t.name);
    } else if (key.startsWith("--font-")) {
      byUtility.set("font-" + key.slice("--font-".length), t.name);
    } else if (key.startsWith("--tracking-")) {
      byUtility.set("tracking-" + key.slice("--tracking-".length), t.name);
    } else if (key.startsWith("--blur-")) {
      const x = key.slice("--blur-".length);
      byUtility.set("blur-" + x, t.name);
      byUtility.set("backdrop-blur-" + x, t.name);
    }
  }
}

const COLOR_PREFIX =
  /^(?:text|bg|border|from|via|to|ring|fill|divide|outline|accent|caret|placeholder|decoration)-(.+)$/;

/** Token names used in the subtree of `root`, in registry order. Sub-tokens of a
 *  typeset are expanded so the whole text style is shown/editable. */
export function scanTokenUsage(root: HTMLElement | null): string[] {
  if (!root) return [];
  const classes = new Set<string>();
  const collect = (el: Element) => {
    const cls = el.getAttribute("class");
    if (cls) for (const c of cls.split(/\s+/)) classes.add(c);
  };
  // Scan only the widget subtree(s) (data-widget-root), not surrounding chrome.
  const widgetRoots = root.querySelectorAll("[data-widget-root]");
  const targets = widgetRoots.length ? Array.from(widgetRoots) : [root];
  for (const tgt of targets) tgt.querySelectorAll("[class]").forEach(collect);

  const found = new Set<string>();
  for (const raw of classes) {
    // Strip responsive/state variants ("hover:", "dark:", "@[..]:") and opacity ("/50").
    const c = raw.split(":").pop()!.split("/")[0];
    const direct = byUtility.get(c);
    if (direct) {
      found.add(direct);
      continue;
    }
    const m = c.match(COLOR_PREFIX);
    if (m) {
      const tok = byColorName.get(m[1]);
      if (tok) found.add(tok);
    }
  }

  // Expand typeset sub-tokens (size match → whole text style).
  const out = new Set<string>();
  for (const name of found) {
    const def = TOKEN_BY_NAME[name];
    if (def?.typeset) {
      for (const t of TOKENS) if (t.typeset === def.typeset) out.add(t.name);
    } else {
      out.add(name);
    }
  }
  // Pull in the foundations those tokens alias, so the editable primitive rows
  // (size-* / leading-* / tracking-* / weight-*) show up next to the typesets.
  for (const name of [...out]) {
    const ref = TOKEN_BY_NAME[name]?.ref;
    if (ref) out.add(ref);
  }
  return TOKENS.filter((t) => out.has(t.name)).map((t) => t.name);
}
