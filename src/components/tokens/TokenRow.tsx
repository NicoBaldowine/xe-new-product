"use client";

import type { TokenDef, Theme } from "@/lib/tokens/types";
import { useTokens } from "./TokenProvider";
import { ColorField } from "./ColorField";
import { DimensionField } from "./DimensionField";
import { FontField } from "./FontField";
import { Icon } from "@/components/primitives/Icon";

export type EditMode = "light" | "dark" | "both";

function Field({
  token,
  theme,
}: {
  token: TokenDef;
  theme: Theme;
}) {
  const { getValue, setValue } = useTokens();
  const value = getValue(token.name, theme);
  const onChange = (v: string) => setValue(token.name, theme, v);
  if (token.type === "color") return <ColorField value={value} onChange={onChange} />;
  if (token.type === "fontFamily") return <FontField value={value} onChange={onChange} />;
  return <DimensionField value={value} onChange={onChange} />;
}

/** One editable token row. Shows light/dark/both fields, a usage tooltip, and per-token reset. */
export function TokenRow({ token, mode }: { token: TokenDef; mode: EditMode }) {
  const { resetToken, edits } = useTokens();
  const edited = token.name in edits;
  const invariant = token.dark == null;
  // Theme-invariant tokens always edit the single (light) slot.
  const showBoth = mode === "both" && !invariant;

  return (
    <div className="flex items-center gap-2 py-1.5" title={token.description}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate font-mono text-xs text-content" title={`${token.name} — ${token.description}`}>
            {token.name}
          </span>
          <span
            className="cursor-help text-content-tertiary"
            title={token.description}
            aria-label={token.description}
          >
            <Icon name="help" size={11} />
          </span>
          {invariant && (
            <span
              className="rounded bg-surface-1 px-1 text-[10px] text-content-tertiary"
              title="Theme-invariant — the same value in light and dark."
            >
              fixed
            </span>
          )}
          {edited && (
            <button
              type="button"
              aria-label={`Reset ${token.name}`}
              title="Reset to default"
              onClick={() => resetToken(token.name)}
              className="ml-auto grid h-4 w-4 place-items-center rounded text-content-tertiary hover:text-content"
            >
              <Icon name="convert" size={12} />
            </button>
          )}
        </div>
      </div>
      {showBoth ? (
        <div className="flex w-48 shrink-0 gap-1.5">
          <div className="flex-1" title="Light">
            <Field token={token} theme="light" />
          </div>
          <div className="flex-1" title="Dark">
            <Field token={token} theme="dark" />
          </div>
        </div>
      ) : (
        <div className="w-40 shrink-0">
          <Field token={token} theme={invariant ? "light" : (mode as Theme)} />
        </div>
      )}
    </div>
  );
}
