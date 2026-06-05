import type { ResolvedTokens, TokenDef } from "../types";
import { toDTCG } from "./dtcg";
import { toCssVars } from "./cssVars";
import { toTokensStudio } from "./tokensStudio";
import { toTailwindTheme } from "./tailwind";
import { toFigmaVariables } from "./figmaVariables";
import { toFigmaTextStyles } from "./figmaTextStyles";

export interface ExportInput {
  tokens: TokenDef[];
  resolved: ResolvedTokens;
}

export type ExportFormatId = "dtcg" | "css" | "tokens-studio" | "tailwind" | "figma-variables" | "figma-text-styles";

export interface ExportFormat {
  id: ExportFormatId;
  label: string;
  /** Download file extension. */
  ext: string;
  mime: string;
  language: string; // for the preview <pre> hint
  /** Optional one-line note shown above the preview (e.g. how to import it). */
  hint?: string;
  serialize: (input: ExportInput) => string;
}

export const EXPORTERS: ExportFormat[] = [
  { id: "dtcg", label: "W3C DTCG", ext: "tokens.json", mime: "application/json", language: "json", hint: "Figma-dialect DTCG (colour value objects + com.figma.codeSyntax.WEB). Import via Figma's variable import or a DTCG plugin.", serialize: toDTCG },
  { id: "css", label: "CSS variables", ext: "css", mime: "text/css", language: "css", serialize: toCssVars },
  { id: "tokens-studio", label: "Tokens Studio", ext: "studio.json", mime: "application/json", language: "json", serialize: toTokensStudio },
  { id: "tailwind", label: "Tailwind @theme", ext: "theme.css", mime: "text/css", language: "css", serialize: toTailwindTheme },
  { id: "figma-variables", label: "Figma Variables", ext: "figma.json", mime: "application/json", language: "json", hint: "Figma REST Variables API payload (XE Tokens collection, Light/Dark modes). Send to POST /v1/files/:fileKey/variables, or paste into a variable-import plugin that accepts this shape.", serialize: toFigmaVariables },
  { id: "figma-text-styles", label: "Figma Text Styles", ext: "figma-text-styles.js", mime: "text/javascript", language: "javascript", hint: "Figma Plugin-API script: creates one Text Style per typeset and binds size / line-height / letter-spacing to the imported primitive variables. Run inside a plugin (or the console of a scratch plugin) after importing the Variables export.", serialize: toFigmaTextStyles },
];

export { toDTCG, toCssVars, toTokensStudio, toTailwindTheme, toFigmaVariables, toFigmaTextStyles };
