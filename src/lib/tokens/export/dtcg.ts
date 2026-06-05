import type { ExportInput } from "./index";
import type { TokenType } from "../types";
import { CATEGORY_LABEL } from "../registry";

/** TokenType → W3C DTCG `$type`. */
function dtcgType(type: TokenType): string {
  switch (type) {
    case "color":
      return "color";
    case "dimension":
      return "dimension";
    case "fontFamily":
      return "fontFamily";
    case "fontWeight":
      return "fontWeight";
    case "shadow":
      return "shadow";
    default:
      return "number";
  }
}

/**
 * Serialize to W3C Design Tokens (DTCG) JSON, grouped by category. Dark via
 * $extensions. textStyle sub-tokens are bundled by `typeset` into one composite
 * `typography` token (fontSize + lineHeight + fontWeight + letterSpacing).
 */
export function toDTCG({ tokens, resolved }: ExportInput): string {
  const tree: Record<string, Record<string, unknown>> = {};
  const typesets: Record<string, Record<string, string>> = {};
  for (const t of tokens) {
    const r = resolved[t.name] ?? { light: t.light, dark: t.dark };
    if (t.category === "textStyle" && t.typeset && t.prop) {
      (typesets[t.typeset] ??= {})[t.prop] = r.light;
      continue;
    }
    const group = CATEGORY_LABEL[t.category];
    (tree[group] ??= {});
    tree[group][t.name] = {
      $type: dtcgType(t.type),
      $value: r.light,
      $description: t.description,
      ...(r.dark != null ? { $extensions: { "xe.theme.dark": r.dark } } : {}),
    };
  }
  const tsGroup = CATEGORY_LABEL.textStyle;
  for (const [name, v] of Object.entries(typesets)) {
    (tree[tsGroup] ??= {});
    tree[tsGroup][name] = {
      $type: "typography",
      $value: {
        fontSize: v.fontSize,
        lineHeight: v.lineHeight,
        fontWeight: Number(v.fontWeight) || v.fontWeight,
        letterSpacing: v.letterSpacing,
      },
    };
  }
  return JSON.stringify(tree, null, 2);
}
