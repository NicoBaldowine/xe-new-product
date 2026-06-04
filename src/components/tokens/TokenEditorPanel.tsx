"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Theme } from "@/lib/tokens/types";
import { TOKENS, TOKEN_GROUPS, CATEGORY_LABEL } from "@/lib/tokens/registry";
import { useTokens } from "./TokenProvider";
import { TokenRow } from "./TokenRow";
import { ExportDialog } from "./ExportDialog";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

/** Right-hand slide-over for live token editing + export. */
export function TokenEditorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { editingTheme, setEditingTheme, isDirty, resetAll } = useTokens();
  const [showExport, setShowExport] = useState(false);

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
            className="fixed right-0 top-0 z-50 flex h-full w-[340px] flex-col border-l border-stroke bg-surface shadow-xl"
            aria-label="Token editor"
          >
            {/* header */}
            <div className="flex items-center gap-2 border-b border-stroke px-4 py-3">
              <h2 className="font-display text-sm font-semibold text-content">Tokens</h2>
              <ThemeSwitch theme={editingTheme} onChange={setEditingTheme} />
              <button
                type="button"
                aria-label="Close editor"
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
                className="flex items-center gap-1.5 rounded-lg bg-brand-blue-bright px-2.5 py-1.5 text-xs font-medium text-content-white"
              >
                <Icon name="external" size={14} /> Export
              </button>
              <button
                type="button"
                disabled={!isDirty}
                onClick={resetAll}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium",
                  isDirty
                    ? "bg-surface-1 text-content hover:bg-surface-adaptive"
                    : "cursor-not-allowed text-content-tertiary opacity-50",
                )}
              >
                Reset all
              </button>
              <span className="ml-auto text-[10px] text-content-tertiary">
                editing {editingTheme}
              </span>
            </div>

            {/* token groups */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
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
                        <TokenRow key={t.name} token={t} theme={editingTheme} />
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
    </>
  );
}

function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-stroke bg-surface-1 p-0.5">
      {(["light", "dark"] as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize transition-colors",
            theme === t ? "bg-surface text-content shadow-sm" : "text-content-secondary",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
