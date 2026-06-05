"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXPORTERS, type ExportFormatId } from "@/lib/tokens/export";
import { TOKENS } from "@/lib/tokens/registry";
import { useTokens } from "./TokenProvider";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

export function ExportDialog({ onClose }: { onClose: () => void }) {
  const { snapshot, isDirty } = useTokens();
  const [active, setActive] = useState<ExportFormatId>("dtcg");
  const [copied, setCopied] = useState(false);

  const fmt = EXPORTERS.find((f) => f.id === active)!;
  const text = useMemo(
    () => fmt.serialize({ tokens: TOKENS, resolved: snapshot() }),
    [fmt, snapshot],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function download() {
    const blob = new Blob([text], { type: fmt.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xe-tokens.${fmt.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] grid place-items-center bg-glass-black p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-stroke bg-surface"
        >
          <div className="flex items-center gap-2 border-b border-stroke px-5 py-3">
            <h2 className="font-display text-sm font-semibold text-content">Export tokens</h2>
            {isDirty && (
              <span className="rounded-full bg-info-muted px-2 py-0.5 text-[10px] font-medium text-info-on-muted">
                edited
              </span>
            )}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="ml-auto grid h-7 w-7 place-items-center rounded-md text-content-secondary hover:bg-surface-1 hover:text-content"
            >
              <Icon name="plus" size={16} className="rotate-45" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-stroke px-3 py-2">
            {EXPORTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  f.id === active
                    ? "bg-action text-content-white"
                    : "text-content-secondary hover:bg-surface-1 hover:text-content",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {fmt.hint && (
            <p className="border-b border-stroke bg-surface-1 px-5 py-2 text-[11px] leading-relaxed text-content-secondary">
              {fmt.hint}
            </p>
          )}

          <pre className="m-0 flex-1 overflow-auto bg-surface-1 p-4 font-mono text-xs leading-relaxed text-content">
            {text}
          </pre>

          <div className="flex items-center justify-end gap-2 border-t border-stroke px-5 py-3">
            <button
              type="button"
              onClick={copy}
              className="rounded-xl bg-surface-1 px-3 py-2 text-xs font-medium text-content hover:bg-surface-adaptive"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={download}
              className="rounded-xl bg-action px-3 py-2 text-xs font-medium text-content-white"
            >
              Download .{fmt.ext}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
