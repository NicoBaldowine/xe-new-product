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
  // ── content (text / icon) — names mirror the Figma "hola mundo" variables ──
  { name: "content-base", cssVar: "--xe-content-base", category: "content", type: "color", light: "#0a0a0a", dark: "#ffffff", description: "Primary text / icon.", themeKeys: ["--color-content"], pairWith: "surface-base", usage: ["Titles & body copy", "Icons", "text-content"] },
  { name: "content-secondary", cssVar: "--xe-content-secondary", category: "content", type: "color", light: "#737373", dark: "#a3a3a3", description: "Secondary text.", themeKeys: ["--color-content-secondary"], pairWith: "surface-base", usage: ["Subtitles, helper text", "Eyebrow labels", "text-content-secondary"] },
  { name: "content-tertiary", cssVar: "--xe-content-tertiary", category: "content", type: "color", light: "#a3a3a3", dark: "#a3a3a3", description: "Tertiary text / hints.", themeKeys: ["--color-content-tertiary"], usage: ["Timestamps, counters, disabled hints"] },
  { name: "content-base-reverse", cssVar: "--xe-content-base-reverse", category: "content", type: "color", light: "#ffffff", dark: "#0a0a0a", description: "Text on inverted surfaces.", themeKeys: ["--color-content-reverse"] },
  { name: "content-stays-white", cssVar: "--xe-content-stays-white", category: "content", type: "color", light: "#ffffff", dark: "#ffffff", description: "Always white — the foreground for solid coloured fills (brand / success / warning / danger) and text on photos.", themeKeys: ["--color-content-white"], usage: ["Check/“!” on status emblems", "Primary CTA label", "Text over photos (Travel promo)", "text-content-white"] },
  { name: "content-brand-logo", cssVar: "--xe-content-brand-logo", category: "content", type: "color", light: "#0a146e", dark: "#ffffff", description: "Logo colour (Figma navy in light, white in dark).", themeKeys: ["--color-brand-logo"] },
  { name: "content-on-brand", cssVar: "--xe-content-on-brand", category: "content", type: "color", light: "#ffffff", dark: "#ffffff", description: "Text on brand surfaces.", themeKeys: ["--color-on-brand"], pairWith: "surface-brand-default", usage: ["Text/icons on brand-blue fills"] },
  { name: "content-on-action", cssVar: "--xe-content-on-action", category: "content", type: "color", light: "#ffffff", dark: "#ffffff", description: "Text on action buttons.", themeKeys: ["--color-on-action"], pairWith: "blue-bright", usage: ["Primary Button label", "Send money CTA"] },
  { name: "content-info-on-muted", cssVar: "--xe-content-info-on-muted", category: "content", type: "color", light: "#1d4ed8", dark: "#bfdbfe", description: "Info text on muted bg.", themeKeys: ["--color-info-on-muted"], pairWith: "surface-info-muted", usage: ["Info Pill text", "status badges"] },
  { name: "content-success-on-muted", cssVar: "--xe-content-success-on-muted", category: "content", type: "color", light: "#16a34a", dark: "#86efac", description: "Success text on muted bg.", themeKeys: ["--color-success-on-muted"], pairWith: "surface-success-muted", usage: ["Positive rate delta", "rate badge", "Completed pill"] },
  { name: "content-warning-on-muted", cssVar: "--xe-content-warning-on-muted", category: "content", type: "color", light: "#a16207", dark: "#fde047", description: "Warning text on muted bg.", themeKeys: ["--color-warning-on-muted"], pairWith: "surface-warning-muted", usage: ["Action-required pill", "In-progress warnings"] },
  { name: "content-danger-on-muted", cssVar: "--xe-content-danger-on-muted", category: "content", type: "color", light: "#dc2626", dark: "#fca5a5", description: "Danger text on muted bg.", themeKeys: ["--color-danger-on-muted"], pairWith: "surface-danger-muted", usage: ["Negative rate delta", "error pills"] },
  { name: "content-brand-default", cssVar: "--xe-content-brand-default", category: "content", type: "color", light: "#2563eb", dark: "#3b82f6", description: "Brand default (accent text/icon).", themeKeys: ["--color-brand-default"] },
  { name: "content-success-default", cssVar: "--xe-content-success-default", category: "content", type: "color", light: "#15803d", dark: "#4ade80", description: "Standalone success text / icon (not a fill — see surface-success).", themeKeys: ["--color-success"], usage: ["All-done check (Getting started)", "text-success"] },
  { name: "content-danger-default", cssVar: "--xe-content-danger-default", category: "content", type: "color", light: "#dc2626", dark: "#f87171", description: "Danger / error default.", themeKeys: ["--color-danger"] },

  // ── surfaces ──────────────────────────────────────────────────────────
  { name: "canvas", cssVar: "--xe-canvas", category: "surface", type: "color", light: "#ffffff", dark: "#000000", description: "Page background behind cards.", themeKeys: ["--color-canvas"] },
  { name: "surface-base", cssVar: "--xe-surface-base", category: "surface", type: "color", light: "#ffffff", dark: "#000000", description: "Card surface.", themeKeys: ["--color-surface"], usage: ["Desktop card background", "bg-surface"] },
  { name: "surface-level-01", cssVar: "--xe-surface-level-01", category: "surface", type: "color", light: "#f5f5f5", dark: "#1f1f1f", description: "Nested chips / secondary fills. Utility: bg-surface-1.", themeKeys: ["--color-surface-1"], usage: ["Mobile card background", "Secondary buttons", "Amount fields", "bg-surface-1"] },
  { name: "surface-level-02", cssVar: "--xe-surface-level-02", category: "surface", type: "color", light: "#ececec", dark: "#262626", description: "Level-02 fill — nested fills on a level-1 container (e.g. mobile cards). One step darker than level-01 in light (deviates from Figma, which has them equal) so the hierarchy reads in both themes. Utility: bg-surface-2.", themeKeys: ["--color-surface-2"], usage: ["Nested fields/selectors/chips inside mobile widgets", "bg-surface-2"] },
  { name: "surface-level-03", cssVar: "--xe-surface-level-03", category: "surface", type: "color", light: "#d4d4d4", dark: "#404040", description: "Level-03 fill. Utility: bg-surface-3.", themeKeys: ["--color-surface-3"] },
  { name: "surface-adaptive-gray", cssVar: "--xe-surface-adaptive-gray", category: "surface", type: "color", light: "#0a0a0a0d", dark: "#ffffff1a", description: "Adaptive tint (black 5% / white 10%). Utility: bg-surface-adaptive.", themeKeys: ["--color-surface-adaptive"] },
  { name: "surface-brand-default", cssVar: "--xe-surface-brand-default", category: "surface", type: "color", light: "#2563eb", dark: "#3b82f6", description: "Brand surface fill. Utility: bg-surface-brand.", themeKeys: ["--color-surface-brand"] },
  { name: "surface-info-muted", cssVar: "--xe-surface-info-muted", category: "surface", type: "color", light: "#dbeafe", dark: "#1e3a8a", description: "Info muted bg.", themeKeys: ["--color-info-muted"] },
  { name: "surface-success-muted", cssVar: "--xe-surface-success-muted", category: "surface", type: "color", light: "#dcfce7", dark: "#14532d", description: "Success muted bg.", themeKeys: ["--color-success-muted"] },
  { name: "surface-warning-muted", cssVar: "--xe-surface-warning-muted", category: "surface", type: "color", light: "#fef3c7", dark: "#78350f", description: "Warning muted bg.", themeKeys: ["--color-warning-muted"] },
  { name: "surface-danger-muted", cssVar: "--xe-surface-danger-muted", category: "surface", type: "color", light: "#fee2e2", dark: "#7f1d1d", description: "Danger muted bg.", themeKeys: ["--color-danger-muted"] },
  // Solid status fills — content on these is white (text-stays-white). Distinct
  // from the *-on-muted text tokens (which are tuned to read AS text and flip
  // light in dark): a fill must stay dark enough for white to read in BOTH
  // themes, so these are theme-invariant by default. Utility: bg-surface-success…
  { name: "surface-success", cssVar: "--xe-surface-success", category: "surface", type: "color", light: "#16a34a", dark: "#16a34a", description: "Solid success fill (completed-step emblem). White content sits on it.", themeKeys: ["--color-surface-success"], pairWith: "content-stays-white", usage: ["Getting Started done check emblem", "bg-surface-success"] },
  { name: "surface-warning", cssVar: "--xe-surface-warning", category: "surface", type: "color", light: "#ca8a04", dark: "#ca8a04", description: "Solid warning fill (Figma yellow-600). White content sits on it.", themeKeys: ["--color-surface-warning"], pairWith: "content-stays-white", usage: ["In-progress warning dot", "bg-surface-warning"] },
  { name: "surface-danger", cssVar: "--xe-surface-danger", category: "surface", type: "color", light: "#dc2626", dark: "#dc2626", description: "Solid danger fill. White content sits on it.", themeKeys: ["--color-surface-danger"], pairWith: "content-stays-white", usage: ["Destructive emblems / badges", "bg-surface-danger"] },
  { name: "surface-glass-white", cssVar: "--xe-surface-glass-white", category: "surface", type: "color", light: "#ffffff33", dark: "#ffffff33", description: "White glass (alpha 20%) — translucent fills over photos.", themeKeys: ["--color-glass-white"], usage: ["Translucent CTA over media (Travel promo)", "bg-glass-white"] },
  { name: "surface-glass-black", cssVar: "--xe-surface-glass-black", category: "surface", type: "color", light: "#0a0a0ab2", dark: "#0a0a0ab2", description: "Black glass (alpha 70%).", themeKeys: ["--color-glass-black"] },
  { name: "surface-overlay-invert", cssVar: "--xe-surface-overlay-invert", category: "surface", type: "color", light: "#ffffff80", dark: "#ffffff80", description: "Inverted overlay (alpha 50%).", themeKeys: ["--color-overlay-invert"] },

  // ── strokes ───────────────────────────────────────────────────────────
  { name: "stroke-base", cssVar: "--xe-stroke-base", category: "stroke", type: "color", light: "#e5e5e5", dark: "#262626", description: "Default border / divider.", themeKeys: ["--color-stroke"], usage: ["Desktop card border", "Outline button border (Button variant=outline)", "Row dividers", "border-stroke"] },
  { name: "stroke-brand-default", cssVar: "--xe-stroke-brand-default", category: "stroke", type: "color", light: "#2563eb", dark: "#2563eb", description: "Brand stroke.", themeKeys: ["--color-stroke-brand"] },

  // ── brand / fixed colours (dual: editable per theme, default identical) ──
  { name: "blue", cssVar: "--xe-blue", category: "brand", type: "color", light: "#002beb", dark: "#002beb", description: "Brand blue (Figma “Main Blue”).", themeKeys: ["--color-brand-blue"] },
  { name: "blue-bright", cssVar: "--xe-blue-bright", category: "brand", type: "color", light: "#0533ff", dark: "#0533ff", description: "Primary CTA fill (Figma “Primary blue”).", themeKeys: ["--color-brand-blue-bright"], usage: ["Primary Button", "Send money CTA", "active range tab", "links"] },
  { name: "orange", cssVar: "--xe-orange", category: "brand", type: "color", light: "#ff6e14", dark: "#ff6e14", description: "Brand orange.", themeKeys: ["--color-brand-orange"] },
  { name: "fuchsia-50", cssVar: "--xe-fuchsia-50", category: "brand", type: "color", light: "#fdf4ff", dark: "#fdf4ff", description: "Fuchsia 50.", themeKeys: ["--color-fuchsia-50"] },
  { name: "fuchsia-600", cssVar: "--xe-fuchsia-600", category: "brand", type: "color", light: "#c026d3", dark: "#c026d3", description: "Fuchsia 600.", themeKeys: ["--color-fuchsia-600"] },
  { name: "fuchsia-950", cssVar: "--xe-fuchsia-950", category: "brand", type: "color", light: "#4a044e", dark: "#4a044e", description: "Fuchsia 950.", themeKeys: ["--color-fuchsia-950"] },

  // ── radius (theme-invariant) ──────────────────────────────────────────
  { name: "radius-button", cssVar: "--xe-radius-button", category: "radius", type: "dimension", light: "6px", description: "Button radius (Figma value/border-radius/button).", themeKeys: ["--radius-button"], usage: ["Buttons (Button primitive — all variants)", "Travel promo CTA", "rounded-button"] },
  { name: "radius-xl", cssVar: "--xe-radius-xl", category: "radius", type: "dimension", light: "12px", description: "Selectors & in-card chips (Figma value/radius/rounded-xl).", themeKeys: ["--radius-xl"], usage: ["Currency selector / range chips (Rate chart)", "Amount fields", "chip buttons", "rounded-xl"] },
  { name: "radius-card", cssVar: "--xe-radius-card", category: "radius", type: "dimension", light: "20px", description: "Card radius.", themeKeys: ["--radius-card"], usage: ["Card surface (every block)", "bento tiles", "rounded-card"] },

  // ── text styles → composite "typesets" ────────────────────────────────
  //   Each typeset bundles size + line-height + font-weight + letter-spacing
  //   into ONE `text-*` utility (Tailwind v4 --text-{name}--* syntax). The four
  //   sub-tokens share a `typeset` key: the editor groups them into one card and
  //   the exporters emit a single W3C DTCG `typography` composite. Size + line-
  //   height also feed the generic Tailwind size (text-xs..4xl) so both stay in
  //   sync. font-family stays a separate role (font-display / font-sans) — it
  //   can't live inside --text-*. Weights/tracking mirror current widget usage.
  // H1 — hero / display (= text-4xl)
  { name: "title-h1", typeset: "h1", prop: "fontSize", cssVar: "--xe-title-h1", category: "textStyle", type: "dimension", light: "36px", description: "H1 font size.", themeKeys: ["--text-h1", "--text-4xl"] },
  { name: "title-h1-lh", typeset: "h1", prop: "lineHeight", cssVar: "--xe-title-h1-lh", category: "textStyle", type: "dimension", light: "36px", description: "H1 line-height.", themeKeys: ["--text-h1--line-height", "--text-4xl--line-height"] },
  { name: "title-h1-weight", typeset: "h1", prop: "fontWeight", cssVar: "--xe-title-h1-weight", category: "textStyle", type: "fontWeight", light: "600", description: "H1 weight.", themeKeys: ["--text-h1--font-weight"] },
  { name: "title-h1-tracking", typeset: "h1", prop: "letterSpacing", cssVar: "--xe-title-h1-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "H1 letter-spacing.", themeKeys: ["--text-h1--letter-spacing"] },
  // H2 — big numbers / balances (= text-3xl)
  { name: "title-h2", typeset: "h2", prop: "fontSize", cssVar: "--xe-title-h2", category: "textStyle", type: "dimension", light: "30px", description: "H2 font size.", themeKeys: ["--text-h2", "--text-3xl"] },
  { name: "title-h2-lh", typeset: "h2", prop: "lineHeight", cssVar: "--xe-title-h2-lh", category: "textStyle", type: "dimension", light: "34px", description: "H2 line-height.", themeKeys: ["--text-h2--line-height", "--text-3xl--line-height"] },
  { name: "title-h2-weight", typeset: "h2", prop: "fontWeight", cssVar: "--xe-title-h2-weight", category: "textStyle", type: "fontWeight", light: "600", description: "H2 weight.", themeKeys: ["--text-h2--font-weight"] },
  { name: "title-h2-tracking", typeset: "h2", prop: "letterSpacing", cssVar: "--xe-title-h2-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "H2 letter-spacing.", themeKeys: ["--text-h2--letter-spacing"] },
  // H3 — card headings / greetings (= text-2xl)
  { name: "title-h3", typeset: "h3", prop: "fontSize", cssVar: "--xe-title-h3", category: "textStyle", type: "dimension", light: "24px", description: "H3 font size.", themeKeys: ["--text-h3", "--text-2xl"] },
  { name: "title-h3-lh", typeset: "h3", prop: "lineHeight", cssVar: "--xe-title-h3-lh", category: "textStyle", type: "dimension", light: "32px", description: "H3 line-height.", themeKeys: ["--text-h3--line-height", "--text-2xl--line-height"] },
  { name: "title-h3-weight", typeset: "h3", prop: "fontWeight", cssVar: "--xe-title-h3-weight", category: "textStyle", type: "fontWeight", light: "600", description: "H3 weight.", themeKeys: ["--text-h3--font-weight"] },
  { name: "title-h3-tracking", typeset: "h3", prop: "letterSpacing", cssVar: "--xe-title-h3-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "H3 letter-spacing.", themeKeys: ["--text-h3--letter-spacing"] },
  // H4 — small section headings (= text-xl)
  { name: "title-h4", typeset: "h4", prop: "fontSize", cssVar: "--xe-title-h4", category: "textStyle", type: "dimension", light: "20px", description: "H4 font size.", themeKeys: ["--text-h4", "--text-xl"] },
  { name: "title-h4-lh", typeset: "h4", prop: "lineHeight", cssVar: "--xe-title-h4-lh", category: "textStyle", type: "dimension", light: "28px", description: "H4 line-height.", themeKeys: ["--text-h4--line-height", "--text-xl--line-height"] },
  { name: "title-h4-weight", typeset: "h4", prop: "fontWeight", cssVar: "--xe-title-h4-weight", category: "textStyle", type: "fontWeight", light: "600", description: "H4 weight.", themeKeys: ["--text-h4--font-weight"] },
  { name: "title-h4-tracking", typeset: "h4", prop: "letterSpacing", cssVar: "--xe-title-h4-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "H4 letter-spacing.", themeKeys: ["--text-h4--letter-spacing"] },
  // Body large (= text-lg)
  { name: "body-lg", typeset: "body-lg", prop: "fontSize", cssVar: "--xe-body-lg", category: "textStyle", type: "dimension", light: "18px", description: "Body-lg font size.", themeKeys: ["--text-body-lg", "--text-lg"] },
  { name: "body-lg-lh", typeset: "body-lg", prop: "lineHeight", cssVar: "--xe-body-lg-lh", category: "textStyle", type: "dimension", light: "28px", description: "Body-lg line-height.", themeKeys: ["--text-body-lg--line-height", "--text-lg--line-height"] },
  { name: "body-lg-weight", typeset: "body-lg", prop: "fontWeight", cssVar: "--xe-body-lg-weight", category: "textStyle", type: "fontWeight", light: "400", description: "Body-lg weight.", themeKeys: ["--text-body-lg--font-weight"] },
  { name: "body-lg-tracking", typeset: "body-lg", prop: "letterSpacing", cssVar: "--xe-body-lg-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "Body-lg letter-spacing.", themeKeys: ["--text-body-lg--letter-spacing"] },
  // Body — default paragraph (= text-base)
  { name: "body", typeset: "body", prop: "fontSize", cssVar: "--xe-body", category: "textStyle", type: "dimension", light: "16px", description: "Body font size.", themeKeys: ["--text-body", "--text-base"] },
  { name: "body-lh", typeset: "body", prop: "lineHeight", cssVar: "--xe-body-lh", category: "textStyle", type: "dimension", light: "24px", description: "Body line-height.", themeKeys: ["--text-body--line-height", "--text-base--line-height"] },
  { name: "body-weight", typeset: "body", prop: "fontWeight", cssVar: "--xe-body-weight", category: "textStyle", type: "fontWeight", light: "400", description: "Body weight.", themeKeys: ["--text-body--font-weight"] },
  { name: "body-tracking", typeset: "body", prop: "letterSpacing", cssVar: "--xe-body-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "Body letter-spacing.", themeKeys: ["--text-body--letter-spacing"] },
  // Body small — rows / secondary (= text-sm)
  { name: "body-sm", typeset: "body-sm", prop: "fontSize", cssVar: "--xe-body-sm", category: "textStyle", type: "dimension", light: "14px", description: "Body-sm font size.", themeKeys: ["--text-body-sm", "--text-sm"] },
  { name: "body-sm-lh", typeset: "body-sm", prop: "lineHeight", cssVar: "--xe-body-sm-lh", category: "textStyle", type: "dimension", light: "20px", description: "Body-sm line-height.", themeKeys: ["--text-body-sm--line-height", "--text-sm--line-height"] },
  { name: "body-sm-weight", typeset: "body-sm", prop: "fontWeight", cssVar: "--xe-body-sm-weight", category: "textStyle", type: "fontWeight", light: "400", description: "Body-sm weight.", themeKeys: ["--text-body-sm--font-weight"] },
  { name: "body-sm-tracking", typeset: "body-sm", prop: "letterSpacing", cssVar: "--xe-body-sm-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "Body-sm letter-spacing.", themeKeys: ["--text-body-sm--letter-spacing"] },
  // Caption / eyebrow (= text-xs)
  { name: "caption", typeset: "caption", prop: "fontSize", cssVar: "--xe-caption", category: "textStyle", type: "dimension", light: "12px", description: "Caption font size.", themeKeys: ["--text-caption", "--text-xs"] },
  { name: "caption-lh", typeset: "caption", prop: "lineHeight", cssVar: "--xe-caption-lh", category: "textStyle", type: "dimension", light: "16px", description: "Caption line-height.", themeKeys: ["--text-caption--line-height", "--text-xs--line-height"] },
  { name: "caption-weight", typeset: "caption", prop: "fontWeight", cssVar: "--xe-caption-weight", category: "textStyle", type: "fontWeight", light: "500", description: "Caption weight.", themeKeys: ["--text-caption--font-weight"] },
  { name: "caption-tracking", typeset: "caption", prop: "letterSpacing", cssVar: "--xe-caption-tracking", category: "textStyle", type: "dimension", light: "-0.02em", description: "Caption letter-spacing.", themeKeys: ["--text-caption--letter-spacing"] },

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
  "textStyle",
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
  textStyle: "Text styles",
  fontFamily: "Font family",
  fontWeight: "Font weight",
  blur: "Blur",
};
