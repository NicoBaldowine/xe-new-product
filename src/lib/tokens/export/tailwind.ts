import type { ExportInput } from "./index";
import type { TokenDef } from "../types";
import { TOKEN_BY_NAME } from "../registry";

/**
 * Serialize to a paste-ready Tailwind v4 stylesheet: the `:root` / `.dark` raw
 * `--xe-*` vars plus the `@theme inline` block that maps them to utilities
 * (derived from each token's `themeKeys`). Line-height theme keys (`--text-*--line-height`)
 * are emitted alongside their size. Aliased tokens emit `var(--xe-<foundation>)`,
 * so each typeset reads as its four properties referencing a foundation — the
 * two-tier structure engineering consumes (e.g. --text-h1--font-size →
 * --xe-title-h1 → --xe-size-4xl).
 */
export function toTailwindTheme({ tokens, resolved }: ExportInput): string {
  const lightCss = (t: TokenDef) =>
    t.ref && TOKEN_BY_NAME[t.ref]
      ? `var(${TOKEN_BY_NAME[t.ref].cssVar})`
      : resolved[t.name]?.light ?? t.light;
  const root = tokens
    .map((t) => `  ${t.cssVar}: ${lightCss(t)};`)
    .join("\n");
  const dark = tokens
    .filter((t) => (resolved[t.name]?.dark ?? t.dark) != null)
    .map((t) => `  ${t.cssVar}: ${resolved[t.name]?.dark ?? t.dark};`)
    .join("\n");
  const theme = tokens
    .flatMap((t) => (t.themeKeys ?? []).map((key) => `  ${key}: var(${t.cssVar});`))
    .join("\n");
  return `:root {\n${root}\n}\n\n.dark {\n${dark}\n}\n\n@theme inline {\n${theme}\n}\n`;
}
