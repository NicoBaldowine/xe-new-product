import type { ExportInput } from "./index";

/** Serialize the resolved tokens to a `:root` + `.dark` CSS custom-property block. */
export function toCssVars({ tokens, resolved }: ExportInput): string {
  const root = tokens
    .map((t) => `  ${t.cssVar}: ${resolved[t.name]?.light ?? t.light};`)
    .join("\n");
  const dark = tokens
    .filter((t) => (resolved[t.name]?.dark ?? t.dark) != null)
    .map((t) => `  ${t.cssVar}: ${resolved[t.name]?.dark ?? t.dark};`)
    .join("\n");
  return `:root {\n${root}\n}\n\n.dark {\n${dark}\n}\n`;
}
