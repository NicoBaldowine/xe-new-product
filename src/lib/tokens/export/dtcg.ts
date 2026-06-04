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

/** Serialize to W3C Design Tokens (DTCG) JSON, grouped by category. Dark via $extensions. */
export function toDTCG({ tokens, resolved }: ExportInput): string {
  const tree: Record<string, Record<string, unknown>> = {};
  for (const t of tokens) {
    const group = CATEGORY_LABEL[t.category];
    (tree[group] ??= {});
    const r = resolved[t.name] ?? { light: t.light, dark: t.dark };
    tree[group][t.name] = {
      $type: dtcgType(t.type),
      $value: r.light,
      $description: t.description,
      ...(r.dark != null ? { $extensions: { "xe.theme.dark": r.dark } } : {}),
    };
  }
  return JSON.stringify(tree, null, 2);
}
