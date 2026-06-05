"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { FULL_SPAN, bentoColsFor, type BentoInstance } from "@/lib/playground/bentoConfig";
import { TOKEN_BY_NAME, CATEGORY_LABEL } from "@/lib/tokens/registry";
import type { TokenCategory } from "@/lib/tokens/types";
import { scanTokenUsage } from "@/lib/tokens/usage";

/** Order the Tokens panel groups by concern: colours → typography → shape/effects. */
const TOKEN_GROUP_ORDER: TokenCategory[] = [
  "content",
  "surface",
  "stroke",
  "brand",
  "utility",
  "fontFamily",
  "textStyle",
  "fontWeight",
  "radius",
  "blur",
];
import { TokenRow } from "@/components/tokens/TokenRow";
import { ControlsPanel } from "./playground/ControlsPanel";

/** Short, human label for a bento instance: widget name + its variant/first prop. */
function instanceLabel(inst: BentoInstance): string {
  const w = WIDGETS.find((x) => x.id === inst.widgetId);
  const name = w?.name ?? inst.widgetId;
  const p = inst.props;
  const hint = p && typeof p.variant === "string" ? p.variant : undefined;
  return hint ? `${name} · ${hint}` : name;
}

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
            rule applies; legacy blocks bring their own Card. data-widget-root
            scopes the token-usage scan to the widget (not the playground chrome). */}
        <div data-widget-root>
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
    </div>
  );
}

export function PlaygroundView({
  instances,
  isInBento,
  onToggleBento,
  onAddConfig,
  onUpdateInstance,
  onSetCols,
  onRemoveInstance,
  onImportBento,
}: {
  instances: BentoInstance[];
  isInBento: (id: string) => boolean;
  onToggleBento: (id: string, cols?: number) => void;
  onAddConfig: (id: string, props: Record<string, unknown>, cols?: number) => void;
  onUpdateInstance: (key: string, props: Record<string, unknown>, cols: number) => void;
  onSetCols: (id: string, cols: number) => void;
  onRemoveInstance: (key: string) => void;
  onImportBento: (config: BentoInstance[]) => void;
}) {
  const [selectedId, setSelectedId] = useState(WIDGETS[0].id);
  const [container, setContainer] = useState<ContainerMode>("desktop");
  const [sourceFilter, setSourceFilter] = useState<"all" | WidgetSource>("all");
  const [props, setProps] = useState<Record<string, unknown>>(() => defaultProps(WIDGETS[0]));
  // The bento width chosen in the switch (drives the toggle / add / update).
  const [bentoWidth, setBentoWidth] = useState<number>(() => bentoColsFor(WIDGETS[0].id)[0]);
  // When set, the stage is editing that bento instance (the header CTA becomes Update).
  const [editingKey, setEditingKey] = useState<string | null>(null);
  // Left panel tab: the widget picker, or the bento config (instances).
  const [leftTab, setLeftTab] = useState<"widgets" | "bento">("widgets");
  // Right panel tab: live controls (data) or the tokens the widget uses (style).
  const [rightTab, setRightTab] = useState<"controls" | "tokens">("controls");
  // Preview theme — themes ONLY the stage (not the site) and drives which theme
  // the Tokens panel edits.
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [openToken, setOpenToken] = useState<string | null>(null);
  const [usedTokens, setUsedTokens] = useState<string[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const entry = useMemo(() => WIDGETS.find((w) => w.id === selectedId)!, [selectedId]);

  function select(id: string) {
    const next = WIDGETS.find((w) => w.id === id)!;
    setSelectedId(id);
    setProps(defaultProps(next));
    setBentoWidth(bentoColsFor(id)[0]);
    setEditingKey(null);
    // Snap container to one the widget supports.
    if (container !== "both" && !next.containers.includes(container)) {
      setContainer(next.containers[0]);
    }
  }

  /** Load a bento instance into the stage to edit it. */
  function editInstance(inst: BentoInstance) {
    const w = WIDGETS.find((x) => x.id === inst.widgetId);
    if (!w) return;
    setSelectedId(inst.widgetId);
    setProps(inst.props ? { ...defaultProps(w), ...inst.props } : defaultProps(w));
    setBentoWidth(inst.cols ?? bentoColsFor(inst.widgetId)[0]);
    setEditingKey(inst.key);
    if (container !== "both" && !w.containers.includes(container)) setContainer(w.containers[0]);
  }

  /** Width switch → local width; live-update the targeted instance immediately. */
  function changeWidth(cols: number) {
    setBentoWidth(cols);
    const targetKey = editingKey ?? (isInBento(selectedId) ? selectedId : null);
    if (targetKey) onSetCols(targetKey, cols);
  }

  const [copiedBento, setCopiedBento] = useState(false);
  const [importBentoText, setImportBentoText] = useState<string | null>(null);
  const [importBentoError, setImportBentoError] = useState<string | null>(null);
  function exportBentoConfig() {
    const text = JSON.stringify(instances, null, 2);
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

  // After the widget renders, scan its classes → the tokens it consumes (live).
  useEffect(() => {
    const id = requestAnimationFrame(() => setUsedTokens(scanTokenUsage(stageRef.current)));
    return () => cancelAnimationFrame(id);
  }, [selectedId, props, container, showMobile, showDesktop]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]"
    >
      {/* Left — widget picker / bento config */}
      <aside className="flex flex-col gap-3 rounded-card border border-stroke bg-surface p-4">
        {/* Top tab: switch the panel between the widget catalog and the bento config. */}
        <div className="flex items-center gap-1 rounded-full border border-stroke bg-surface-1 p-0.5 text-xs">
          {(["widgets", "bento"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setLeftTab(t)}
              className={cn(
                "flex-1 rounded-full px-1 py-1 font-medium transition-colors",
                leftTab === t ? "bg-surface text-content shadow-sm" : "text-content-secondary",
              )}
            >
              {t === "widgets" ? "Widgets" : `Bento (${instances.length})`}
            </button>
          ))}
        </div>

        {leftTab === "widgets" && (
        <>
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
        </>
        )}

        {leftTab === "bento" && (
        <>
          <p className="px-0.5 text-[11px] leading-relaxed text-content-tertiary">
            Click an item to edit its config · ✕ to remove. Add a variant with “+ Add config” in the stage.
          </p>
          {instances.length === 0 ? (
            <p className="rounded-lg bg-surface-1 p-3 text-xs text-content-secondary">
              Nothing in the bento yet. Go to <b>Widgets</b>, configure one, then “+ Add config”.
            </p>
          ) : (
            <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
              {instances.map((inst) => {
                const cols = inst.cols ?? bentoColsFor(inst.widgetId)[0];
                return (
                  <div
                    key={inst.key}
                    className={cn(
                      "flex items-center gap-1 rounded-md pr-1 text-xs",
                      editingKey === inst.key ? "bg-surface-1 ring-1 ring-stroke-brand" : "hover:bg-surface-1",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => editInstance(inst)}
                      title="Edit this configuration"
                      className="flex min-w-0 flex-1 items-center gap-1.5 px-2 py-1 text-left"
                    >
                      <span className="min-w-0 flex-1 truncate text-content">{instanceLabel(inst)}</span>
                      {cols > 1 && (
                        <span className="shrink-0 text-[10px] text-content-tertiary">
                          {cols >= 3 ? "Full" : `${cols}col`}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label="Remove from bento"
                      onClick={() => onRemoveInstance(inst.key)}
                      className="grid h-4 w-4 shrink-0 place-items-center rounded text-content-tertiary hover:text-danger"
                    >
                      <Icon name="plus" size={12} className="rotate-45" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        <div className="mt-1 flex gap-1.5">
          <button
            type="button"
            onClick={exportBentoConfig}
            title="Copy the bento config (instances) as JSON to paste into the registry defaults"
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
        </>
        )}
      </aside>

      {/* Center — stage */}
      <section className="flex flex-col gap-4 rounded-card border border-stroke bg-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-content">{entry.name}</h2>
          <div className="flex items-center gap-3">
            <label
              className="flex cursor-pointer items-center gap-1.5 text-xs text-content-secondary"
              title="Show this widget's default instance in the Bento showcase (saved across reloads)"
            >
              <input
                type="checkbox"
                checked={isInBento(entry.id)}
                onChange={() => onToggleBento(entry.id, bentoWidth)}
                className="accent-[var(--color-brand-blue-bright)]"
              />
              Show in bento
            </label>
            <BentoWidthSwitch span={bentoWidth} onChange={changeWidth} />
            {editingKey ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateInstance(editingKey, { ...props }, bentoWidth)}
                  title="Save changes to this bento instance"
                  className="flex items-center gap-1.5 rounded-full bg-brand-blue-bright px-2.5 py-1 text-xs font-medium text-content-white"
                >
                  <Icon name="check" size={13} /> Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKey(null)}
                  title="Stop editing this instance"
                  className="grid h-6 w-6 place-items-center rounded-full border border-stroke text-content-secondary hover:text-content"
                  aria-label="Done editing"
                >
                  <Icon name="plus" size={13} className="rotate-45" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAddConfig(entry.id, { ...props }, bentoWidth)}
                title="Add the current configuration to the bento as a new variant instance"
                className="flex items-center gap-1.5 rounded-full border border-stroke bg-surface px-2.5 py-1 text-xs font-medium text-content hover:bg-surface-1"
              >
                <Icon name="plus" size={13} /> Add config
              </button>
            )}
            <div
              className="flex items-center gap-0.5 rounded-full border border-stroke bg-surface-1 p-0.5 text-[11px]"
              title="Preview theme — themes this stage only, not the whole site"
            >
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPreviewTheme(m)}
                  className={cn(
                    "rounded-full px-2 py-0.5 font-medium capitalize transition-colors",
                    previewTheme === m ? "bg-surface text-content shadow-sm" : "text-content-secondary",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <ContainerSwitch value={container} onChange={setContainer} entry={entry} />
          </div>
        </div>
        <div
          ref={stageRef}
          className={cn(
            "flex flex-1 flex-wrap items-start justify-center gap-8 rounded-xl bg-surface-1 p-8 transition-colors",
            previewTheme === "dark" && "dark",
          )}
        >
          {showMobile && <Stage entry={entry} props={props} variant="mobile" />}
          {showDesktop && <Stage entry={entry} props={props} variant="desktop" />}
        </div>
      </section>

      {/* Right — controls (data) / tokens (style) */}
      <aside className="flex flex-col gap-3 rounded-card border border-stroke bg-surface p-4">
        <div className="flex items-center gap-1 rounded-full border border-stroke bg-surface-1 p-0.5 text-xs">
          {(["controls", "tokens"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setRightTab(t)}
              className={cn(
                "flex-1 rounded-full px-1 py-1 font-medium transition-colors",
                rightTab === t ? "bg-surface text-content shadow-sm" : "text-content-secondary",
              )}
            >
              {t === "controls" ? "Controls" : `Tokens (${usedTokens.length})`}
            </button>
          ))}
        </div>

        {rightTab === "controls" ? (
          <ControlsPanel
            entry={entry}
            props={props}
            setProp={setProp}
            onPreset={(preset) => setProps({ ...defaultProps(entry), ...preset })}
            onReset={() => setProps(defaultProps(entry))}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] leading-relaxed text-content-tertiary">
              Tokens this widget uses — editing the <b className="capitalize">{previewTheme}</b> value
              (toggle theme above the stage) applies everywhere.
            </p>
            {usedTokens.length === 0 ? (
              <p className="rounded-lg bg-surface-1 p-3 text-xs text-content-secondary">
                No tokenised styles detected for this widget.
              </p>
            ) : (
              TOKEN_GROUP_ORDER.map((cat) => {
                const toks = usedTokens
                  .map((n) => TOKEN_BY_NAME[n])
                  .filter((t) => t && t.category === cat);
                if (!toks.length) return null;
                return (
                  <section key={cat}>
                    <h4 className="mb-0.5 mt-1 font-display text-[10px] font-semibold uppercase tracking-wide text-content-tertiary">
                      {CATEGORY_LABEL[cat]}
                    </h4>
                    <div className="divide-y divide-stroke">
                      {toks.map((tok) => (
                        <TokenRow
                          key={tok.name}
                          token={tok}
                          mode={previewTheme}
                          stacked
                          open={openToken === tok.name}
                          onToggle={() => setOpenToken((c) => (c === tok.name ? null : tok.name))}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}
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
