import type { ExportInput } from "./index";

/**
 * Serialize to a paste-ready Tailwind v4 stylesheet: the `:root` / `.dark` raw
 * `--xe-*` vars plus the `@theme inline` block that maps them to utilities
 * (derived from each token's `themeKeys`). Line-height theme keys (`--text-*--line-height`)
 * are emitted alongside their size.
 */
export function toTailwindTheme({ tokens, resolved }: ExportInput): string {
  const root = tokens
    .map((t) => `  ${t.cssVar}: ${resolved[t.name]?.light ?? t.light};`)
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
