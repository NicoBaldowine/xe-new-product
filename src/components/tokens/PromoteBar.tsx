"use client";

import { useState } from "react";
import { useTokens } from "./TokenProvider";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/cn";

const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Turns the current live token edits into a global decision: writes them into
 * the source of truth (registry.ts + globals.css) via the dev-only promote API,
 * then the provider clears the override layer. Renders nothing in production or
 * when there's nothing to promote.
 */
export function PromoteBar({ className }: { className?: string }) {
  const { isDirty, edits, promoteToSource } = useTokens();
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!IS_DEV) return null;
  // Show while there are edits, or briefly after a successful save / on error.
  if (!isDirty && status !== "done" && status !== "error") return null;

  const count = Object.keys(edits).length;

  async function promote() {
    setStatus("saving");
    const r = await promoteToSource();
    if (r.ok) {
      setStatus("done");
      const n = r.count ?? count;
      setMessage(`Saved ${n} token${n === 1 ? "" : "s"} to source — this is the new default.`);
    } else {
      setStatus("error");
      setMessage(r.error ?? "Could not write to source.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border border-stroke bg-surface-1 p-3", className)}>
      {isDirty ? (
        <>
          <p className="text-[11px] leading-snug text-content-secondary">
            <b className="text-content">{count}</b> live edit{count === 1 ? "" : "s"} not yet in the source of
            truth. Promote to make {count === 1 ? "it" : "them"} the new global default.
          </p>
          <button
            type="button"
            onClick={promote}
            disabled={status === "saving"}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-button px-3 py-2 text-xs font-semibold text-content-white transition-colors",
              status === "saving" ? "cursor-wait bg-action/70" : "bg-action hover:brightness-95",
            )}
          >
            <Icon name="check" size={14} />
            {status === "saving" ? "Saving…" : "Make global decision"}
          </button>
          {status === "error" && <p className="text-[11px] text-danger">{message}</p>}
        </>
      ) : (
        <p className="flex items-center gap-1.5 text-[11px] text-success">
          <Icon name="check" size={14} /> {message}
        </p>
      )}
    </div>
  );
}
