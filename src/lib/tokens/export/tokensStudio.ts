import type { ExportInput } from "./index";
import type { TokenDef } from "../types";
import { CATEGORY_LABEL } from "../registry";

/** TokenType → Tokens Studio `type`. */
function tsType(t: TokenDef): string {
  if (t.category === "radius") return "borderRadius";
  if (t.category === "typography") return t.name.endsWith("-lh") ? "lineHeights" : "fontSizes";
  if (t.category === "blur") return "dimension";
  switch (t.type) {
    case "color":
      return "color";
    case "fontWeight":
      return "fontWeights";
    case "fontFamily":
      return "fontFamilies";
    default:
      return "dimension";
  }
}

/** Tokens Studio uses unitless dimensions (strip `px`). */
function tsValue(t: TokenDef, value: string): string {
  if (t.type === "dimension") return value.replace(/px$/, "");
  return value;
}

/** Serialize to Tokens Studio (Figma plugin) JSON — a `light` and `dark` set. */
export function toTokensStudio({ tokens, resolved }: ExportInput): string {
  const light: Record<string, Record<string, unknown>> = {};
  const dark: Record<string, Record<string, unknown>> = {};
  for (const t of tokens) {
    const group = CATEGORY_LABEL[t.category];
    const r = resolved[t.name] ?? { light: t.light, dark: t.dark };
    const type = tsType(t);
    (light[group] ??= {});
    light[group][t.name] = { value: tsValue(t, r.light), type };
    if (r.dark != null) {
      (dark[group] ??= {});
      dark[group][t.name] = { value: tsValue(t, r.dark), type };
    }
  }
  return JSON.stringify(
    {
      light,
      dark,
      $themes: [],
      $metadata: { tokenSetOrder: ["light", "dark"] },
    },
    null,
    2,
  );
}
