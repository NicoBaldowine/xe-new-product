"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { parseTokens } from "@/lib/tokens/import";
import { useTokens } from "./TokenProvider";
import { Icon } from "@/components/primitives/Icon";

/** Paste a token document (DTCG JSON or CSS variables) and apply it as edits. */
export function ImportDialog({ onClose }: { onClose: () => void }) {
  const { applyEdits } = useTokens();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function doImport() {
    try {
      const edits = parseTokens(text);
      const count = Object.keys(edits).length;
      if (!count) {
        setError("No matching tokens found.");
        return;
      }
      applyEdits(edits);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse input.");
    }
  }

  return (
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
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-card border border-stroke bg-surface"
      >
        <div className="flex items-center gap-2 border-b border-stroke px-5 py-3">
          <h2 className="font-display text-sm font-semibold text-content">Import tokens</h2>
          <span className="text-xs text-content-tertiary">DTCG JSON or CSS variables</span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="ml-auto grid h-7 w-7 place-items-center rounded-md text-content-secondary hover:bg-surface-1 hover:text-content"
          >
            <Icon name="plus" size={16} className="rotate-45" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          placeholder={'Paste an exported token file here…\n\n{\n  "Content": { "content-base": { "$type": "color", "$value": "#0a0a0a" } }\n}'}
          spellCheck={false}
          className="m-0 h-72 w-full resize-none bg-surface-1 p-4 font-mono text-xs leading-relaxed text-content outline-none"
        />

        <div className="flex items-center gap-3 border-t border-stroke px-5 py-3">
          {error && <span className="text-xs text-danger">{error}</span>}
          <button
            type="button"
            onClick={doImport}
            className="ml-auto rounded-xl bg-brand-blue-bright px-3 py-2 text-xs font-medium text-content-white"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
