import type { ExportInput } from "./index";
import { FONT_OPTIONS } from "../registry";

/**
 * Emit a Figma Plugin-API script that creates one Text Style per typeset and
 * binds its size / line-height / letter-spacing to the primitive variables from
 * the Variables export. Figma can't represent composite typography as a
 * *Variable* (only as a Text Style), so this is the bridge: run it inside a
 * plugin after importing the "XE Tokens" variables.
 *
 * Weight is applied via the font style name (Figma binds weight through the
 * font, not a variable). Title typesets use the title face, the rest the body face.
 */

const round = (n: number) => Math.round(n * 1e4) / 1e4;
const px = (v: string) => parseFloat(v.replace(/(px|em|rem)$/i, "")) || 0;
const fontLabel = (value: string) => FONT_OPTIONS.find((o) => o.value === value)?.label ?? value;

const WEIGHT_STYLE: Record<string, string> = {
  "400": "Regular",
  "500": "Medium",
  "600": "Semi Bold",
  "700": "Bold",
};

const TITLE_TYPESETS = new Set(["h1", "h2", "h3", "h4"]);

type Spec = {
  name: string;
  family: string;
  weightStyle: string;
  fontSize: number;
  lineHeight: number;
  letterSpacingPercent: number;
  vars: { fontSize?: string; lineHeight?: string; letterSpacing?: string };
};

export function toFigmaTextStyles({ tokens, resolved }: ExportInput): string {
  const titleFace = fontLabel(resolved["font-title"]?.light ?? "");
  const bodyFace = fontLabel(resolved["font-body"]?.light ?? "");

  // Gather each typeset's resolved props + the foundation each one references.
  const byTypeset: Record<string, { prop: Record<string, string>; ref: Record<string, string> }> = {};
  for (const t of tokens) {
    if (t.category !== "textStyle" || !t.typeset || !t.prop) continue;
    const e = (byTypeset[t.typeset] ??= { prop: {}, ref: {} });
    e.prop[t.prop] = resolved[t.name]?.light ?? t.light;
    if (t.ref) e.ref[t.prop] = t.ref;
  }

  const specs: Spec[] = Object.entries(byTypeset).map(([name, { prop, ref }]) => ({
    name,
    family: TITLE_TYPESETS.has(name) ? titleFace : bodyFace,
    weightStyle: WEIGHT_STYLE[String(Math.round(Number(prop.fontWeight)))] ?? "Regular",
    fontSize: px(prop.fontSize ?? "16"),
    lineHeight: px(prop.lineHeight ?? "0"),
    letterSpacingPercent: round(px(prop.letterSpacing ?? "0") * 100),
    vars: { fontSize: ref.fontSize, lineHeight: ref.lineHeight, letterSpacing: ref.letterSpacing },
  }));

  return SCRIPT.replace("__SPECS__", JSON.stringify(specs, null, 2));
}

// The runnable plugin script. __SPECS__ is replaced with the typeset data above.
const SCRIPT = `/* XE → Figma Text Styles
 * Run inside a Figma plugin (e.g. paste into a scratch plugin's code.js, or the
 * console of one) AFTER importing the "XE Tokens" variables. Creates/updates one
 * Text Style per typeset and binds size / line-height / letter-spacing to the
 * matching primitive variables. Weight is set via the font style name.
 */
const SPECS = __SPECS__;

(async () => {
  const allVars = await figma.variables.getLocalVariablesAsync();
  // Match a foundation by token name in any of the forms the exports produce:
  // "size-4xl", "size/4xl", or any variable whose name ends with the leaf.
  const findVar = (ref) => {
    if (!ref) return null;
    const slash = ref.replace("-", "/");
    return (
      allVars.find((v) => v.name === ref || v.name === slash) ||
      allVars.find((v) => v.name.endsWith("/" + ref) || v.name.endsWith("/" + slash.split("/").pop())) ||
      null
    );
  };

  const existing = await figma.getLocalTextStylesAsync();
  for (const s of SPECS) {
    let style = existing.find((t) => t.name === s.name) || figma.createTextStyle();
    style.name = s.name;
    try {
      await figma.loadFontAsync({ family: s.family, style: s.weightStyle });
      style.fontName = { family: s.family, style: s.weightStyle };
    } catch (e) {
      console.warn("Font not available: " + s.family + " " + s.weightStyle, e);
    }
    style.fontSize = s.fontSize;
    style.lineHeight = { value: s.lineHeight, unit: "PIXELS" };
    style.letterSpacing = { value: s.letterSpacingPercent, unit: "PERCENT" };
    const bind = (field, ref) => {
      const v = findVar(ref);
      if (v) {
        try { style.setBoundVariable(field, v); }
        catch (e) { console.warn("Could not bind " + field + " → " + ref, e); }
      }
    };
    bind("fontSize", s.vars.fontSize);
    bind("lineHeight", s.vars.lineHeight);
    bind("letterSpacing", s.vars.letterSpacing);
  }
  figma.notify("XE text styles synced: " + SPECS.length);
})();
`;
