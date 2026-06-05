import type { ExportInput } from "./index";
import type { TokenDef } from "../types";
import { FONT_OPTIONS } from "../registry";

/**
 * Serialize to the Figma REST Variables API payload (POST /v1/files/:key/variables).
 *
 * One collection "XE Tokens" with two modes (Light / Dark). Every token becomes
 * a typed variable; theme-aware tokens get a value per mode, theme-invariant
 * ones get the same value in both so they resolve everywhere. Token names map to
 * Figma's slash groups (content-base → content/base). Import via the Figma REST
 * API or any variable-import plugin that accepts this shape.
 */

const COLLECTION_ID = "xe";
const MODE_LIGHT = "mode:light";
const MODE_DARK = "mode:dark";

type Rgba = { r: number; g: number; b: number; a: number };
type ResolvedType = "COLOR" | "FLOAT" | "STRING";

/** `content-base` → `content/base` (first hyphen becomes a group separator). */
function figmaName(name: string): string {
  const i = name.indexOf("-");
  return i < 0 ? name : `${name.slice(0, i)}/${name.slice(i + 1)}`;
}

const round = (n: number) => Math.round(n * 1e4) / 1e4;

/** #rgb / #rgba / #rrggbb / #rrggbbaa → Figma {r,g,b,a} floats (0–1). */
function hexToRgba(hex: string): Rgba {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r: round(r / 255), g: round(g / 255), b: round(b / 255), a: round(a) };
}

/** Map a font-role CSS value (`var(--font-instrument-sans)`) to its readable face name. */
function fontFamilyLabel(value: string): string {
  const match = FONT_OPTIONS.find((o) => o.value === value);
  if (match) return match.label;
  // Fall back to a cleaned-up var name if it's an unknown face.
  const m = value.match(/var\(--font-([a-z0-9-]+)\)/i);
  return m ? m[1].replace(/-/g, " ") : value;
}

function resolvedType(t: TokenDef): ResolvedType {
  if (t.type === "color") return "COLOR";
  if (t.type === "fontFamily") return "STRING";
  return "FLOAT"; // dimension / fontWeight / number
}

/** Convert a token's string value into the Figma mode value for its type. */
function modeValue(t: TokenDef, raw: string): Rgba | number | string {
  switch (resolvedType(t)) {
    case "COLOR":
      return hexToRgba(raw);
    case "STRING":
      return fontFamilyLabel(raw);
    default:
      return parseFloat(raw.replace(/px$/, "")) || 0;
  }
}

export function toFigmaVariables({ tokens, resolved }: ExportInput): string {
  const variables: Record<string, unknown>[] = [];
  const variableModeValues: Record<string, unknown>[] = [];

  for (const t of tokens) {
    const id = `var:${t.name}`;
    const r = resolved[t.name] ?? { light: t.light, dark: t.dark };
    variables.push({
      action: "CREATE",
      id,
      name: figmaName(t.name),
      variableCollectionId: COLLECTION_ID,
      resolvedType: resolvedType(t),
      description: t.description,
    });
    // Theme-invariant tokens reuse the light value for the dark mode so the
    // variable resolves in both modes.
    const darkRaw = r.dark ?? r.light;
    variableModeValues.push(
      { variableId: id, modeId: MODE_LIGHT, value: modeValue(t, r.light) },
      { variableId: id, modeId: MODE_DARK, value: modeValue(t, darkRaw) },
    );
  }

  const payload = {
    variableCollections: [
      { action: "CREATE", id: COLLECTION_ID, name: "XE Tokens", initialModeId: MODE_LIGHT },
    ],
    variableModes: [
      // The collection auto-creates its initial mode (id = initialModeId above);
      // UPDATE renames it to "Light" rather than creating a duplicate. Only the
      // second mode ("Dark") is a genuine CREATE.
      { action: "UPDATE", id: MODE_LIGHT, name: "Light", variableCollectionId: COLLECTION_ID },
      { action: "CREATE", id: MODE_DARK, name: "Dark", variableCollectionId: COLLECTION_ID },
    ],
    variables,
    variableModeValues,
  };

  return JSON.stringify(payload, null, 2);
}
