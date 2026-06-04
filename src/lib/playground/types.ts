import type { ReactNode } from "react";

/** A live control (knob) that drives one widget prop. */
export type Control =
  | { kind: "currency"; prop: string; label: string; default: string }
  | { kind: "amount"; prop: string; label: string; default: string }
  | { kind: "select"; prop: string; label: string; options: string[]; default: string }
  | { kind: "text"; prop: string; label: string; default: string }
  | { kind: "number"; prop: string; label: string; min: number; max: number; default: number }
  | { kind: "toggle"; prop: string; label: string; default: boolean };

/** A named starting point (mirrors a Figma variant). */
export type Preset = { label: string; props: Record<string, unknown> };

export type WidgetGroup =
  | "Hero"
  | "Balance"
  | "Send"
  | "Rates"
  | "Activity"
  | "Promo"
  | "Identity";

export type WidgetSource = "legacy-block" | "figma-widget";

export interface WidgetEntry {
  id: string;
  name: string;
  group: WidgetGroup;
  source: WidgetSource;
  /** Containers this widget is meaningful in. */
  containers: ("mobile" | "desktop")[];
  controls: Control[];
  presets?: Preset[];
  /** Pure render — receives merged control values as props. */
  render: (props: Record<string, unknown>) => ReactNode;
}

/** Default props object derived from a widget's control defaults. */
export function defaultProps(entry: WidgetEntry): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of entry.controls) out[c.prop] = c.default;
  return out;
}

/** Flag/currency codes available in the demo (match src/lib/assets.ts). */
export const CURRENCIES = ["US", "CA", "EU", "GB", "MX", "AE", "CN"];
