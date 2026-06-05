"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TOKENS, TOKEN_GROUPS, CATEGORY_LABEL } from "@/lib/tokens/registry";
import { useTokens } from "./TokenProvider";
import { TokenRow, type EditMode } from "./TokenRow";
import { ExportDialog } from "./ExportDialog";
import { ImportDialog } from "./ImportDialog";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

/** Right-hand slide-over for live token editing + export. */
export function TokenEditorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isDirty, resetAll } = useTokens();
  const [mode, setMode] = useState<EditMode>("both");
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  // Only one token's usage popover open at a time.
  const [openToken, setOpenToken] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
              // One fixed width across all modes so token names + contrast chips
              // never clip when switching light/dark/both.
              "fixed right-0 top-0 z-50 flex h-full w-[500px] flex-col border-l border-stroke bg-surface shadow-xl",
            )}
            aria-label="Token editor"
          >
            {/* header */}
            <div className="flex items-center gap-2 border-b border-stroke px-4 py-3">
              <h2 className="font-display text-sm font-semibold text-content">Tokens</h2>
              <ModeSwitch mode={mode} onChange={setMode} />
              <button
                type="button"
                aria-label="Close editor"
                title="Close"
                onClick={onClose}
                className="ml-auto grid h-7 w-7 place-items-center rounded-md text-content-secondary hover:bg-surface-1 hover:text-content"
              >
                <Icon name="plus" size={16} className="rotate-45" />
              </button>
            </div>

            {/* actions */}
            <div className="flex items-center gap-2 border-b border-stroke px-4 py-2">
              <button
                type="button"
                onClick={() => setShowExport(true)}
                title="Export to DTCG / CSS / Tokens Studio / Tailwind"
                className="flex items-center gap-1.5 rounded-lg bg-brand-blue-bright px-2.5 py-1.5 text-xs font-medium text-content-white"
              >
                <Icon name="external" size={14} /> Export
              </button>
              <button
                type="button"
                onClick={() => setShowImport(true)}
                title="Import tokens from DTCG JSON or CSS variables"
                className="flex items-center gap-1.5 rounded-lg bg-surface-1 px-2.5 py-1.5 text-xs font-medium text-content hover:bg-surface-adaptive"
              >
                <Icon name="deposit" size={14} /> Import
              </button>
              <button
                type="button"
                disabled={!isDirty}
                onClick={resetAll}
                title="Reset every edited token to its default"
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium",
                  isDirty
                    ? "bg-surface-1 text-content hover:bg-surface-adaptive"
                    : "cursor-not-allowed text-content-tertiary opacity-50",
                )}
              >
                Reset all
              </button>
            </div>

            <VersionsSection />

            {/* token groups */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {mode === "both" && (
                <div className="mb-2 flex items-center justify-end gap-2 pr-1 text-[10px] uppercase tracking-wide text-content-tertiary">
                  <span className="w-[112px] text-center">Light</span>
                  <span className="w-[112px] text-center">Dark</span>
                </div>
              )}
              {TOKEN_GROUPS.map((cat) => {
                const tokens = TOKENS.filter((t) => t.category === cat);
                if (!tokens.length) return null;
                return (
                  <section key={cat} className="mb-4">
                    <h3 className="mb-1 font-display text-xs font-semibold uppercase tracking-wide text-content-secondary">
                      {CATEGORY_LABEL[cat]}
                    </h3>
                    <div className="divide-y divide-stroke">
                      {tokens.map((t) => (
                        <TokenRow
                          key={t.name}
                          token={t}
                          mode={mode}
                          open={openToken === t.name}
                          onToggle={() => setOpenToken((cur) => (cur === t.name ? null : t.name))}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
      {showImport && <ImportDialog onClose={() => setShowImport(false)} />}
    </>
  );
}

/** Save/restore named token snapshots (sources of truth). */
function VersionsSection() {
  const { versions, saveVersion, applyVersion, deleteVersion, isDirty } = useTokens();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stroke px-4 py-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-content-secondary"
      >
        <Icon name={open ? "chevronDown" : "chevronRight"} size={12} />
        Versions{versions.length > 0 && ` (${versions.length})`}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={name}
              placeholder="Name this version…"
              onChange={(e) => setName(e.target.value)}
              className="h-7 min-w-0 flex-1 rounded-md border border-stroke bg-surface-1 px-2 text-xs text-content outline-none focus:ring-2 focus:ring-stroke-brand"
            />
            <button
              type="button"
              disabled={!isDirty}
              onClick={() => {
                saveVersion(name);
                setName("");
              }}
              title={isDirty ? "Save current edits as a version" : "Edit a token first"}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium",
                isDirty ? "bg-brand-blue-bright text-content-white" : "cursor-not-allowed bg-surface-1 text-content-tertiary",
              )}
            >
              Save
            </button>
          </div>
          {versions.map((v) => (
            <div key={v.id} className="flex items-center gap-2 text-xs">
              <span className="min-w-0 flex-1 truncate text-content" title={v.name}>{v.name}</span>
              <span className="shrink-0 text-[10px] text-content-tertiary">
                {new Date(v.date).toLocaleDateString()}
              </span>
              <button type="button" onClick={() => applyVersion(v.id)} className="shrink-0 rounded bg-surface-1 px-2 py-0.5 text-content hover:bg-surface-adaptive">
                Restore
              </button>
              <button type="button" aria-label="Delete version" onClick={() => deleteVersion(v.id)} className="shrink-0 text-content-tertiary hover:text-danger">
                <Icon name="plus" size={12} className="rotate-45" />
              </button>
            </div>
          ))}
          {versions.length === 0 && (
            <p className="text-[11px] text-content-tertiary">No saved versions yet. Edit tokens, then save one as your source of truth.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ModeSwitch({ mode, onChange }: { mode: EditMode; onChange: (m: EditMode) => void }) {
  const opts: { id: EditMode; title: string }[] = [
    { id: "light", title: "Edit light values" },
    { id: "dark", title: "Edit dark values" },
    { id: "both", title: "Edit & compare light and dark side by side" },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-stroke bg-surface-1 p-0.5">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.title}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize transition-colors",
            mode === o.id ? "bg-surface text-content shadow-sm" : "text-content-secondary",
          )}
        >
          {o.id}
        </button>
      ))}
    </div>
  );
}
