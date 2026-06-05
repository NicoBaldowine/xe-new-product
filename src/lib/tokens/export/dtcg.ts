import type { ExportInput } from "./index";
import type { TokenCategory, TokenDef } from "../types";
import { TOKEN_BY_NAME, FONT_OPTIONS } from "../registry";

/**
 * Serialize to W3C DTCG JSON in **Figma's dialect**, so the file imports cleanly
 * back into Figma Variables (matches the shape Figma itself exports):
 *   · colours → `$value: { colorSpace:"srgb", components:[r,g,b], alpha, hex }`
 *   · dimensions / weights → unitless numbers
 *   · every token carries `$extensions["com.figma.codeSyntax"].WEB` = its web
 *     token name (the bridge between Figma variables and our `--xe-*` system)
 *   · dark values ride along in `$extensions["xe.theme.dark"]`
 *   · aliased tokens (typeset sub-tokens) emit their resolved value plus an
 *     `$extensions["xe.alias"]` pointer to the foundation they reference
 *     (mirrors how Figma keeps the resolved value + aliasData side by side).
 * Tokens are grouped under Figma-style paths (text / surface / stroke / value/font/…).
 * Typesets are also bundled into one composite `typography` token per text style.
 */

const round = (n: number) => Math.round(n * 1e4) / 1e4;

/** #rrggbb[aa] → Figma colour value object. */
function figmaColor(hex: string) {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const alpha = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return {
    colorSpace: "srgb",
    components: [round(r / 255), round(g / 255), round(b / 255)],
    alpha: round(alpha),
    hex: "#" + h.slice(0, 6).toUpperCase(),
  };
}

/** A CSS dimension/number string → unitless number (Figma stores these as numbers). */
function numberValue(value: string): number {
  return parseFloat(value.replace(/(px|em|rem)$/i, "")) || 0;
}

/** Readable face name for a font-role var value (`var(--font-…)` → "Instrument Sans"). */
function fontLabel(value: string): string {
  return FONT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** Our category → the Figma group path a token nests under. */
function groupPath(cat: TokenCategory): string {
  switch (cat) {
    case "content": return "text";
    case "surface": return "surface";
    case "stroke": return "stroke";
    case "action": return "extra";
    case "utility": return "extra/utility";
    case "radius": return "value/radius";
    case "blur": return "value/blur";
    case "fontFamily": return "value/font/family";
    case "fontWeight": return "value/font/weight";
    case "fontSize": return "value/font/size";
    case "lineHeight": return "value/font/line-height";
    case "letterSpacing": return "value/font/letter-spacing";
    default: return "value";
  }
}

type Node = Record<string, unknown>;

/** Nest `leaf: value` under a slash path, creating groups as needed. */
function setAtPath(tree: Node, path: string, leaf: string, value: unknown): void {
  let node = tree;
  for (const seg of path.split("/")) {
    node = (node[seg] ??= {}) as Node;
  }
  node[leaf] = value;
}

/** The DTCG `$value` + `$type` for one (non-typeset) token. */
function leafToken(t: TokenDef, light: string, dark?: string) {
  const codeSyntax = { WEB: t.name };
  if (t.type === "color") {
    return {
      $type: "color",
      $value: figmaColor(light),
      $description: t.description,
      $extensions: {
        "com.figma.codeSyntax": codeSyntax,
        ...(dark != null ? { "xe.theme.dark": figmaColor(dark) } : {}),
        ...(t.ref ? { "xe.alias": t.ref } : {}),
      },
    };
  }
  if (t.type === "fontFamily") {
    return {
      $type: "fontFamily",
      $value: fontLabel(light),
      $description: t.description,
      $extensions: { "com.figma.codeSyntax": codeSyntax },
    };
  }
  // dimension / fontWeight / number → unitless number
  return {
    $type: t.type === "fontWeight" ? "fontWeight" : "number",
    $value: numberValue(light),
    $description: t.description,
    $extensions: {
      "com.figma.codeSyntax": codeSyntax,
      ...(t.ref ? { "xe.alias": t.ref } : {}),
    },
  };
}

export function toDTCG({ tokens, resolved }: ExportInput): string {
  const tree: Node = {};
  const typesets: Record<string, Record<string, string>> = {};

  for (const t of tokens) {
    const r = resolved[t.name] ?? { light: t.light, dark: t.dark };
    if (t.category === "textStyle" && t.typeset && t.prop) {
      (typesets[t.typeset] ??= {})[t.prop] = r.light;
      continue;
    }
    setAtPath(tree, groupPath(t.category), t.name, leafToken(t, r.light, r.dark));
  }

  // Composite typography per typeset (size + line-height + weight + letter-spacing),
  // with an alias pointer to the foundation each property references.
  for (const [name, v] of Object.entries(typesets)) {
    const sub = TOKENS_BY_TYPESET[name];
    setAtPath(tree, "typography", name, {
      $type: "typography",
      $value: {
        fontSize: v.fontSize,
        lineHeight: v.lineHeight,
        fontWeight: Number(v.fontWeight) || v.fontWeight,
        letterSpacing: v.letterSpacing,
      },
      ...(sub ? { $extensions: { "xe.alias": sub } } : {}),
    });
  }

  return JSON.stringify(tree, null, 2);
}

/** typeset key → { prop: foundation-name } map, for the composite alias hints. */
const TOKENS_BY_TYPESET: Record<string, Record<string, string>> = (() => {
  const out: Record<string, Record<string, string>> = {};
  for (const t of Object.values(TOKEN_BY_NAME)) {
    if (t.typeset && t.prop && t.ref) (out[t.typeset] ??= {})[t.prop] = t.ref;
  }
  return out;
})();
