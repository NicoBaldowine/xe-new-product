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

/** Tokens Studio uses unitless dimensions (strip px / em / rem). */
function tsValue(t: TokenDef, value: string): string {
  if (t.type === "dimension") return value.replace(/(px|em|rem)$/, "");
  return value;
}

/** Serialize to Tokens Studio (Figma plugin) JSON — a `light` and `dark` set. */
export function toTokensStudio({ tokens, resolved }: ExportInput): string {
  const light: Record<string, Record<string, unknown>> = {};
  const dark: Record<string, Record<string, unknown>> = {};
  // textStyle sub-tokens collapse into one composite `typography` token per typeset.
  const typesets: Record<string, Record<string, string>> = {};
  for (const t of tokens) {
    const r = resolved[t.name] ?? { light: t.light, dark: t.dark };
    if (t.category === "textStyle" && t.typeset && t.prop) {
      (typesets[t.typeset] ??= {})[t.prop] = tsValue(t, r.light);
      continue;
    }
    const group = CATEGORY_LABEL[t.category];
    const type = tsType(t);
    (light[group] ??= {});
    light[group][t.name] = { value: tsValue(t, r.light), type };
    if (r.dark != null) {
      (dark[group] ??= {});
      dark[group][t.name] = { value: tsValue(t, r.dark), type };
    }
  }
  const tsGroup = CATEGORY_LABEL.textStyle;
  for (const [name, v] of Object.entries(typesets)) {
    (light[tsGroup] ??= {});
    light[tsGroup][name] = {
      type: "typography",
      value: {
        fontSize: v.fontSize,
        lineHeight: v.lineHeight,
        fontWeight: v.fontWeight,
        letterSpacing: v.letterSpacing,
      },
    };
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
