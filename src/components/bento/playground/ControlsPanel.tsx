"use client";

import type { Control, WidgetEntry } from "@/lib/playground/types";
import { CURRENCIES } from "@/lib/playground/types";
import { cn } from "@/lib/cn";

const inputCls =
  "h-8 w-full min-w-0 rounded-lg border border-stroke bg-surface-1 px-2 text-xs text-content outline-none focus:ring-2 focus:ring-stroke-brand";

function Field({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (control.kind) {
    case "currency":
      return (
        <select className={inputCls} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      );
    case "select":
      return (
        <select className={inputCls} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {control.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    case "amount":
    case "text":
      return (
        <input
          type="text"
          className={cn(inputCls, "font-mono tabular-nums")}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="range"
          min={control.min}
          max={control.max}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[var(--color-brand-blue-bright)]"
        />
      );
    case "toggle":
      return (
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            value ? "bg-brand-blue-bright" : "bg-surface-3",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-content-white transition-all",
              value ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      );
  }
}

export function ControlsPanel({
  entry,
  props,
  setProp,
  onPreset,
  onReset,
}: {
  entry: WidgetEntry;
  props: Record<string, unknown>;
  setProp: (prop: string, value: unknown) => void;
  onPreset: (presetProps: Record<string, unknown>) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {entry.presets && entry.presets.length > 0 && (
        <div>
          <h4 className="mb-1.5 font-display text-xs font-semibold uppercase tracking-wide text-content-secondary">
            Presets
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {entry.presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onPreset(p.props)}
                className="rounded-full border border-stroke bg-surface px-2.5 py-1 text-xs text-content hover:bg-surface-1"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {entry.controls.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-xs font-semibold uppercase tracking-wide text-content-secondary">
            Controls
          </h4>
          {entry.controls.map((c) => (
            <label key={c.prop} className="flex items-center justify-between gap-3">
              <span className="text-xs text-content-secondary">{c.label}</span>
              <span className="w-36 shrink-0">
                <Field control={c} value={props[c.prop]} onChange={(v) => setProp(c.prop, v)} />
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-content-tertiary">This widget has no adjustable props yet.</p>
      )}

      <button
        type="button"
        onClick={onReset}
        className="self-start rounded-lg bg-surface-1 px-2.5 py-1.5 text-xs font-medium text-content hover:bg-surface-adaptive"
      >
        Reset controls
      </button>
    </div>
  );
}
