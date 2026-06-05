import type { ExportInput } from "./index";
import type { TokenDef } from "../types";
import { TOKEN_BY_NAME } from "../registry";

/**
 * Serialize the resolved tokens to a `:root` + `.dark` CSS custom-property block.
 * Aliased tokens (typeset sub-tokens) emit `var(--xe-<foundation>)` rather than a
 * flat value, so the two-tier references survive — a typeset reads as its four
 * properties each pointing at a foundation (what engineering expects to consume).
 */
export function toCssVars({ tokens, resolved }: ExportInput): string {
  const lightCss = (t: TokenDef) =>
    t.ref && TOKEN_BY_NAME[t.ref]
      ? `var(${TOKEN_BY_NAME[t.ref].cssVar})`
      : resolved[t.name]?.light ?? t.light;
  const root = tokens.map((t) => `  ${t.cssVar}: ${lightCss(t)};`).join("\n");
  const dark = tokens
    .filter((t) => (resolved[t.name]?.dark ?? t.dark) != null)
    .map((t) => `  ${t.cssVar}: ${resolved[t.name]?.dark ?? t.dark};`)
    .join("\n");
  return `:root {\n${root}\n}\n\n.dark {\n${dark}\n}\n`;
}
