/**
 * Design-token type system. The registry (registry.ts) is the single source of
 * truth for every token; it generates the CSS in globals.css, drives the live
 * editor, and feeds the exporters.
 */

export type Theme = "light" | "dark";

export type TokenType =
  | "color" // hex incl. 8-digit alpha (#0a0a0a0d)
  | "dimension" // px values: radius, font size, line-height, blur
  | "fontFamily"
  | "fontWeight"
  | "number"
  | "shadow";

export type TokenCategory =
  | "content"
  | "surface"
  | "stroke"
  | "brand"
  | "utility"
  | "radius"
  | "typography"
  | "textStyle"
  | "fontFamily"
  | "fontWeight"
  | "blur";

export interface TokenDef {
  /** Canonical id and editor key — matches the CSS var minus the `--xe-` prefix. */
  name: string;
  /** The raw CSS custom property this token writes to. */
  cssVar: `--xe-${string}`;
  category: TokenCategory;
  type: TokenType;
  /** Light value — always present. */
  light: string;
  /** Dark value. Absent ⇒ theme-invariant (brand / radius / type scale / blur): written to :root only. */
  dark?: string;
  description: string;
  /** Which Tailwind `@theme` vars consume this token (used by the Tailwind exporter + docs). */
  themeKeys?: string[];
  /** For text/"on-*" tokens: the background token it sits on — drives the contrast check. */
  pairWith?: string;
  /** Curated list of where this token is used (drives the usage explorer popover). */
  usage?: string[];
  /**
   * Typeset this token belongs to (e.g. "h1", "body"). Sub-tokens sharing a
   * typeset form one composite text style (size + line-height + font-weight +
   * letter-spacing) — grouped in the editor and exported as a DTCG `typography`.
   */
  typeset?: string;
  /** Which property of its typeset this token sets. */
  prop?: "fontSize" | "lineHeight" | "fontWeight" | "letterSpacing";
}

/** The four sub-properties that make up a composite typeset. */
export type TypesetProp = "fontSize" | "lineHeight" | "fontWeight" | "letterSpacing";

/** Sparse map of user edits over the registry defaults. */
export type Edits = Partial<Record<string, { light?: string; dark?: string }>>;

/** Fully-resolved values for export (registry default merged with edits). */
export type ResolvedTokens = Record<string, { light: string; dark?: string }>;
