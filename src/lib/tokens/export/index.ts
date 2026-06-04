import type { ResolvedTokens, TokenDef } from "../types";
import { toDTCG } from "./dtcg";
import { toCssVars } from "./cssVars";
import { toTokensStudio } from "./tokensStudio";
import { toTailwindTheme } from "./tailwind";

export interface ExportInput {
  tokens: TokenDef[];
  resolved: ResolvedTokens;
}

export type ExportFormatId = "dtcg" | "css" | "tokens-studio" | "tailwind";

export interface ExportFormat {
  id: ExportFormatId;
  label: string;
  /** Download file extension. */
  ext: string;
  mime: string;
  language: string; // for the preview <pre> hint
  serialize: (input: ExportInput) => string;
}

export const EXPORTERS: ExportFormat[] = [
  { id: "dtcg", label: "W3C DTCG", ext: "tokens.json", mime: "application/json", language: "json", serialize: toDTCG },
  { id: "css", label: "CSS variables", ext: "css", mime: "text/css", language: "css", serialize: toCssVars },
  { id: "tokens-studio", label: "Tokens Studio", ext: "studio.json", mime: "application/json", language: "json", serialize: toTokensStudio },
  { id: "tailwind", label: "Tailwind @theme", ext: "theme.css", mime: "text/css", language: "css", serialize: toTailwindTheme },
];

export { toDTCG, toCssVars, toTokensStudio, toTailwindTheme };
