import type { TokenCategory, TokenDef } from "./types";

/**
 * THE token registry — single source of truth.
 *
 * Values are extracted from Figma "Capacitor – Xe Consumer" (light, confirmed
 * via the Figma MCP variable dump) plus the established dark frame. Tokens whose
 * `dark` is omitted are theme-invariant (brand / radius / type scale / weight /
 * blur) and are written to `:root` only.
 *
 * The `:root` / `.dark` block in globals.css is generated from this list (see
 * css.ts → buildBaseCss) between the `@generated:tokens` sentinels — keep them
 * in sync. Live edits override the raw `--xe-*` layer at runtime; they never
 * regenerate Tailwind's build-time `@theme`.
 */
export const TOKENS: TokenDef[] = [
  // ── content (text / icon) ─────────────────────────────────────────────
  { name: "content-base", cssVar: "--xe-content-base", category: "content", type: "color", light: "#0a0a0a", dark: "#ffffff", description: "Primary text / icon.", themeKeys: ["--color-content"] },
  { name: "content-secondary", cssVar: "--xe-content-secondary", category: "content", type: "color", light: "#737373", dark: "#a3a3a3", description: "Secondary text.", themeKeys: ["--color-content-secondary"] },
  { name: "content-tertiary", cssVar: "--xe-content-tertiary", category: "content", type: "color", light: "#a3a3a3", dark: "#a3a3a3", description: "Tertiary text / hints.", themeKeys: ["--color-content-tertiary"] },
  { name: "content-reverse", cssVar: "--xe-content-reverse", category: "content", type: "color", light: "#ffffff", dark: "#0a0a0a", description: "Text on inverted surfaces.", themeKeys: ["--color-content-reverse"] },
  { name: "content-white", cssVar: "--xe-content-white", category: "content", type: "color", light: "#ffffff", dark: "#ffffff", description: "Stays white.", themeKeys: ["--color-content-white"] },
  { name: "content-brand-logo", cssVar: "--xe-content-brand-logo", category: "content", type: "color", light: "#0a146e", dark: "#ffffff", description: "Logo colour (Figma navy in light, white in dark).", themeKeys: ["--color-brand-logo"] },
  { name: "content-on-brand", cssVar: "--xe-content-on-brand", category: "content", type: "color", light: "#ffffff", description: "Text on brand surfaces.", themeKeys: ["--color-on-brand"] },
  { name: "content-on-action", cssVar: "--xe-content-on-action", category: "content", type: "color", light: "#ffffff", description: "Text on action buttons.", themeKeys: ["--color-on-action"] },
  { name: "content-info-on-muted", cssVar: "--xe-content-info-on-muted", category: "content", type: "color", light: "#1d4ed8", dark: "#bfdbfe", description: "Info text on muted bg.", themeKeys: ["--color-info-on-muted"] },
  { name: "content-success-on-muted", cssVar: "--xe-content-success-on-muted", category: "content", type: "color", light: "#16a34a", dark: "#86efac", description: "Success text on muted bg.", themeKeys: ["--color-success-on-muted"] },
  { name: "content-warning-on-muted", cssVar: "--xe-content-warning-on-muted", category: "content", type: "color", light: "#a16207", dark: "#fde047", description: "Warning text on muted bg.", themeKeys: ["--color-warning-on-muted"] },
  { name: "content-danger-on-muted", cssVar: "--xe-content-danger-on-muted", category: "content", type: "color", light: "#dc2626", dark: "#fca5a5", description: "Danger text on muted bg.", themeKeys: ["--color-danger-on-muted"] },
  // status defaults (NEW, from Figma; dark = standard tonal step, confirm against Figma dark)
  { name: "content-brand-default", cssVar: "--xe-content-brand-default", category: "content", type: "color", light: "#2563eb", dark: "#3b82f6", description: "Brand default (accent text/icon).", themeKeys: ["--color-brand-default"] },
  { name: "content-success-default", cssVar: "--xe-content-success-default", category: "content", type: "color", light: "#15803d", dark: "#4ade80", description: "Success default.", themeKeys: ["--color-success"] },
  { name: "content-danger-default", cssVar: "--xe-content-danger-default", category: "content", type: "color", light: "#dc2626", dark: "#f87171", description: "Danger default.", themeKeys: ["--color-danger"] },

  // ── surfaces ──────────────────────────────────────────────────────────
  { name: "canvas", cssVar: "--xe-canvas", category: "surface", type: "color", light: "#ffffff", dark: "#000000", description: "Page background behind cards.", themeKeys: ["--color-canvas"] },
  { name: "surface-base", cssVar: "--xe-surface-base", category: "surface", type: "color", light: "#ffffff", dark: "#000000", description: "Card surface.", themeKeys: ["--color-surface"] },
  { name: "surface-1", cssVar: "--xe-surface-1", category: "surface", type: "color", light: "#f5f5f5", dark: "#1f1f1f", description: "Nested chips / secondary fills (level-01).", themeKeys: ["--color-surface-1"] },
  { name: "surface-2", cssVar: "--xe-surface-2", category: "surface", type: "color", light: "#f5f5f5", dark: "#262626", description: "Surface level-02.", themeKeys: ["--color-surface-2"] },
  { name: "surface-3", cssVar: "--xe-surface-3", category: "surface", type: "color", light: "#d4d4d4", dark: "#404040", description: "Surface level-03.", themeKeys: ["--color-surface-3"] },
  { name: "surface-adaptive", cssVar: "--xe-surface-adaptive", category: "surface", type: "color", light: "#0a0a0a0d", dark: "#ffffff1a", description: "Adaptive tint (black 5% / white 10%).", themeKeys: ["--color-surface-adaptive"] },
  { name: "surface-info-muted", cssVar: "--xe-surface-info-muted", category: "surface", type: "color", light: "#dbeafe", dark: "#1e3a8a", description: "Info muted bg.", themeKeys: ["--color-info-muted"] },
  { name: "surface-success-muted", cssVar: "--xe-surface-success-muted", category: "surface", type: "color", light: "#dcfce7", dark: "#14532d", description: "Success muted bg.", themeKeys: ["--color-success-muted"] },
  { name: "surface-warning-muted", cssVar: "--xe-surface-warning-muted", category: "surface", type: "color", light: "#fef3c7", dark: "#78350f", description: "Warning muted bg.", themeKeys: ["--color-warning-muted"] },
  { name: "surface-danger-muted", cssVar: "--xe-surface-danger-muted", category: "surface", type: "color", light: "#fee2e2", dark: "#7f1d1d", description: "Danger muted bg.", themeKeys: ["--color-danger-muted"] },
  { name: "surface-glass-white", cssVar: "--xe-surface-glass-white", category: "surface", type: "color", light: "#ffffff33", description: "White glass (alpha 20%).", themeKeys: ["--color-glass-white"] },
  { name: "surface-glass-black", cssVar: "--xe-surface-glass-black", category: "surface", type: "color", light: "#0a0a0ab2", description: "Black glass (alpha 70%).", themeKeys: ["--color-glass-black"] },
  { name: "surface-overlay-invert", cssVar: "--xe-surface-overlay-invert", category: "surface", type: "color", light: "#ffffff80", description: "Inverted overlay (alpha 50%).", themeKeys: ["--color-overlay-invert"] },

  // ── strokes ───────────────────────────────────────────────────────────
  { name: "stroke-base", cssVar: "--xe-stroke-base", category: "stroke", type: "color", light: "#e5e5e5", dark: "#262626", description: "Default border / divider.", themeKeys: ["--color-stroke"] },
  { name: "stroke-brand", cssVar: "--xe-stroke-brand", category: "stroke", type: "color", light: "#2563eb", dark: "#2563eb", description: "Brand stroke.", themeKeys: ["--color-stroke-brand"] },

  // ── brand / fixed (theme-invariant) ───────────────────────────────────
  { name: "blue", cssVar: "--xe-blue", category: "brand", type: "color", light: "#002beb", description: "Brand blue.", themeKeys: ["--color-brand-blue"] },
  { name: "blue-bright", cssVar: "--xe-blue-bright", category: "brand", type: "color", light: "#0533ff", description: "Primary CTA fill.", themeKeys: ["--color-brand-blue-bright"] },
  { name: "orange", cssVar: "--xe-orange", category: "brand", type: "color", light: "#ff6e14", description: "Brand orange.", themeKeys: ["--color-brand-orange"] },
  { name: "fuchsia-50", cssVar: "--xe-fuchsia-50", category: "brand", type: "color", light: "#fdf4ff", description: "Fuchsia 50.", themeKeys: ["--color-fuchsia-50"] },
  { name: "fuchsia-600", cssVar: "--xe-fuchsia-600", category: "brand", type: "color", light: "#c026d3", description: "Fuchsia 600.", themeKeys: ["--color-fuchsia-600"] },
  { name: "fuchsia-950", cssVar: "--xe-fuchsia-950", category: "brand", type: "color", light: "#4a044e", description: "Fuchsia 950.", themeKeys: ["--color-fuchsia-950"] },

  // ── radius (theme-invariant) ──────────────────────────────────────────
  { name: "radius-button", cssVar: "--xe-radius-button", category: "radius", type: "dimension", light: "6px", description: "Button radius (Figma).", themeKeys: ["--radius-button"] },
  { name: "radius-xl", cssVar: "--xe-radius-xl", category: "radius", type: "dimension", light: "12px", description: "rounded-xl.", themeKeys: ["--radius-xl"] },
  { name: "radius-card", cssVar: "--xe-radius-card", category: "radius", type: "dimension", light: "20px", description: "Card radius.", themeKeys: ["--radius-card"] },

  // ── type scale (theme-invariant; size + line-height pairs) ─────────────
  { name: "text-xs", cssVar: "--xe-text-xs", category: "typography", type: "dimension", light: "12px", description: "Caption / eyebrow / badge size (12px).", themeKeys: ["--text-xs"] },
  { name: "text-xs-lh", cssVar: "--xe-text-xs-lh", category: "typography", type: "dimension", light: "16px", description: "xs line-height.", themeKeys: ["--text-xs--line-height"] },
  { name: "text-sm", cssVar: "--xe-text-sm", category: "typography", type: "dimension", light: "14px", description: "Body small — list rows, secondary text (14px).", themeKeys: ["--text-sm"] },
  { name: "text-sm-lh", cssVar: "--xe-text-sm-lh", category: "typography", type: "dimension", light: "20px", description: "sm line-height.", themeKeys: ["--text-sm--line-height"] },
  { name: "text-base", cssVar: "--xe-text-base", category: "typography", type: "dimension", light: "16px", description: "Body — default paragraph (16px).", themeKeys: ["--text-base"] },
  { name: "text-base-lh", cssVar: "--xe-text-base-lh", category: "typography", type: "dimension", light: "24px", description: "base line-height.", themeKeys: ["--text-base--line-height"] },
  { name: "text-lg", cssVar: "--xe-text-lg", category: "typography", type: "dimension", light: "18px", description: "Body large / small heading (18px).", themeKeys: ["--text-lg"] },
  { name: "text-lg-lh", cssVar: "--xe-text-lg-lh", category: "typography", type: "dimension", light: "28px", description: "lg line-height.", themeKeys: ["--text-lg--line-height"] },
  { name: "text-xl", cssVar: "--xe-text-xl", category: "typography", type: "dimension", light: "20px", description: "Title h4 — small section headings (20px).", themeKeys: ["--text-xl"] },
  { name: "text-xl-lh", cssVar: "--xe-text-xl-lh", category: "typography", type: "dimension", light: "28px", description: "xl line-height.", themeKeys: ["--text-xl--line-height"] },
  { name: "text-2xl", cssVar: "--xe-text-2xl", category: "typography", type: "dimension", light: "24px", description: "Title h3 — card headings, greetings (24px).", themeKeys: ["--text-2xl"] },
  { name: "text-2xl-lh", cssVar: "--xe-text-2xl-lh", category: "typography", type: "dimension", light: "32px", description: "2xl line-height.", themeKeys: ["--text-2xl--line-height"] },
  { name: "text-3xl", cssVar: "--xe-text-3xl", category: "typography", type: "dimension", light: "30px", description: "Title h2 — balances, big numbers (30px).", themeKeys: ["--text-3xl"] },
  { name: "text-3xl-lh", cssVar: "--xe-text-3xl-lh", category: "typography", type: "dimension", light: "34px", description: "3xl line-height.", themeKeys: ["--text-3xl--line-height"] },
  { name: "text-4xl", cssVar: "--xe-text-4xl", category: "typography", type: "dimension", light: "36px", description: "Title h1 — hero / display (36px).", themeKeys: ["--text-4xl"] },
  { name: "text-4xl-lh", cssVar: "--xe-text-4xl-lh", category: "typography", type: "dimension", light: "36px", description: "4xl line-height.", themeKeys: ["--text-4xl--line-height"] },

  // ── font weights (theme-invariant) ────────────────────────────────────
  { name: "weight-normal", cssVar: "--xe-weight-normal", category: "fontWeight", type: "fontWeight", light: "400", description: "Regular.", themeKeys: ["--font-weight-normal"] },
  { name: "weight-medium", cssVar: "--xe-weight-medium", category: "fontWeight", type: "fontWeight", light: "500", description: "Medium.", themeKeys: ["--font-weight-medium"] },
  { name: "weight-semibold", cssVar: "--xe-weight-semibold", category: "fontWeight", type: "fontWeight", light: "600", description: "Semibold.", themeKeys: ["--font-weight-semibold"] },

  // ── blur (theme-invariant) ────────────────────────────────────────────
  { name: "blur-md", cssVar: "--xe-blur-md", category: "blur", type: "dimension", light: "16px", description: "backdrop-blur md.", themeKeys: ["--blur-md"] },
  { name: "blur-2xl", cssVar: "--xe-blur-2xl", category: "blur", type: "dimension", light: "42px", description: "backdrop-blur 2xl.", themeKeys: ["--blur-2xl"] },

  // ── font families (theme-invariant role → face) ───────────────────────
  { name: "font-title", cssVar: "--xe-font-title", category: "fontFamily", type: "fontFamily", light: "var(--font-instrument-sans)", description: "Titles / headings (h1–h4). Default Instrument Sans.", themeKeys: ["--font-display"] },
  { name: "font-body", cssVar: "--xe-font-body", category: "fontFamily", type: "fontFamily", light: "var(--font-zalando)", description: "Body / UI text. Default Zalando Sans.", themeKeys: ["--font-sans"] },
  { name: "font-accent", cssVar: "--xe-font-accent", category: "fontFamily", type: "fontFamily", light: "var(--font-instrument-serif)", description: "Editorial accent (italic, e.g. “Limits”). Default Instrument Serif.", themeKeys: ["--font-serif"] },
  { name: "font-numeric", cssVar: "--xe-font-numeric", category: "fontFamily", type: "fontFamily", light: "var(--font-roboto-mono)", description: "Numerals (balances / rates). Default Roboto Mono (digits-only).", themeKeys: ["--font-mono"] },
];

/** Selectable font faces for the family editor (label → CSS value). */
export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Instrument Sans", value: "var(--font-instrument-sans)" },
  { label: "Zalando Sans", value: "var(--font-zalando)" },
  { label: "Instrument Serif", value: "var(--font-instrument-serif)" },
  { label: "Roboto Mono", value: "var(--font-roboto-mono)" },
  { label: "Inter", value: "var(--font-inter)" },
  { label: "System", value: "ui-sans-serif, system-ui, sans-serif" },
];

/** name → TokenDef lookup. */
export const TOKEN_BY_NAME: Record<string, TokenDef> = Object.fromEntries(
  TOKENS.map((t) => [t.name, t]),
);

/** Ordered category groups for the editor UI. */
export const TOKEN_GROUPS: TokenCategory[] = [
  "content",
  "surface",
  "stroke",
  "brand",
  "fontFamily",
  "typography",
  "fontWeight",
  "radius",
  "blur",
];

/** Human labels per category. */
export const CATEGORY_LABEL: Record<TokenCategory, string> = {
  content: "Content",
  surface: "Surface",
  stroke: "Stroke",
  brand: "Brand / fixed",
  radius: "Radius",
  typography: "Type scale",
  fontFamily: "Font family",
  fontWeight: "Font weight",
  blur: "Blur",
};
