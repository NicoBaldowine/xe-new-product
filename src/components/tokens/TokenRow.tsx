"use client";

import type { TokenDef, Theme } from "@/lib/tokens/types";
import { useTokens } from "./TokenProvider";
import { ColorField } from "./ColorField";
import { DimensionField } from "./DimensionField";
import { Icon } from "@/components/primitives/Icon";

/** One editable token row: label + field for the active theme + per-token reset. */
export function TokenRow({ token, theme }: { token: TokenDef; theme: Theme }) {
  const { getValue, setValue, resetToken, edits } = useTokens();
  // Theme-invariant tokens always edit the light slot.
  const activeTheme: Theme = token.dark == null ? "light" : theme;
  const value = getValue(token.name, activeTheme);
  const edited = token.name in edits;

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-mono text-xs text-content" title={token.name}>
            {token.name}
          </span>
          {token.dark == null && (
            <span className="rounded bg-surface-1 px-1 text-[10px] text-content-tertiary">fixed</span>
          )}
          {edited && (
            <button
              type="button"
              aria-label={`Reset ${token.name}`}
              onClick={() => resetToken(token.name)}
              className="ml-auto grid h-4 w-4 place-items-center rounded text-content-tertiary hover:text-content"
            >
              <Icon name="convert" size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="w-40 shrink-0">
        {token.type === "color" ? (
          <ColorField value={value} onChange={(v) => setValue(token.name, activeTheme, v)} />
        ) : (
          <DimensionField value={value} onChange={(v) => setValue(token.name, activeTheme, v)} />
        )}
      </div>
    </div>
  );
}
