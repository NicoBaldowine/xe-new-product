"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { DrawStrokeContext } from "@/components/primitives/Card";
import { WidgetShell, WidgetContainerContext } from "@/components/primitives/WidgetShell";
import { Icon } from "@/components/primitives/Icon";
import {
  WIDGETS,
  WIDGET_GROUPS,
  WIDGETS_BY_GROUP,
} from "@/lib/playground/registry";
import { defaultProps, type WidgetEntry, type WidgetSource } from "@/lib/playground/types";
import { FULL_SPAN } from "@/lib/playground/bentoConfig";
import { ControlsPanel } from "./playground/ControlsPanel";

type ContainerMode = "mobile" | "desktop" | "both";

/** Bounded preview of a widget in one container. */
function Stage({ entry, props, variant }: { entry: WidgetEntry; props: Record<string, unknown>; variant: "mobile" | "desktop" }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-1 px-2.5 py-1 font-display text-[11px] font-medium uppercase tracking-wide text-content-secondary">
        <Icon name={variant === "mobile" ? "phone" : "monitor"} size={12} />
        {variant} container
      </span>
      <div
        className={cn(
          "flex flex-col bg-canvas p-5",
          // Fixed container widths so a widget keeps one width across all its
          // variants: desktop 480, mobile 353.
          variant === "mobile" ? "w-[353px]" : "w-[480px]",
        )}
      >
        {/* No layoutId in the playground → no morph-id collisions. Figma widgets
            are pure content → wrap in WidgetShell so the mobile/desktop surface
            rule applies; legacy blocks bring their own Card. */}
        <DrawStrokeContext.Provider value={false}>
          {entry.source === "figma-widget" ? (
            <WidgetShell variant={variant}>{entry.render(props)}</WidgetShell>
          ) : (
            <WidgetContainerContext.Provider value={variant}>
              {entry.render(props)}
            </WidgetContainerContext.Provider>
          )}
        </DrawStrokeContext.Provider>
      </div>
    </div>
  );
}

export function PlaygroundView({
  isInBento,
  onToggleBento,
  onImportBento,
  getSpan,
  onSetSpan,
}: {
  isInBento: (id: string) => boolean;
  onToggleBento: (id: string) => void;
  onImportBento: (config: { id: string; inBento: boolean; bentoSpan?: number }[]) => void;
  getSpan: (id: string) => number;
  onSetSpan: (id: string, span: number) => void;
}) {
  const [selectedId, setSelectedId] = useState(WIDGETS[0].id);
  const [container, setContainer] = useState<ContainerMode>("desktop");
  const [sourceFilter, setSourceFilter] = useState<"all" | WidgetSource>("all");
  const [props, setProps] = useState<Record<string, unknown>>(() => defaultProps(WIDGETS[0]));

  const entry = useMemo(() => WIDGETS.find((w) => w.id === selectedId)!, [selectedId]);

  function select(id: string) {
    const next = WIDGETS.find((w) => w.id === id)!;
    setSelectedId(id);
    setProps(defaultProps(next));
    // Snap container to one the widget supports.
    if (container !== "both" && !next.containers.includes(container)) {
      setContainer(next.containers[0]);
    }
  }

  const [copiedBento, setCopiedBento] = useState(false);
  const [importBentoText, setImportBentoText] = useState<string | null>(null);
  const [importBentoError, setImportBentoError] = useState<string | null>(null);
  function exportBentoConfig() {
    const config = WIDGETS.map((w) => {
      const span = getSpan(w.id);
      return {
        id: w.id,
        inBento: isInBento(w.id),
        ...(span > 1 ? { bentoSpan: span } : {}),
      };
    });
    const text = JSON.stringify(config, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedBento(true);
    setTimeout(() => setCopiedBento(false), 1200);
  }
  function applyBentoImport() {
    try {
      const parsed = JSON.parse(importBentoText ?? "");
      if (!Array.isArray(parsed)) throw new Error("Expected a JSON array.");
      onImportBento(parsed);
      setImportBentoText(null);
      setImportBentoError(null);
    } catch (e) {
      setImportBentoError(e instanceof Error ? e.message : "Could not parse.");
    }
  }

  const setProp = (prop: string, value: unknown) => setProps((p) => ({ ...p, [prop]: value }));
  const showMobile = (container === "mobile" || container === "both") && entry.containers.includes("mobile");
  const showDesktop = (container === "desktop" || container === "both") && entry.containers.includes("desktop");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]"
    >
      {/* Left — widget picker */}
      <aside className="flex flex-col gap-3 rounded-card border border-stroke bg-surface p-4">
        <div className="flex items-center gap-1 rounded-full border border-stroke bg-surface-1 p-0.5 text-xs">
          {(["all", "legacy-block", "figma-widget"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSourceFilter(s)}
              className={cn(
                "flex-1 rounded-full px-1 py-1 font-medium transition-colors",
                sourceFilter === s ? "bg-surface text-content shadow-sm" : "text-content-secondary",
              )}
            >
              {s === "all" ? "All" : s === "legacy-block" ? "Legacy" : "Figma"}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {WIDGET_GROUPS.map((g) => {
            const items = (WIDGETS_BY_GROUP[g] ?? []).filter(
              (w) => sourceFilter === "all" || w.source === sourceFilter,
            );
            if (!items.length) return null;
            return (
              <div key={g}>
                <h3 className="mb-1 font-display text-[11px] font-semibold uppercase tracking-wide text-content-tertiary">
                  {g}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {items.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => select(w.id)}
                      className={cn(
                        "rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                        w.id === selectedId
                          ? "bg-surface-1 font-medium text-content"
                          : "text-content-secondary hover:bg-surface-1 hover:text-content",
                      )}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-1 flex gap-1.5">
          <button
            type="button"
            onClick={exportBentoConfig}
            title="Copy the bento selection as JSON to paste into the registry defaults"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stroke bg-surface px-2 py-1.5 text-xs font-medium text-content hover:bg-surface-1"
          >
            <Icon name="external" size={13} />
            {copiedBento ? "Copied!" : "Export bento"}
          </button>
          <button
            type="button"
            onClick={() => {
              setImportBentoText("");
              setImportBentoError(null);
            }}
            title="Paste a bento config JSON to apply it"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-stroke bg-surface px-2 py-1.5 text-xs font-medium text-content hover:bg-surface-1"
          >
            <Icon name="deposit" size={13} /> Import
          </button>
        </div>

        {importBentoText !== null && (
          <div className="mt-2 flex flex-col gap-1.5">
            <textarea
              value={importBentoText}
              onChange={(e) => {
                setImportBentoText(e.target.value);
                setImportBentoError(null);
              }}
              placeholder='Paste exported bento config (JSON array)…'
              spellCheck={false}
              className="h-24 w-full resize-none rounded-lg border border-stroke bg-surface-1 p-2 font-mono text-[11px] text-content outline-none focus:ring-2 focus:ring-stroke-brand"
            />
            {importBentoError && <span className="text-[11px] text-danger">{importBentoError}</span>}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={applyBentoImport}
                className="flex-1 rounded-lg bg-brand-blue-bright px-2 py-1.5 text-xs font-medium text-content-white"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setImportBentoText(null)}
                className="rounded-lg bg-surface-1 px-2 py-1.5 text-xs font-medium text-content hover:bg-surface-adaptive"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Center — stage */}
      <section className="flex flex-col gap-4 rounded-card border border-stroke bg-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-content">{entry.name}</h2>
          <div className="flex items-center gap-3">
            <label
              className="flex cursor-pointer items-center gap-1.5 text-xs text-content-secondary"
              title="Show this widget in the Bento showcase (saved across reloads)"
            >
              <input
                type="checkbox"
                checked={isInBento(entry.id)}
                onChange={() => onToggleBento(entry.id)}
                className="accent-[var(--color-brand-blue-bright)]"
              />
              Show in bento
            </label>
            {isInBento(entry.id) && (
              <BentoWidthSwitch span={getSpan(entry.id)} onChange={(s) => onSetSpan(entry.id, s)} />
            )}
            <ContainerSwitch value={container} onChange={setContainer} entry={entry} />
          </div>
        </div>
        <div
          className={cn(
            "flex flex-1 flex-wrap items-start justify-center gap-8 rounded-xl bg-surface-1 p-8",
          )}
        >
          {showMobile && <Stage entry={entry} props={props} variant="mobile" />}
          {showDesktop && <Stage entry={entry} props={props} variant="desktop" />}
        </div>
      </section>

      {/* Right — controls */}
      <aside className="rounded-card border border-stroke bg-surface p-4">
        <ControlsPanel
          entry={entry}
          props={props}
          setProp={setProp}
          onPreset={(preset) => setProps({ ...defaultProps(entry), ...preset })}
          onReset={() => setProps(defaultProps(entry))}
        />
      </aside>
    </motion.div>
  );
}

/** Bento footprint: 1 column, 2 columns, or full row. Persisted via bento config. */
function BentoWidthSwitch({ span, onChange }: { span: number; onChange: (span: number) => void }) {
  const opts: { value: number; label: string; title: string }[] = [
    { value: 1, label: "1", title: "Single column in the bento" },
    { value: 2, label: "2", title: "Span 2 columns (wide widgets: tables, charts, action bars)" },
    { value: FULL_SPAN, label: "Full", title: "Span the full row width" },
  ];
  const active = span >= 3 ? FULL_SPAN : span;
  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-stroke bg-surface-1 p-0.5"
      title="Bento width"
    >
      {opts.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          title={o.title}
          aria-label={`Bento width ${o.label}`}
          className={cn(
            "grid h-7 min-w-7 place-items-center rounded-full px-2 text-[11px] font-medium transition-colors",
            active === o.value
              ? "bg-surface text-content shadow-sm"
              : "text-content-secondary hover:text-content",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ContainerSwitch({
  value,
  onChange,
  entry,
}: {
  value: ContainerMode;
  onChange: (m: ContainerMode) => void;
  entry: WidgetEntry;
}) {
  const opts: { id: ContainerMode; label: string; title: string; icon: "phone" | "monitor" | "grid" }[] = [
    { id: "mobile", label: "Mobile", title: "Show the widget in the mobile (phone-cell) container", icon: "phone" },
    { id: "desktop", label: "Desktop", title: "Show the widget in the desktop (card) container", icon: "monitor" },
    { id: "both", label: "Both", title: "Show mobile and desktop side by side — same widget, different container", icon: "grid" },
  ];
  const supportsBoth = entry.containers.length > 1;
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-stroke bg-surface-1 p-0.5">
      {opts.map((o) => {
        const disabled =
          (o.id === "mobile" && !entry.containers.includes("mobile")) ||
          (o.id === "desktop" && !entry.containers.includes("desktop")) ||
          (o.id === "both" && !supportsBoth);
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.id)}
            aria-label={o.label}
            title={disabled ? `${o.label} — not available for this widget` : o.title}
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full transition-colors",
              disabled
                ? "cursor-not-allowed text-content-tertiary opacity-40"
                : value === o.id
                  ? "bg-surface text-content shadow-sm"
                  : "text-content-secondary hover:text-content",
            )}
          >
            <Icon name={o.icon} size={15} />
          </button>
        );
      })}
    </div>
  );
}
